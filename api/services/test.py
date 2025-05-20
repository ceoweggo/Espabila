from fastapi import HTTPException, status
from typing import Dict, Any, List, Optional, Union
from datetime import datetime
from bson.objectid import ObjectId
from enum import Enum

import uuid
import logging

from models.test import *
from app.processor import TestProcessor
from utils.parser import parse_responses
from database import (
    test_results_collection, users_collection,
    test_sessions_collection, test_profiles_collection,
    test_blocks_collection
)

# Logger
logger = logging.getLogger(__name__)

class TestService:
    """
    Service for processing test responses and managing test sessions.
    """
        
    def __init__(self):
        self.processor = TestProcessor()
    
    def create_new_test(self, language: str = "en") -> Dict[str, Any]:
        """
        Creates a new test for the user, returning the question blocks
        
        Args:
            language: Test language ('en' for English, 'es' for Spanish)
                
        Returns:
            Dict with test structure, including test ID and question blocks
        """
        # Generate unique ID for this test
        test_id = str(uuid.uuid4())
        
        # Get question blocks from processor
        question_blocks = self.processor.create_new_test(language)
        
        # Format response based on language
        formatted_blocks = []
        for block in question_blocks:
            formatted_block = {
                'id': block.id,
                'title': block.title_es if language == 'es' else block.title,
                'description': block.description_es if language == 'es' else block.description,
                'questions': []
            }
            
            for question in block.questions:
                formatted_question = {
                    'id': question.id,
                    'text': question.text_es if language == 'es' else question.text,
                    'type': question.type.value,
                }
                
                # Add specific fields based on question type
                if question.type == QuestionType.MULTIPLE_CHOICE or question.type == QuestionType.MULTIPLE_SELECT:
                    formatted_question['options'] = [
                        opt.text_es if language == 'es' else opt.text 
                        for opt in question.options
                    ]
                    
                    if question.max_options:
                        formatted_question['maxOptions'] = question.max_options
                
                elif question.type == QuestionType.SCALE:
                    formatted_question['minValue'] = question.min_value
                    formatted_question['maxValue'] = question.max_value
                    formatted_question['minLabel'] = question.min_label_es if language == 'es' else question.min_label
                    formatted_question['maxLabel'] = question.max_label_es if language == 'es' else question.max_label
                    formatted_question['items'] = question.items_es if language == 'es' else question.items
                
                elif question.type == QuestionType.OPEN:
                    formatted_question['minValue'] = question.min_value
                    formatted_question['maxValue'] = question.max_value
                    
                    if question.sub_question:
                        formatted_question['subQuestion'] = (
                            question.sub_question_es if language == 'es' else question.sub_question
                        )
                
                formatted_block['questions'].append(formatted_question)
            
            formatted_blocks.append(formatted_block)
        
        return {
            'test_id': test_id,
            'language': language,
            'created_at': datetime.now().isoformat(),
            'blocks': formatted_blocks
        }
        
    async def process_test_responses(
        self, user_data: Dict[str, Any], test_responses: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Processes test responses and generates a personalized result
        
        Args:
            user_data: Basic user data (name, email, etc.)
            test_responses: Dictionary with question responses
            
        Returns:
            Dict with the complete analysis result
        """
        try:
            # Load data asynchronously into the processor
            await self.processor._load_data()

            question_blocks = await test_blocks_collection.find().to_list(length=None)
            
            # Convert to internal format
            formatted_responses = parse_responses(test_responses, question_blocks)
            print("Obtiene las respuestas formatedas del parser: ", formatted_responses)
            # Process responses
            result = self.processor.process_responses(user_data, formatted_responses)
            print("Obtiene el resultado procesdo: ", result)
            
            # Convert dataclass objects to dictionaries
            def convert_to_dict(obj):
                if isinstance(obj, Enum):
                    return str(obj)
                elif hasattr(obj, '__dict__'):
                    return {k: convert_to_dict(v) for k, v in obj.__dict__.items()}
                elif hasattr(obj, '_asdict'):  # For namedtuples
                    return {k: convert_to_dict(v) for k, v in obj._asdict().items()}
                elif isinstance(obj, list):
                    return [convert_to_dict(item) for item in obj]
                elif isinstance(obj, dict):
                    return {k: convert_to_dict(v) for k, v in obj.items()}
                elif hasattr(obj, 'dict'):  # For Pydantic models
                    return convert_to_dict(obj.dict())
                return obj

            # Convert all objects to dictionaries
            result_dict = convert_to_dict(result)
            
            # Format for response
            response = {
                "user_id": result_dict["user_profile"]["id"],
                "name": result_dict["user_profile"]["name"],
                "personality_summary": {
                    "mbti_type": str(result_dict["user_profile"]["mbti_type"]),
                    "top_traits": result_dict["trait_summary"].get("top_traits", [])
                },
                "trait_scores": result_dict["user_profile"]["trait_scores"],
                "mbti_scores": result_dict["user_profile"]["mbti_scores"],
                "mbti_analysis": result_dict["mbti_analysis"],
                "ikigai_scores": result_dict["user_profile"]["ikigai_scores"],
                "ikigai_analysis": result_dict["ikigai_analysis"],
                "recommendations": {
                    "personalities": [p["id"] for p in result_dict["recommended_personalities"]],
                    "activities": [{
                        "id": a["id"],
                        "name": a["name"],
                        "name_es": a["name_es"] if hasattr(a, "name_es") else a["name"]
                    } for a in result_dict["recommended_activities"]],
                    "professions": [{
                        "id": p["id"],
                        "name": p["name"],
                        "name_es": p["name_es"] if hasattr(p, "name_es") else p["name"]
                    } for p in result_dict["recommended_professions"]],
                    "skills": [{
                        "id": s["id"],
                        "name": s["name"],
                        "name_es": s["name_es"] if hasattr(s, "name_es") else s["name"]
                    } for s in result_dict["recommended_skills"]],
                    "interests": [{
                        "id": i["id"],
                        "name": i["name"],
                        "name_es": i["name_es"] if hasattr(i, "name_es") else i["name"]
                    } for i in result_dict["recommended_interests"]],
                    "advices": [a["id"] for a in result_dict["recommended_advices"]]
                },
                "development_areas": [area["name"] for area in result_dict["development_suggestions"].get("areas", [])],
                "type": "personality"
            }
            
            return response
            
        except Exception as e:
            logger.error(f"Error processing test responses: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to process test responses: {str(e)}"
            )
    
    def generate_ikigai_visualization(self, ikigai_scores: Dict[str, int]) -> Dict[str, Any]:
        """
        Generates data for visualizing the user's Ikigai profile
        
        Args:
            ikigai_scores: Scores for the Ikigai areas
            
        Returns:
            Dict with data for visualization
        """
        areas = {
            'passion': ikigai_scores.get('passion', 0),
            'mission': ikigai_scores.get('mission', 0),
            'profession': ikigai_scores.get('profession', 0),
            'vocation': ikigai_scores.get('vocation', 0)
        }
        
        # Calculate intersections
        intersections = {
            'love_good_at': (areas['passion'] + areas['vocation']) / 2,
            'love_world_needs': (areas['passion'] + areas['mission']) / 2,
            'good_at_paid_for': (areas['vocation'] + areas['profession']) / 2,
            'world_needs_paid_for': (areas['mission'] + areas['profession']) / 2
        }
        
        # Ikigai center (overall average)
        ikigai_center = sum(areas.values()) / len(areas)
        
        return {
            'areas': areas,
            'intersections': intersections,
            'center': ikigai_center,
            'labels': {
                'passion': 'What You Love',
                'mission': 'What the World Needs',
                'profession': 'What You Can Be Paid For',
                'vocation': 'What You Are Good At',
                'love_good_at': 'Joyful Mastery',
                'love_world_needs': 'Delight & Fulfillment',
                'good_at_paid_for': 'Competence & Security',
                'world_needs_paid_for': 'Impact & Value',
                'center': 'Ikigai'
            },
            'descriptions': {
                'passion': 'Activities and interests that bring you joy and fulfillment',
                'mission': 'How your skills and interests can help others and make a positive impact',
                'profession': 'Skills and activities that have economic value in the job market',
                'vocation': 'Your natural talents and abilities that you can develop into expertise'
            }
        }
    
    def generate_trait_radar_chart(self, trait_scores: Dict[str, int]) -> Dict[str, Any]:
        """
        Generates data for visualizing the trait profile in a radar chart
        
        Args:
            trait_scores: Scores for personality traits
            
        Returns:
            Dict with data for radar chart visualization
        """ 
        # Select main traits for the chart (to avoid visual overload)
        top_traits = sorted(trait_scores.items(), key=lambda x: x[1], reverse=True)[:8]
        
        # Visualization data
        return {
            'labels': [self.processor.traits_map[t[0]].name if t[0] in self.processor.traits_map else t[0] 
                    for t in top_traits],
            'scores': [t[1] for t in top_traits],
            'categories': [str(self.processor.traits_map[t[0]].category) if t[0] in self.processor.traits_map else "Other" 
                        for t in top_traits]
        }


class Sessions:
    """
    Manages user sessions. The usefulness of sessions is to be able to retrieve answers 
    if you left a session open or pending, and not have to start over (especially useful for the long test).
    """
    
    def __init__(self, test_service):
        """Initialize with a reference to the parent TestService"""
        self.test_service = test_service
    
    @staticmethod
    async def create_test_session(user_id, test_type):
        """
        Collects "user_id" and "test_type" to associate the session with the user.
        
        If user already has an open session of the test type, then
        returns the possibility to continue with the test or start a new one
        
        Args:
            user_id: User identifier
            test_type: Type of test ("quick", "comprehensive")
            
        Returns:
            Session information including ID and status
        """
        # Search session by user_id and test_type
        is_test_active = await test_sessions_collection.find_one_and_update({
            'user_id': ObjectId(user_id), 
            "test_type": test_type, 
            "status": "in_progress"
        }, {
            '$set': {
                "updated_at": datetime.now()
            }
        })
        
        if is_test_active:
            is_test_active['_id'] = str(is_test_active['_id'])
            is_test_active['user_id'] = str(is_test_active['user_id'])
            is_test_active['updated_at'] = datetime.now()
            
            return is_test_active
        else:
            # Create session
            session = {
                "user_id": ObjectId(user_id),
                "test_type": test_type,
                "start_time": datetime.now(),
                "end_time": None,
                "questions": [],
                "status": "in_progress",
                "created_at": datetime.now()
            }
            
            # Insert session
            result = await test_sessions_collection.insert_one(session)
            
            # Get created session
            created_session = await test_sessions_collection.find_one({"_id": result.inserted_id})
            
            # Convert ObjectId to string for response
            created_session["_id"] = str(created_session["_id"])
            created_session["user_id"] = str(created_session["user_id"])
            
            return created_session

    @staticmethod
    async def reset_test_session(session_id, user_id):
        """
        Start over the test session (reset answers)
        
        Args:
            session_id: Session identifier
            user_id: User identifier
            
        Returns:
            Status message
        """
        try:
            # Get session
            session = await test_sessions_collection.find_one_and_delete({
                "_id": ObjectId(session_id),
                "user_id": ObjectId(user_id)
            })
            
            if not session:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Test session not found"
                )
            
            return {
                "status_code": 200,
                "message": "Session was deleted!"
            }
        except Exception as e:
            logger.error(f"Error updating test session batch: {e}")
            raise
    
    @staticmethod
    async def update_test_session_batch(session_id, user_id, processed_answers):
        """
        Update a test session with multiple results
        Stores answers without the concept of correct/incorrect
        
        Args:
            session_id: Session identifier
            user_id: User identifier
            processed_answers: List of question responses
            
        Returns:
            Updated session information
        """
        try:
            # Get session
            session = await test_sessions_collection.find_one({
                "_id": ObjectId(session_id),
                "user_id": ObjectId(user_id)
            })
            
            if not session:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail="Test session not found"
                )
            
            # Check if session is already completed
            if session.get("status") == "completed":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Test session is already completed"
                )
            
            current_answers = session.get("answers", {})
            
            # Process each new result
            for processed_answer in processed_answers:
                # Convert result to appropriate value in answers dictionary
                current_answers[processed_answer.question_id] = processed_answer.response
            
            # Update statistics
            completed_questions = len(current_answers)
            
            if session.get("test_type") == 'quick':
                total_questions = 20
            else:
                total_questions = 90
            
            # Calculate completion percentage
            completion_percentage = (completed_questions / total_questions * 100) if total_questions > 0 else 0
            
            # Check if test is complete
            status_value = "in_progress"
            end_time = None
            
            # Prepare the update operation
            update_data = {
                "answers": current_answers,
                "completed_questions": completed_questions,
                "completion_percentage": completion_percentage,
                "status": status_value,
                "updated_at": datetime.now()
            }
            
            # Only set end_time if the test is completed
            if end_time:
                update_data["end_time"] = end_time
            
            # Update session
            await test_sessions_collection.update_one(
                {"_id": ObjectId(session_id)},
                {"$set": update_data}
            )
            
            # Get updated session
            updated_session = await test_sessions_collection.find_one({"_id": ObjectId(session_id)})
            
            # Convert ObjectId to string
            updated_session["_id"] = str(updated_session["_id"])
            updated_session["user_id"] = str(updated_session["user_id"])
            
            return updated_session
        except Exception as e:
            logger.error(f"Error updating test session batch: {e}")
            raise
    
    async def complete_test_session(self, session_id, user_id):
        """
        Mark a test session as completed and process the results to create
        or update a user profile based on test responses
        
        Args:
            session_id: Session identifier
            user_id: User identifier
            
        Returns:
            Completed session with test results
        """
        try:
            print("Entra en el complete test session")
            # Get session with answers
            session = await test_sessions_collection.find_one({
                "_id": ObjectId(session_id),
                "user_id": ObjectId(user_id)
            })
            
            if not session:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Test session not found"
                )
            
            # Check if already completed
            if session.get("status") == "completed":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Test session is already completed"
                )
            
            # Get user data
            user = await users_collection.find_one({"_id": ObjectId(user_id)})
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            # Prepare user data for processing
            user_data = {
                "name": user.get("name", ""),
                "email": user.get("email", ""),
                "id": str(user["_id"])
            }
            print("Obtiene el user data: ", user_data)
            # Get test answers
            test_answers = session.get("answers", {})
            if not test_answers:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No test answers found"
                )
            print("Obteien las answers: ", test_answers)
            # Process test responses
            try:
                test_result = await self.test_service.process_test_responses(user_data, test_answers)
            except Exception as e:
                logger.error(f"Error processing test responses: {e}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to process test responses: {str(e)}"
                )
            
            # Save test result 
            test_result_id = await self._save_test_result(user_id, session_id, test_result)
            
            # Update or create user profile
            profile_id = await self._update_user_profile(user_id, test_result)
            
            # Update the session status
            end_time = datetime.now()
            await test_sessions_collection.update_one(
                {"_id": ObjectId(session_id)},
                {"$set": {
                    "status": "completed",
                    "end_time": end_time,
                    "updated_at": end_time,
                    "test_result_id": test_result_id,
                    "profile_id": profile_id
                }}
            )
            
            # Get updated session
            updated_session = await test_sessions_collection.find_one({"_id": ObjectId(session_id)})
            
            # Convert ObjectId to string
            updated_session["_id"] = str(updated_session["_id"])
            updated_session["user_id"] = str(updated_session["user_id"])
            updated_session["profile_id"] = str(updated_session["profile_id"])
            updated_session["test_result_id"] = str(updated_session["test_result_id"])
            
            # Add processed results
            updated_session["test_result"] = test_result
            
            return updated_session
        
        except HTTPException:
            # Re-raise HTTP exceptions
            raise
        except Exception as e:
            logger.error(f"Error completing test session: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error completing test session: {str(e)}"
            )
            
    async def _save_test_result(self, user_id, session_id, test_result):
        """
        Save the processed test result to the test_results collection
        
        Args:
            user_id: User identifier
            session_id: Session identifier
            test_result: Processed test result
            
        Returns:
            ID of the saved test result
        """
        # Clean MBTI type by removing the 'MBTIType.' prefix
        mbti_type = test_result["personality_summary"]["mbti_type"]
        if isinstance(mbti_type, str) and mbti_type.startswith("MBTIType."):
            mbti_type = mbti_type.replace("MBTIType.", "")

        result_doc = {
            "user_id": ObjectId(user_id),
            "session_id": ObjectId(session_id),
            "test_type": "personality",
            "mbti_type": mbti_type,
            "trait_scores": test_result["trait_scores"],
            "mbti_scores": test_result["mbti_scores"],
            "ikigai_scores": test_result["ikigai_scores"],
            "recommended_personalities": test_result["recommendations"]["personalities"],
            "recommended_activities": test_result["recommendations"]["activities"],
            "recommended_professions": test_result["recommendations"]["professions"],
            "recommended_skills": test_result["recommendations"]["skills"],
            "recommended_interests": test_result["recommendations"]["interests"],
            "recommended_advices": test_result["recommendations"]["advices"],
            "development_areas": test_result["development_areas"],
            "created_at": datetime.now()
        }
        
        # Insert the test result
        result = await test_results_collection.insert_one(result_doc)
        return result.inserted_id
        
    async def _update_user_profile(self, user_id, test_result):
        """
        Update or create the user profile based on test results
        If user already has a profile, blend the new results with the existing ones
        
        Args:
            user_id: User identifier
            test_result: Processed test result
            
        Returns:
            ID of the user profile
        """
        # Clean MBTI type by removing the 'MBTIType.' prefix
        mbti_type = test_result["personality_summary"]["mbti_type"]
        if isinstance(mbti_type, str) and mbti_type.startswith("MBTIType."):
            mbti_type = mbti_type.replace("MBTIType.", "")

        # Check if user already has a profile
        existing_profile = await test_profiles_collection.find_one({"user_id": ObjectId(user_id)})
        
        if existing_profile:
            # Blend new results with existing profile
            updated_profile = self._blend_profiles(existing_profile, test_result)
            
            # Update the profile
            await test_profiles_collection.update_one(
                {"_id": existing_profile["_id"]},
                {"$set": {
                    "mbti_type": mbti_type,
                    "trait_scores": updated_profile["trait_scores"],
                    "mbti_scores": updated_profile["mbti_scores"],
                    "ikigai_scores": updated_profile["ikigai_scores"],
                    "recommended_personalities": updated_profile["recommended_personalities"],
                    "recommended_activities": updated_profile["recommended_activities"],
                    "recommended_professions": updated_profile["recommended_professions"],
                    "recommended_skills": updated_profile["recommended_skills"],
                    "recommended_interests": updated_profile["recommended_interests"],
                    "recommended_advices": updated_profile["recommended_advices"],
                    "development_areas": updated_profile["development_areas"],
                    "updated_at": datetime.now()
                }}
            )
            
            return existing_profile["_id"]
        else:
            # Create new profile
            profile_doc = {
                "user_id": ObjectId(user_id),
                "mbti_type": mbti_type,
                "trait_scores": test_result["trait_scores"],
                "mbti_scores": test_result["mbti_scores"],
                "ikigai_scores": test_result["ikigai_scores"],
                "recommended_personalities": test_result["recommendations"]["personalities"],
                "recommended_activities": test_result["recommendations"]["activities"],
                "recommended_professions": test_result["recommendations"]["professions"],
                "recommended_skills": test_result["recommendations"]["skills"],
                "recommended_interests": test_result["recommendations"]["interests"],
                "recommended_advices": test_result["recommendations"]["advices"],
                "development_areas": test_result["development_areas"],
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }
            
            result = await test_profiles_collection.insert_one(profile_doc)
            return result.inserted_id
    
    def _blend_profiles(self, existing_profile, new_results, weight_new=0.6):
        """
        Blend an existing profile with new test results to create an updated profile.
        
        Args:
            existing_profile: Dictionary containing the existing profile data
            new_results: Dictionary containing the new test results
            weight_new: Weight to give to new results (0-1), default 0.6
            
        Returns:
            Dictionary with the blended profile
        """
        weight_old = 1 - weight_new
        
        # Helper function to blend dictionaries of scores
        def blend_scores(existing, new):
            blended = {}
            all_keys = set(existing.keys()) | set(new.keys())
            
            for key in all_keys:
                if key in existing and key in new:
                    # Both have this attribute - weighted average
                    blended[key] = round(existing[key] * weight_old + new[key] * weight_new)
                elif key in existing:
                    # Only in existing - keep with slight decay
                    blended[key] = existing[key]
                else:
                    # Only in new - add as is
                    blended[key] = new[key]
                    
            return blended
        
        # Blend trait scores
        blended_trait_scores = blend_scores(
            existing_profile.get("trait_scores", {}),
            new_results.get("trait_scores", {})
        )
        
        # Blend MBTI scores
        blended_mbti_scores = blend_scores(
            existing_profile.get("mbti_scores", {}),
            new_results.get("mbti_scores", {})
        )
        
        # Determine new MBTI type based on blended scores
        mbti_type = ""
        mbti_type += "E" if blended_mbti_scores.get('E', 0) > blended_mbti_scores.get('I', 0) else "I"
        mbti_type += "S" if blended_mbti_scores.get('S', 0) > blended_mbti_scores.get('N', 0) else "N"
        mbti_type += "T" if blended_mbti_scores.get('T', 0) > blended_mbti_scores.get('F', 0) else "F"
        mbti_type += "J" if blended_mbti_scores.get('J', 0) > blended_mbti_scores.get('P', 0) else "P"
        
        # Blend Ikigai scores
        blended_ikigai_scores = blend_scores(
            existing_profile.get("ikigai_scores", {}),
            new_results.get("ikigai_scores", {})
        )
        
        # Function to blend recommendation lists
        def blend_recommendation_lists(new_list, existing_list, max_items):
            # Start with new recommendations (prioritize these)
            blended = list(new_list)
            
            # Add some existing items that aren't in the new list
            remaining_slots = max_items - len(blended)
            if remaining_slots > 0:
                unique_existing = [item for item in existing_list if item not in blended]
                blended.extend(unique_existing[:remaining_slots])
            
            # Ensure we don't exceed max_items
            return blended[:max_items]
        
        # Blend recommendations
        blended_personalities = blend_recommendation_lists(
            new_results.get("recommendations", {}).get("personalities", []),
            existing_profile.get("recommended_personalities", []),
            4  # Limit to 4 personalities
        )
        
        blended_activities = blend_recommendation_lists(
            new_results.get("recommendations", {}).get("activities", []),
            existing_profile.get("recommended_activities", []),
            10  # Limit to 10 activities
        )
        
        blended_professions = blend_recommendation_lists(
            new_results.get("recommendations", {}).get("professions", []),
            existing_profile.get("recommended_professions", []),
            4  # Limit to 4 professions
        )
        
        blended_skills = blend_recommendation_lists(
            new_results.get("recommendations", {}).get("skills", []),
            existing_profile.get("recommended_skills", []),
            5  # Limit to 5 skills
        )
                
        blended_interests = blend_recommendation_lists(
            new_results.get("recommendations", {}).get("interests", []),
            existing_profile.get("recommended_interests", []),
            5  # Limit to 5 interests
        )
        
        blended_advices = blend_recommendation_lists(
            new_results.get("recommendations", {}).get("advices", []),
            existing_profile.get("recommended_advices", []),
            5  # Limit to 5 advices
        )
        
        # Development areas - take from newest test
        development_areas = new_results.get("development_areas", [])
        
        # Return blended profile
        return {
            "mbti_type": str(mbti_type).replace("MBTIType.", ""),
            "trait_scores": blended_trait_scores,
            "mbti_scores": blended_mbti_scores,
            "ikigai_scores": blended_ikigai_scores,
            "recommended_personalities": blended_personalities,
            "recommended_activities": blended_activities,
            "recommended_professions": blended_professions,
            "recommended_skills": blended_skills,
            "recommended_interests": blended_interests,
            "recommended_advices": blended_advices,
            "development_areas": development_areas
        }


class PersonalitySystem:
    """
    Main personality and recommendation system.
    
    This class provides an interface for all system functionalities:
    - Create and manage tests
    - Process responses and generate results
    - Offer personalized recommendations
    - Visualize personality profiles
    """
    
    def __init__(self):
        self.test_service = TestService()
        self.sessions = Sessions(self.test_service)
        
    async def create_test(self, language: str = "es") -> Dict[str, Any]:
        """
        Create a new test for the user
        
        Args:
            language: Test language ('en' for English, 'es' for Spanish)
            
        Returns:
            Dict with test structure
        """
        return self.test_service.create_new_test(language)
    
    async def process_test(self, user_data: Dict[str, Any], test_responses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Process test responses and return complete result
        
        Args:
            user_data: Basic user data (name, email, etc.)
            test_responses: List of test question responses
            
        Returns:
            Dict with complete analysis result
        """
        return await self.test_service.process_test_responses(user_data, test_responses)
    
    async def create_session(self, user_id: str, test_type: str) -> Dict[str, Any]:
        """
        Create a new test session or return an existing one
        
        Args:
            user_id: User identifier
            test_type: Type of test ('quick', 'comprehensive', etc.)
            
        Returns:
            Dict with session information
        """
        return await self.sessions.create_test_session(user_id, test_type)
    
    async def update_session(self, session_id: str, user_id: str, answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Update a test session with new answers
        
        Args:
            session_id: Session identifier
            user_id: User identifier
            answers: List of test answers
            
        Returns:
            Dict with updated session information
        """
        try:
            # Obtener los bloques de preguntas para usar en el análisis
            question_blocks = await test_blocks_collection.find().to_list(length=None)
            
            # Convertir respuestas al formato interno
            processed_answers = parse_responses(answers, question_blocks)
            print("Pasa el processed answer: ", processed_answers)
            
            if not processed_answers:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No valid answers provided"
                )
            
            return await self.sessions.update_test_session_batch(session_id, user_id, processed_answers)
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating session: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating session: {str(e)}"
            )
    
    async def complete_session(self, session_id: str, user_id: str) -> Dict[str, Any]:
        """
        Complete a test session and process the results
        
        Args:
            session_id: Session identifier
            user_id: User identifier
            
        Returns:
            Dict with completed session and test results
        """
        return await self.sessions.complete_test_session(session_id, user_id)
    
    async def reset_session(self, session_id: str, user_id: str) -> Dict[str, Any]:
        """
        Reset a test session (delete it)
        
        Args:
            session_id: Session identifier
            user_id: User identifier
            
        Returns:
            Dict with status information
        """
        return await self.sessions.reset_test_session(session_id, user_id)
    
    async def get_ikigai_visualization(self, ikigai_scores: Dict[str, int]) -> Dict[str, Any]:
        """
        Generate data for visualizing the Ikigai profile
        
        Args:
            ikigai_scores: Scores for Ikigai areas
            
        Returns:
            Dict with visualization data
        """
        return self.test_service.generate_ikigai_visualization(ikigai_scores)
    
    async def get_trait_visualization(self, trait_scores: Dict[str, int]) -> Dict[str, Any]:
        """
        Generate data for visualizing the trait profile
        
        Args:
            trait_scores: Scores for personality traits
            
        Returns:
            Dict with visualization data
        """
        return self.test_service.generate_trait_radar_chart(trait_scores)
    
    async def get_personality_narrative(self, result: Dict[str, Any]) -> str:
        """
        Generate a personalized narrative about the profile
        
        Args:
            result: Complete test result
            
        Returns:
            Descriptive text of the personality
        """
        user_profile = result
        mbti = result['personality_summary']['mbti_type']
        
        # Top 3 traits
        top_traits = [
            trait['name'] for trait in result['personality_summary']['top_traits'][:3]
        ]
        
        # Strongest Ikigai area
        strongest_ikigai = result['ikigai_analysis']['strongest_area']
        ikigai_map = {
            'passion': 'finding activities you truly love',
            'mission': 'making a positive impact in the world',
            'profession': 'developing marketable skills',
            'vocation': 'cultivating your natural talents'
        }
        
        # Similar personality
        similar_personality = result['recommendations']['personalities'][0]['name'] if result['recommendations']['personalities'] else "unique individuals"
        
        # Build narrative
        narrative = f"""Your personality profile shows that you are {mbti}, which means you tend to be {result['mbti_analysis']['description']}.
        
        Your strongest traits are {', '.join(top_traits)}, which give you a unique perspective and approach to challenges.

        In terms of life purpose (Ikigai), you seem particularly drawn to {ikigai_map.get(strongest_ikigai, 'finding your purpose')}.

        Your personality shares interesting similarities with {similar_personality}, suggesting you might find inspiration in their approach to life and work.

        The career paths and activities suggested in your recommendations align with these core aspects of your personality, offering potential directions for growth and fulfillment."""
                
        return narrative
    
    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a user's personality profile
        
        Args:
            user_id: User identifier
            
        Returns:
            Dict with user profile or None if not found
        """
        try:
            profile = await test_profiles_collection.find_one({"user_id": ObjectId(user_id)})
            
            if not profile:
                return None
            
            # Convert ObjectId to string for the response
            profile["_id"] = str(profile["_id"])
            profile["user_id"] = str(profile["user_id"])
            
            return profile
        except Exception as e:
            logger.error(f"Error retrieving user profile: {e}")
            return None
            
    async def get_test_result(self, result_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a specific test result
        
        Args:
            result_id: Test result identifier
            
        Returns:
            Dict with test result or None if not found
        """
        result = await test_results_collection.find_one({"_id": ObjectId(result_id)})
        
        if not result:
            return None
        
        # Convert ObjectId to string for the response
        result["_id"] = str(result["_id"])
        result["user_id"] = str(result["user_id"])
        result["session_id"] = str(result["session_id"])
        
        return result
    
    async def get_user_test_history(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get a user's test history
        
        Args:
            user_id: User identifier
            limit: Maximum number of history items to return
            
        Returns:
            List of test history items
        """
        # Get test sessions for this user
        cursor = test_sessions_collection.find(
            {"user_id": ObjectId(user_id), "status": "completed"}
        ).sort("created_at", -1).limit(limit)
        
        sessions = []
        async for session in cursor:
            # Convert ObjectId to string for the response
            session["_id"] = str(session["_id"])
            session["user_id"] = str(session["user_id"])
            
            if "test_result_id" in session:
                session["test_result_id"] = str(session["test_result_id"])
            
            if "profile_id" in session:
                session["profile_id"] = str(session["profile_id"])
            
            sessions.append(session)
        
        return sessions