from models.test import *
from typing import List, Dict, Tuple, Any
from datetime import datetime
from utils.nlp import process_text

import math
import uuid
import random


class TestProcessor:
    """
    Processes test responses and generates personality profiles.
    """
    
    def __init__(self):
        """
        Initialize processor. Data loading is now done in _load_data.
        """
        # Data attributes are initialized here, but populated by _load_data
        self.traits = []
        self.question_blocks = []
        self.celebrities = []
        self.activities = []
        self.professions = []
        self.skills = []
        self.interests = []
        self.advices = []

        # Maps will be populated after data is loaded
        self.traits_map = {}
        self.celebrities_map = {}
        self.activities_map = {}
        self.professions_map = {}

    async def _load_data(self):
        """
        Load necessary data asynchronously.
        """
        # Load necessary data
        self.traits = await DataRepository.load_traits()
        self.question_blocks = await DataRepository.load_question_blocks()
        self.celebrities = await DataRepository.load_celebrities()
        self.activities = await DataRepository.load_activities()
        self.professions = await DataRepository.load_professions()
        self.skills = await DataRepository.load_skills()
        self.interests = await DataRepository.load_interests()
        self.advices = await DataRepository.load_advices()

        # Create maps for efficient lookups after data is loaded
        self.traits_map = {trait.id: trait for trait in self.traits}
        self.celebrities_map = {celeb.id: celeb for celeb in self.celebrities}
        self.activities_map = {activity.id: activity for activity in self.activities}
        self.professions_map = {profession.id: profession for profession in self.professions}
        self.skills_map = {skill.id: skill for skill in self.skills}
        self.interests_map = {interest.id: interest for interest in self.interests}
        self.advices_map = {advice.id: advice for advice in self.advices}
    
    def create_new_test(self, language: str = "es") -> List[QuestionBlock]:
        """
        Creates a new test, returning the question blocks in the specified language.
        
        Args:
            language: Language code ('en' or 'es')
            
        Returns:
            List of QuestionBlock objects
        """
        return self.question_blocks
    
    def process_responses(self, user_data: Dict[str, Any], test_responses: List[TestResponse]) -> TestResult:
        """
        Process test responses and generate a complete personality profile.
        
        Args:
            user_data: Dictionary with user information
            test_responses: List of TestResponse objects
            
        Returns:
            TestResult object with complete analysis
        """
        # 1. Calculate trait scores
        trait_scores = self._calculate_trait_scores(test_responses)
        print("Trait scores calculados: ", trait_scores)
        # 2. Calculate MBTI scores and type
        mbti_scores, mbti_type = self._calculate_mbti(trait_scores)
        print(mbti_scores, mbti_type)
        # 3. Calculate Ikigai scores
        ikigai_scores = self._calculate_ikigai(trait_scores)
        
        # 4. Generate recommendations
        recommendations = self._generate_recommendations(
            trait_scores, mbti_scores, str(mbti_type).replace("MBTIType.", ""), ikigai_scores
        )
        
        # 5. Create user profile
        user_profile = UserProfile(
            id=user_data.get('id', str(uuid.uuid4())),
            name=user_data.get('name', ''),
            email=user_data.get('email', ''),
            created_at=datetime.now(),
            trait_scores=trait_scores,
            mbti_scores=mbti_scores,
            mbti_type=mbti_type,
            ikigai_scores=ikigai_scores,
            test_responses=test_responses,
            recommendations=recommendations
        )
        
        # 6. Create analysis components
        trait_summary = self._create_trait_summary(trait_scores)
        mbti_analysis = self._create_mbti_analysis(mbti_scores, mbti_type)
        ikigai_analysis = self._create_ikigai_analysis(ikigai_scores)
        development_areas = self._identify_development_areas(trait_scores, mbti_scores, ikigai_scores)
        
        # 7. Create final result
        return TestResult(
            user_profile=user_profile,
            trait_summary=trait_summary,
            mbti_analysis=mbti_analysis,
            ikigai_analysis=ikigai_analysis,
            recommended_personalities=recommendations['personalities'],
            recommended_activities=recommendations['activities'],
            recommended_professions=recommendations['professions'],
            recommended_skills=recommendations['skills'],
            recommended_interests=recommendations['interests'],
            recommended_advices=recommendations['advices'],
            development_suggestions=development_areas
        )
    
    def _calculate_trait_scores(self, test_responses: List[TestResponse]) -> Dict[str, int]:
        """
        Calculate trait scores from test responses.
        
        Args:
            test_responses: List of TestResponse objects
            
        Returns:
            Dictionary of trait scores normalized to 0-100 scale
        """
        # Initialize score and count dictionaries
        trait_scores = {trait.id: 0 for trait in self.traits}
        trait_counts = {trait.id: 0 for trait in self.traits}
        
        # Create question lookup map
        questions_map = {}
        for block in self.question_blocks:
            for question in block.questions:
                questions_map[question.id] = question
        
        # Process each response
        for response in test_responses:
            question = questions_map.get(response.question_id)
            if not question:
                continue
                
            # Process response based on question type
            if question.type == QuestionType.MULTIPLE_CHOICE:
                self._process_multiple_choice(response, question, trait_scores, trait_counts)
            elif question.type == QuestionType.MULTIPLE_SELECT:
                self._process_multiple_select(response, question, trait_scores, trait_counts)
            elif question.type == QuestionType.OPEN:
                self._process_open_question(response, question, trait_scores, trait_counts)
            elif question.type == QuestionType.SCALE:
                self._process_scale_question(response, question, trait_scores, trait_counts)
        
        # Normalize scores to 0-100 scale
        normalized_scores = {}
        for trait_id in trait_scores:
            if trait_counts[trait_id] > 0:
                normalized_scores[trait_id] = min(100, round((trait_scores[trait_id] / trait_counts[trait_id]) * 20))
            else:
                normalized_scores[trait_id] = 50  # Default value
        
        return normalized_scores
    
    def _process_multiple_choice(self, response, question, trait_scores, trait_counts):
        """
        Process a multiple choice response.
        
        Args:
            response: TestResponse object
            question: Question object
            trait_scores: Dictionary of trait scores to update
            trait_counts: Dictionary of trait counts to update
        """
        if isinstance(response.response, (str, int)) and question.options:
            selected_index = response.response if isinstance(response.response, int) else 0
            try:
                option_values = question.options[selected_index].values
                for trait_id, score in option_values.trait_scores.items():
                    if trait_id in trait_scores:
                        trait_scores[trait_id] += score
                        trait_counts[trait_id] += 1
                
                # Add MBTI and Ikigai contributions
                if option_values.mbti_dimension and option_values.mbti_dimension in "EINSTFJP":
                    mbti_trait = f"mbti_{option_values.mbti_dimension.lower()}"
                    if mbti_trait in trait_scores:
                        trait_scores[mbti_trait] += 4  # Standard contribution
                        trait_counts[mbti_trait] += 1
                
                if option_values.ikigai_area:
                    ikigai_trait = f"ikigai_{option_values.ikigai_area}"
                    if ikigai_trait in trait_scores:
                        trait_scores[ikigai_trait] += 4  # Standard contribution
                        trait_counts[ikigai_trait] += 1
            except (IndexError, TypeError):
                # Handle error if the index is not valid
                pass
    
    def _process_multiple_select(self, response, question, trait_scores, trait_counts):
        """
        Process a multiple select response.
        
        Args:
            response: TestResponse object
            question: Question object
            trait_scores: Dictionary of trait scores to update
            trait_counts: Dictionary of trait counts to update
        """
        if isinstance(response.response, list) and question.options:
            for selection in response.response:
                if isinstance(selection, int) and 0 <= selection < len(question.options):
                    option_values = question.options[selection].values
                    for trait_id, score in option_values.trait_scores.items():
                        if trait_id in trait_scores:
                            trait_scores[trait_id] += score
                            trait_counts[trait_id] += 1
                    
                    # Add MBTI and Ikigai contributions
                    if option_values.mbti_dimension and option_values.mbti_dimension in "EINSTFJP":
                        mbti_trait = f"mbti_{option_values.mbti_dimension.lower()}"
                        if mbti_trait in trait_scores:
                            trait_scores[mbti_trait] += 3  # Slightly lower for multiple select
                            trait_counts[mbti_trait] += 1
                    
                    if option_values.ikigai_area:
                        ikigai_trait = f"ikigai_{option_values.ikigai_area}"
                        if ikigai_trait in trait_scores:
                            trait_scores[ikigai_trait] += 3  # Slightly lower for multiple select
                            trait_counts[ikigai_trait] += 1
    
    def _process_open_question(self, response, question, trait_scores, trait_counts):
        """
        Process an open question response using keyword analysis and LLM processing for better understanding.
        
        Args:
            response: TestResponse object
            question: Question object
            trait_scores: Dictionary of trait scores to update
            trait_counts: Dictionary of trait counts to update
        """
        if not isinstance(response.response, str) or not response.response.strip():
            print("Skipping empty or invalid open question response")
            return
            
        text = response.response.strip()
        
        # Process with NLP including validation and LLM analysis
        processed_text, metadata = self._process_text_with_nlp(text)
        
        # Skip processing if the text is invalid (gibberish, random characters, etc.)
        if not processed_text or metadata.get("error") == "invalid_input":
            print(f"Skipping invalid open question response: '{text[:30]}...'")
            return
        
        # Apply base trait scores for the question
        if question.base_traits:
            for trait_id, score in question.base_traits.items():
                if trait_id in trait_scores:
                    trait_scores[trait_id] += score
                    trait_counts[trait_id] += 1
        
        # Use LLM-derived trait scores if available from metadata
        if "llm_traits" in metadata and metadata["llm_traits"]:
            # Map the LLM-identified traits to our existing trait system
            trait_matches = self._map_llm_traits_to_system(metadata["llm_traits"])
            
            # Apply the trait scores based on LLM analysis
            for trait_id, score in trait_matches.items():
                if trait_id in trait_scores:
                    trait_scores[trait_id] += score
                    trait_counts[trait_id] += 1
                    print(f"Applied LLM trait score for '{trait_id}': +{score}")
        
        # Use LLM-derived MBTI indicators if available
        if "llm_mbti" in metadata and metadata["llm_mbti"]:
            mbti_scores = metadata["llm_mbti"]
            
            # Apply MBTI dimension scores
            for dimension, score in mbti_scores.items():
                if dimension in "EINSTFJP":
                    mbti_trait = f"mbti_{dimension.lower()}"
                    if mbti_trait in trait_scores:
                        # Scale from 0-10 to 1-5 for our system
                        scaled_score = max(1, min(5, round(score / 2)))
                        trait_scores[mbti_trait] += scaled_score
                        trait_counts[mbti_trait] += 1
                        print(f"Applied LLM MBTI score for '{mbti_trait}': +{scaled_score}")
        
        # Use LLM-derived Ikigai area scores if available
        if "llm_ikigai" in metadata and metadata["llm_ikigai"]:
            ikigai_scores = metadata["llm_ikigai"]
            
            # Apply Ikigai area scores
            for area, score in ikigai_scores.items():
                if area in ["passion", "mission", "profession", "vocation"]:
                    ikigai_trait = f"ikigai_{area}"
                    if ikigai_trait in trait_scores:
                        # Scale from 0-10 to 1-5 for our system
                        scaled_score = max(1, min(5, round(score / 2)))
                        trait_scores[ikigai_trait] += scaled_score
                        trait_counts[ikigai_trait] += 1
                        print(f"Applied LLM Ikigai score for '{ikigai_trait}': +{scaled_score}")
        
        # If no LLM analysis, fall back to keyword analysis
        if "llm_traits" not in metadata and question.keyword_analysis:
            # Analyze keywords in the text
            for trait_id, keywords in question.keyword_analysis.items():
                score = 0
                for keyword in keywords:
                    if keyword.lower() in processed_text:
                        score += 1
                
                if score > 0 and trait_id in trait_scores:
                    trait_scores[trait_id] += score
                    trait_counts[trait_id] += 1
            
            # Add MBTI and Ikigai contributions if specified in the question
            if question.mbti_dimension and question.mbti_dimension in "EINSTFJP":
                mbti_trait = f"mbti_{question.mbti_dimension.lower()}"
                if mbti_trait in trait_scores:
                    trait_scores[mbti_trait] += 2  # Lower weight for keyword-based assignment
                    trait_counts[mbti_trait] += 1
            
            if question.ikigai_area:
                ikigai_trait = f"ikigai_{question.ikigai_area}"
                if ikigai_trait in trait_scores:
                    trait_scores[ikigai_trait] += 2  # Lower weight for keyword-based assignment
                    trait_counts[ikigai_trait] += 1
    
    def _process_text_with_nlp(self, text):
        """
        Process text using NLP techniques to standardize and extract meaningful content.
        This uses the dedicated NLP utility module for more advanced processing.
        
        Args:
            text: The text to process
            
        Returns:
            Tuple of (processed_text, metadata) with standardized text and analysis metadata
        """
        try:
            # Use the NLP processor to get processed text and metadata
            processed_text, metadata = process_text(text)
            
            # Print some debugging info
            print(f"Processed text: {processed_text[:50]}...")
            if metadata.get("error"):
                print(f"Text validation error: {metadata['error']}")
            elif "llm_traits" in metadata:
                print(f"LLM identified traits: {metadata['llm_traits']}")
                print(f"LLM MBTI indicators: {metadata['llm_mbti']}")
                print(f"LLM Ikigai areas: {metadata['llm_ikigai']}")
            
            return processed_text, metadata
        except Exception as e:
            print(f"Error processing text with NLP: {e}")
            # Fallback to basic processing if NLP fails
            return text.strip().lower(), {"error": "processing_failed"}
    
    def _process_scale_question(self, response, question, trait_scores, trait_counts):
        """
        Process a scale question response.
        
        Args:
            response: TestResponse object
            question: Question object
            trait_scores: Dictionary of trait scores to update
            trait_counts: Dictionary of trait counts to update
        """
        if isinstance(response.response, (dict, list)) and question.item_scale_values:
            # Convert dict to list if needed
            values = response.response
            if isinstance(values, dict):
                values = [values.get(str(i), 3) for i in range(len(question.item_scale_values))]
            
            # Process each scale item
            for i, value in enumerate(values):
                if i < len(question.item_scale_values):
                    scale_values = question.item_scale_values[i]
                    for option_value in scale_values:
                        if option_value.min <= value <= option_value.max:
                            for trait_id, score in option_value.trait_scores.items():
                                if trait_id in trait_scores:
                                    trait_scores[trait_id] += score
                                    trait_counts[trait_id] += 1
                            
                            # Add MBTI and Ikigai contributions
                            if option_value.mbti_dimension and option_value.mbti_dimension in "EINSTFJP":
                                mbti_trait = f"mbti_{option_value.mbti_dimension.lower()}"
                                if mbti_trait in trait_scores:
                                    trait_scores[mbti_trait] += 3
                                    trait_counts[mbti_trait] += 1
                            
                            if option_value.ikigai_area:
                                ikigai_trait = f"ikigai_{option_value.ikigai_area}"
                                if ikigai_trait in trait_scores:
                                    trait_scores[ikigai_trait] += 3
                                    trait_counts[ikigai_trait] += 1
                            
                            break
    
    def _calculate_mbti(self, trait_scores: Dict[str, int]) -> Tuple[Dict[str, int], MBTIType]:
        """
        Calculate MBTI scores and determine MBTI type.
        
        Args:
            trait_scores: Dictionary of trait scores
            
        Returns:
            Tuple of (mbti_scores, mbti_type)
        """
        mbti_scores = {
            'E': 50, 'I': 50,  # Start with balanced default values
            'S': 50, 'N': 50,
            'T': 50, 'F': 50,
            'J': 50, 'P': 50
        }
        
        # Track how many traits influenced each dimension for normalization
        dimension_counts = {
            'E': 0, 'I': 0, 'S': 0, 'N': 0, 'T': 0, 'F': 0, 'J': 0, 'P': 0
        }
        
        # Calculate contributions from each trait
        for trait_id, score in trait_scores.items():
            if trait_id in self.traits_map:
                trait = self.traits_map[trait_id]
                
                # Add contribution to each dimension only if affinity is significant (>10)
                for dimension in ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']:
                    affinity = getattr(trait.mbti_affinity, dimension)
                    if affinity > 10:  # Only count meaningful affinities
                        mbti_scores[dimension] += (score * affinity) / 100
                        dimension_counts[dimension] += 1
        
        # Add direct contributions from MBTI-specific trait scores
        for trait_id, score in trait_scores.items():
            if trait_id.startswith('mbti_'):
                dimension = trait_id.split('_')[1].upper()
                if dimension in mbti_scores:
                    mbti_scores[dimension] += score
                    dimension_counts[dimension] += 1
        
        # Normalize scores based on how many traits influenced each dimension
        for dimension in mbti_scores:
            if dimension_counts[dimension] > 0:
                # Normalize but maintain some of the default value to prevent extreme scores
                normalized_score = mbti_scores[dimension] / dimension_counts[dimension]
                mbti_scores[dimension] = min(100, max(0, round(normalized_score)))
            else:
                # Keep the default of 50 if no traits influenced this dimension
                mbti_scores[dimension] = 50
        
        # Ensure there's a minimum difference threshold to make type selection more balanced
        min_difference = 5
        
        # Determine type with minimum difference threshold
        mbti_type = ""
        
        # E vs I
        e_i_diff = mbti_scores['E'] - mbti_scores['I']
        if abs(e_i_diff) < min_difference:
            # If difference is small, randomly assign based on score proximity
            mbti_type += "E" if (e_i_diff > 0 or (e_i_diff == 0 and random.random() > 0.5)) else "I"
        else:
            mbti_type += "E" if e_i_diff > 0 else "I"
        
        # S vs N
        s_n_diff = mbti_scores['S'] - mbti_scores['N'] 
        if abs(s_n_diff) < min_difference:
            mbti_type += "S" if (s_n_diff > 0 or (s_n_diff == 0 and random.random() > 0.5)) else "N"
        else:
            mbti_type += "S" if s_n_diff > 0 else "N"
        
        # T vs F
        t_f_diff = mbti_scores['T'] - mbti_scores['F']
        if abs(t_f_diff) < min_difference:
            mbti_type += "T" if (t_f_diff > 0 or (t_f_diff == 0 and random.random() > 0.5)) else "F"
        else:
            mbti_type += "T" if t_f_diff > 0 else "F"
        
        # J vs P
        j_p_diff = mbti_scores['J'] - mbti_scores['P']
        if abs(j_p_diff) < min_difference:
            mbti_type += "J" if (j_p_diff > 0 or (j_p_diff == 0 and random.random() > 0.5)) else "P"
        else:
            mbti_type += "J" if j_p_diff > 0 else "P"
        
        # Debug output
        print(f"MBTI Scores: {mbti_scores}, Selected Type: {mbti_type}")
        
        return mbti_scores, MBTIType(mbti_type)
    
    def _calculate_ikigai(self, trait_scores: Dict[str, int]) -> Dict[str, int]:
        """
        Calculate Ikigai area scores.
        
        Args:
            trait_scores: Dictionary of trait scores
            
        Returns:
            Dictionary of Ikigai area scores
        """
        ikigai_scores = {
            'passion': 0,
            'mission': 0,
            'profession': 0,
            'vocation': 0
        }
        ikigai_counts = {area: 0 for area in ikigai_scores}
        
        # Calculate contributions from each trait
        for trait_id, score in trait_scores.items():
            if trait_id in self.traits_map:
                trait = self.traits_map[trait_id]
                
                # Add contribution to each Ikigai area
                for area in ikigai_scores:
                    area_affinity = getattr(trait.ikigai_affinity, area)
                    ikigai_scores[area] += (score * area_affinity) / 100
                    ikigai_counts[area] += 1
        
        # Normalize scores to 0-100
        for area in ikigai_scores:
            if ikigai_counts[area] > 0:
                ikigai_scores[area] = min(100, round(ikigai_scores[area] / ikigai_counts[area]))
            else:
                ikigai_scores[area] = 50  # Default value
        
        return ikigai_scores
    
    def _generate_recommendations(self, trait_scores, mbti_scores, mbti_type, ikigai_scores):
        """
        Generate all recommendations based on profile.
        
        Args:
            trait_scores: Dictionary of trait scores
            mbti_scores: Dictionary of MBTI dimension scores
            mbti_type: MBTIType enum value
            ikigai_scores: Dictionary of Ikigai area scores
            
        Returns:
            Dictionary with recommendations
        """

        return {
            'personalities': self._find_similar_personalities(trait_scores, mbti_type),
            'activities': self._recommend_activities(trait_scores, mbti_scores, ikigai_scores),
            'professions': self._recommend_professions(trait_scores, mbti_type, ikigai_scores),
            'skills': self._recommend_skills(trait_scores, mbti_type, ikigai_scores),
            'interests': self._recommend_interests(trait_scores, mbti_type, ikigai_scores),
            'advices': self._recommend_advices(trait_scores, mbti_type, ikigai_scores)
        }
    
    def _find_similar_personalities(
        self, trait_scores: Dict[str, int], mbti_type: MBTIType, count: int = 4
    ) -> List[CelebrityProfile]:
        """
        Find personalities with similar profiles.
        
        Args:
            trait_scores: Dictionary of trait scores
            mbti_type: MBTIType enum value
            count: Number of personalities to return
            
        Returns:
            List of CelebrityProfile objects
        """
        celebrity_scores = []
        
        # Calculate similarity with each celebrity
        for celebrity in self.celebrities:
            # Prioritize MBTI match
            mbti_match = 1.5 if celebrity.mbti_type == mbti_type else 1.0
            
            # Calculate trait similarity (Euclidean distance)
            trait_distance = 0
            valid_traits = 0
            
            for trait_id, user_score in trait_scores.items():
                if trait_id in celebrity.trait_scores:
                    celeb_score = celebrity.trait_scores[trait_id]
                    trait_distance += (user_score - celeb_score) ** 2
                    valid_traits += 1
            
            # Normalize and calculate final similarity score
            if valid_traits > 0:
                trait_distance = math.sqrt(trait_distance / valid_traits)
                similarity_score = (100 - trait_distance) * mbti_match
                celebrity_scores.append((celebrity, similarity_score))
        
        # Sort by similarity score (descending)
        celebrity_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Return top N personalities
        return [celeb for celeb, _ in celebrity_scores[:count]]
    
    def _recommend_activities(
        self, trait_scores: Dict[str, int], 
        mbti_scores: Dict[str, int], 
        ikigai_scores: Dict[str, int],
        count: int = 10
    ) -> List[Activity]:
        """
        Recommend activities based on profile.
        
        Args:
            trait_scores: Dictionary of trait scores
            mbti_scores: Dictionary of MBTI dimension scores
            ikigai_scores: Dictionary of Ikigai area scores
            count: Number of activities to recommend
            
        Returns:
            List of Activity objects
        """
        activity_scores = []
        
        # Calculate relevance score for each activity
        for activity in self.activities:
            # Calculate trait match score
            trait_match = self._calculate_match_score(
                trait_scores, activity.trait_relevance
            )
            
            # Calculate MBTI match
            mbti_match = activity.mbti_affinity.get(str(mbti_scores), 50)
            
            # Calculate Ikigai match
            ikigai_match = self._calculate_match_score(
                ikigai_scores, activity.ikigai_relevance
            )
            
            # Calculate final weighted score
            final_score = (trait_match * 0.5) + (mbti_match * 0.3) + (ikigai_match * 0.2)
            activity_scores.append((activity, final_score))
        
        # Sort by score (descending)
        activity_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Ensure diversity across Ikigai areas
        selected_activities = []
        activities_per_area = {area: 2 for area in ikigai_scores.keys()}
        
        # First select by area
        for area in ikigai_scores.keys():
            area_activities = []
            for activity, score in activity_scores:
                if area in activity.ikigai_relevance and activity.ikigai_relevance[area] >= 70:
                    area_activities.append((activity, score))
                    if len(area_activities) >= activities_per_area[area]:
                        break
            
            # Add activities from this area
            for activity, _ in area_activities[:activities_per_area[area]]:
                if activity not in selected_activities and len(selected_activities) < count:
                    selected_activities.append(activity)
        
        # Fill remaining slots with highest-scored activities
        if len(selected_activities) < count:
            for activity, _ in activity_scores:
                if activity not in selected_activities and len(selected_activities) < count:
                    selected_activities.append(activity)
        
        return selected_activities
    
    def _recommend_professions(
        self, trait_scores: Dict[str, int], 
        mbti_type: MBTIType, 
        ikigai_scores: Dict[str, int],
        count: int = 4
    ) -> List[Profession]:
        """
        Recommend professions based on profile.
        
        Args:
            trait_scores: Dictionary of trait scores
            mbti_type: MBTIType enum value
            ikigai_scores: Dictionary of Ikigai area scores
            count: Number of professions to recommend
            
        Returns:
            List of Profession objects
        """
        profession_scores = []
        
        # Calculate relevance score for each profession
        for profession in self.professions:
            # Calculate trait match score
            trait_match = self._calculate_match_score(
                trait_scores, profession.trait_relevance
            )
            
            # Calculate MBTI match
            mbti_match = profession.mbti_affinity.get(str(mbti_type), 50)
            
            # Calculate Ikigai match (weighted toward profession and vocation)
            ikigai_weights = {'passion': 0.5, 'mission': 0.7, 'profession': 1.0, 'vocation': 0.8}
            ikigai_match = self._calculate_weighted_match_score(
                ikigai_scores, profession.ikigai_relevance, ikigai_weights
            )
            
            # Calculate final weighted score
            final_score = (trait_match * 0.5) + (mbti_match * 0.2) + (ikigai_match * 0.3)
            profession_scores.append((profession, final_score))
        
        # Sort by score (descending)
        profession_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Return top N professions
        return [prof for prof, _ in profession_scores[:count]]
    
    def _recommend_skills(
        self, trait_scores: Dict[str, int], 
        mbti_type: MBTIType, 
        ikigai_scores: Dict[str, int],
        count: int = 5
    ) -> List[Skill]:
        """
        Recommend skills based on profile.
        
        Args:
            trait_scores: Dictionary of trait scores
            mbti_type: MBTIType enum value
            ikigai_scores: Dictionary of Ikigai area scores
            count: Number of skills to recommend
            
        Returns:
            List of Skill objects
        """
        skills_scores = []
        
        # Calculate relevance score for each skill
        for skill in self.skills:
            trait_match = 0
            trait_count = 0
            
            for trait_id, relevance in skill.trait_relevance.items():
                if trait_id in trait_scores:
                    trait_match += (trait_scores[trait_id] * relevance) / 100
                    trait_count += 1
                    
            trait_score = trait_match / trait_count if trait_count > 0 else 50
            
            mbti_score = skill.mbti_affinity.get(str(mbti_type), 50)
            
            ikigai_match = 0
            ikigai_count = 0
            
            for area, relevance in skill.ikigai_relevance.items():
                if area in ikigai_scores:
                    ikigai_match += (ikigai_scores[area] * relevance) / 100
                    ikigai_count += 1
                    
            ikigai_score = ikigai_match / ikigai_count if ikigai_count > 0 else 50
            
            final_score = (trait_score * 0.5) + (mbti_score * 0.3) + (ikigai_score * 0.2)
            skills_scores.append((skill, final_score))
        
        skills_scores.sort(key=lambda x: x[1], reverse=True)
        return [skill for skill, _ in skills_scores[:count]]
    
    def _recommend_interests(
        self, trait_scores: Dict[str, int], 
        mbti_type: MBTIType, 
        ikigai_scores: Dict[str, int],
        count: int = 5
    ) -> List[Interest]:
        """
        Recommend interests based on profile.
        
        Args:
            trait_scores: Dictionary of trait scores
            mbti_type: MBTIType enum value
            ikigai_scores: Dictionary of Ikigai area scores
            count: Number of interests to recommend
            
        Returns:
            List of Interest objects
        """
        interests_scores = []
        
        # Calculate relevance score for each interest
        for interest in self.interests:
            trait_match = 0
            trait_count = 0
            
            for trait_id, relevance in interest.trait_relevance.items():
                if trait_id in trait_scores:
                    trait_match += (trait_scores[trait_id] * relevance) / 100
                    trait_count += 1
                    
            trait_score = trait_match / trait_count if trait_count > 0 else 50
            
            mbti_score = interest.mbti_affinity.get(str(mbti_type), 50)
            
            ikigai_match = 0
            ikigai_count = 0
            
            for area, relevance in interest.ikigai_relevance.items():
                if area in ikigai_scores:
                    ikigai_match += (ikigai_scores[area] * relevance) / 100
                    ikigai_count += 1
                    
            ikigai_score = ikigai_match / ikigai_count if ikigai_count > 0 else 50
            
            final_score = (trait_score * 0.5) + (mbti_score * 0.3) + (ikigai_score * 0.2)
            interests_scores.append((interest, final_score))
        
        interests_scores.sort(key=lambda x: x[1], reverse=True)
        return [interest for interest, _ in interests_scores[:count]]
    
    def _recommend_advices(
        self, trait_scores: Dict[str, int], 
        mbti_type: MBTIType, 
        ikigai_scores: Dict[str, int],
        count: int = 5
    ) -> List[Advice]:
        """
        Recommend advices based on profile.
        
        Args:
            trait_scores: Dictionary of trait scores
            mbti_type: MBTIType enum value
            ikigai_scores: Dictionary of Ikigai area scores
            count: Number of advices to recommend
            
        Returns:
            List of Advice objects
        """
        advices_scores = []
        
        # Calculate relevance score for each advice
        for advice in self.advices:
            trait_match = 0
            trait_count = 0
            
            for trait_id, relevance in advice.target_traits.items():
                if trait_id in trait_scores:
                    trait_match += (trait_scores[trait_id] * relevance) / 100
                    trait_count += 1
                    
            trait_score = trait_match / trait_count if trait_count > 0 else 50
            
            mbti_score = 100 if str(mbti_type) in advice.mbti_targets else 50
            
            ikigai_match = 0
            ikigai_count = 0
            
            for area in advice.ikigai_targets:
                if area in ikigai_scores:
                    ikigai_match += ikigai_scores[area]
                    ikigai_count += 1
                    
            ikigai_score = ikigai_match / ikigai_count if ikigai_count > 0 else 50
            
            final_score = (trait_score * 0.5) + (mbti_score * 0.3) + (ikigai_score * 0.2)
            advices_scores.append((advice, final_score))
        
        advices_scores.sort(key=lambda x: x[1], reverse=True)
        return [advice for advice, _ in advices_scores[:count]]
    
    def _calculate_match_score(self, user_scores, item_relevance):
        """
        Calculate match score between user values and item relevance.
        
        Args:
            user_scores: Dictionary of user attribute scores
            item_relevance: Dictionary of item relevance values
            
        Returns:
            Match score (0-100)
        """
        match_score = 0
        count = 0
        
        for attr_id, relevance in item_relevance.items():
            if attr_id in user_scores:
                user_score = user_scores[attr_id]
                match_score += (user_score * relevance) / 100
                count += 1
        
        return match_score / count if count > 0 else 50
    
    def _calculate_weighted_match_score(self, user_scores, item_relevance, weights):
        """
        Calculate weighted match score between user values and item relevance.
        
        Args:
            user_scores: Dictionary of user attribute scores
            item_relevance: Dictionary of item relevance values
            weights: Dictionary of attribute weights
            
        Returns:
            Weighted match score (0-100)
        """
        match_score = 0
        weight_sum = 0
        
        for attr_id, relevance in item_relevance.items():
            if attr_id in user_scores and attr_id in weights:
                user_score = user_scores[attr_id]
                weight = weights[attr_id]
                match_score += (user_score * relevance * weight) / 100
                weight_sum += weight
        
        return match_score / weight_sum if weight_sum > 0 else 50
    
    def _create_trait_summary(self, trait_scores: Dict[str, int]) -> Dict[str, Any]:
        """
        Create a summary of trait scores.
        
        Args:
            trait_scores: Dictionary of trait scores
            
        Returns:
            Dictionary with trait summary
        """
        # Sort traits by score
        sorted_traits = sorted(trait_scores.items(), key=lambda x: x[1], reverse=True)
        
        # Top 5 traits
        top_traits = []
        for trait_id, score in sorted_traits[:5]:
            if trait_id in self.traits_map:
                trait = self.traits_map[trait_id]
                top_traits.append({
                    'id': trait_id,
                    'name': trait.name,
                    'score': score,
                    'description': trait.description,
                    'category': str(trait.category)
                })
                
        # 5 traits with lowest scores
        bottom_traits = []
        for trait_id, score in sorted_traits[-5:]:
            if trait_id in self.traits_map:
                trait = self.traits_map[trait_id]
                bottom_traits.append({
                    'id': trait_id,
                    'name': trait.name,
                    'score': score,
                    'description': trait.description,
                    'category': str(trait.category)
                })
        
        # Group by category
        trait_categories = {}
        for trait_id, score in trait_scores.items():
            if trait_id in self.traits_map:
                trait = self.traits_map[trait_id]
                category = str(trait.category)
                
                if category not in trait_categories:
                    trait_categories[category] = {
                        'total': 0, 
                        'count': 0, 
                        'traits': []
                    }
                
                trait_categories[category]['total'] += score
                trait_categories[category]['count'] += 1
                trait_categories[category]['traits'].append({
                    'id': trait_id,
                    'name': trait.name,
                    'score': score
                })
        
        # Calculate average by category
        for category in trait_categories:
            if trait_categories[category]['count'] > 0:
                trait_categories[category]['average'] = round(
                    trait_categories[category]['total'] / trait_categories[category]['count']
                )
            else:
                trait_categories[category]['average'] = 0

        return {
            'top_traits': top_traits,
            'bottom_traits': bottom_traits,
            'categories': trait_categories
        }
            
    def _create_mbti_analysis(self, mbti_scores: Dict[str, int], mbti_type: MBTIType) -> Dict[str, Any]:
        """
        Create analysis of MBTI profile.
        
        Args:
            mbti_scores: Dictionary of MBTI dimension scores
            mbti_type: MBTIType enum value
            
        Returns:
            Dictionary with MBTI analysis
        """
        # MBTI type descriptions
        mbti_descriptions = {
            MBTIType.INTJ: "The Architect - Imaginative and strategic thinkers, with a plan for everything",
            MBTIType.INTP: "The Logician - Innovative inventors with an unquenchable thirst for knowledge",
            MBTIType.ENTJ: "The Commander - Bold, imaginative and strong-willed leaders",
            MBTIType.ENTP: "The Debater - Smart and curious thinkers who cannot resist an intellectual challenge",
            MBTIType.INFJ: "The Advocate - Quiet and mystical, yet inspiring and tireless idealists",
            MBTIType.INFP: "The Mediator - Poetic, kind and altruistic people, always eager to help a good cause",
            MBTIType.ENFJ: "The Protagonist - Charismatic and inspiring leaders, able to mesmerize their listeners",
            MBTIType.ENFP: "The Campaigner - Enthusiastic, creative and sociable free spirits",
            MBTIType.ISTJ: "The Logistician - Practical and fact-minded individuals, whose reliability cannot be doubted",
            MBTIType.ISFJ: "The Defender - Very dedicated and warm protectors, always ready to defend their loved ones",
            MBTIType.ESTJ: "The Executive - Excellent administrators, unsurpassed at managing things or people",
            MBTIType.ESFJ: "The Consul - Extraordinarily caring, social and popular people",
            MBTIType.ISTP: "The Virtuoso - Bold and practical experimenters, masters of all kinds of tools",
            MBTIType.ISFP: "The Adventurer - Flexible and charming artists, always ready to explore and experience something new",
            MBTIType.ESTP: "The Entrepreneur - Smart, energetic and perceptive people",
            MBTIType.ESFP: "The Entertainer - Spontaneous, energetic and enthusiastic entertainers"
        }
        
        # Calculate dimensions
        dimensions = [
            {
                'name': 'Extraversion vs. Introversion',
                'e_score': mbti_scores['E'],
                'i_score': mbti_scores['I'],
                'dominant': 'E' if mbti_scores['E'] > mbti_scores['I'] else 'I',
                'strength': abs(mbti_scores['E'] - mbti_scores['I'])
            },
            {
                'name': 'Sensing vs. Intuition',
                's_score': mbti_scores['S'],
                'n_score': mbti_scores['N'],
                'dominant': 'S' if mbti_scores['S'] > mbti_scores['N'] else 'N',
                'strength': abs(mbti_scores['S'] - mbti_scores['N'])
            },
            {
                'name': 'Thinking vs. Feeling',
                't_score': mbti_scores['T'],
                'f_score': mbti_scores['F'],
                'dominant': 'T' if mbti_scores['T'] > mbti_scores['F'] else 'F',
                'strength': abs(mbti_scores['T'] - mbti_scores['F'])
            },
            {
                'name': 'Judging vs. Perceiving',
                'j_score': mbti_scores['J'],
                'p_score': mbti_scores['P'],
                'dominant': 'J' if mbti_scores['J'] > mbti_scores['P'] else 'P',
                'strength': abs(mbti_scores['J'] - mbti_scores['P'])
            }
        ]
        
        # Find famous people with this type
        famous_people = [
            celeb.name for celeb in self.celebrities 
            if celeb.mbti_type == mbti_type
        ][:5]  # Limit to top 5
        
        # Strengths and weaknesses
        strengths_weaknesses = {
            MBTIType.INTJ: {
                'strengths': ['Strategic thinking', 'Independent', 'Analytical', 'Determined'],
                'weaknesses': ['Overly critical', 'Perfectionist', 'Dismissive of emotions', 'Difficulty connecting']
            },
            MBTIType.INTP: {
                'strengths': ['Logical reasoning', 'Original thinking', 'Open-minded', 'Objective'],
                'weaknesses': ['Overthinking', 'Procrastination', 'Difficulty with emotions', 'Can be insensitive']
            }
            # Additional types would be defined here
        }
        
        # Default strengths/weaknesses if not defined
        if mbti_type not in strengths_weaknesses:
            strengths_weaknesses[mbti_type] = {
                'strengths': ['Unique perspective', 'Special talents related to your type'],
                'weaknesses': ['Areas for potential growth']
            }
        
        return {
            'type': str(mbti_type),
            'description': mbti_descriptions.get(mbti_type, "A unique personality type with special characteristics"),
            'scores': mbti_scores,
            'dimensions': dimensions,
            'famous_people': famous_people,
            'strengths': strengths_weaknesses[mbti_type]['strengths'],
            'weaknesses': strengths_weaknesses[mbti_type]['weaknesses']
        }
    
    def _create_ikigai_analysis(self, ikigai_scores: Dict[str, int]) -> Dict[str, Any]:
        """
        Create analysis of Ikigai profile.
        
        Args:
            ikigai_scores: Dictionary of Ikigai area scores
            
        Returns:
            Dictionary with Ikigai analysis
        """
        # Area descriptions
        area_descriptions = {
            'passion': "What you love - Activities and interests that bring you joy and fulfillment",
            'mission': "What the world needs - How your skills and interests can help others and make a positive impact",
            'profession': "What you can be paid for - Skills and activities that have economic value in the job market",
            'vocation': "What you're good at - Your natural talents and abilities that you can develop into expertise"
        }
        
        # Calculate overall balance
        total_score = sum(ikigai_scores.values())
        max_possible = 100 * len(ikigai_scores)
        balance_percentage = (total_score / max_possible) * 100
        
        # Find strongest and weakest areas
        sorted_areas = sorted(ikigai_scores.items(), key=lambda x: x[1], reverse=True)
        strongest_area = sorted_areas[0][0]
        weakest_area = sorted_areas[-1][0]
        
        # Create interpretation
        if balance_percentage >= 75:
            interpretation = "Your Ikigai profile shows excellent balance across all four areas, suggesting high potential for finding meaningful and fulfilling work that aligns with your values."
        elif balance_percentage >= 60:
            interpretation = "Your Ikigai profile shows good balance, with some areas stronger than others. Focus on developing your weaker areas to find greater fulfillment."
        else:
            interpretation = f"Your Ikigai profile shows some imbalance, with your {strongest_area} area much stronger than your {weakest_area} area. The recommendations aim to help you develop a more balanced profile."
        
        # Calculate intersections
        intersections = {
            'passion_mission': {
                'name': 'Delight & Fulfillment',
                'score': (ikigai_scores['passion'] + ikigai_scores['mission']) / 2,
                'description': "What you love and what the world needs - Activities that bring you joy while helping others"
            },
            'mission_profession': {
                'name': 'Impact & Value',
                'score': (ikigai_scores['mission'] + ikigai_scores['profession']) / 2,
                'description': "What the world needs and what you can be paid for - Addressing needs while earning income"
            },
            'profession_vocation': {
                'name': 'Competence & Security',
                'score': (ikigai_scores['profession'] + ikigai_scores['vocation']) / 2,
                'description': "What you can be paid for and what you're good at - Using your talents to earn a living"
            },
            'vocation_passion': {
                'name': 'Joyful Mastery',
                'score': (ikigai_scores['vocation'] + ikigai_scores['passion']) / 2,
                'description': "What you're good at and what you love - Activities you enjoy and excel at"
            }
        }
        
        # Calculate center (overall average)
        ikigai_center = sum(ikigai_scores.values()) / len(ikigai_scores)
        
        return {
            'areas': {
                area: {
                    'score': score,
                    'description': area_descriptions.get(area, "")
                } for area, score in ikigai_scores.items()
            },
            'balance': {
                'percentage': round(balance_percentage, 1),
                'interpretation': interpretation
            },
            'strongest_area': strongest_area,
            'weakest_area': weakest_area,
            'intersections': intersections,
            'ikigai_center': round(ikigai_center, 1)
        }
    
    def _identify_development_areas(
        self, trait_scores: Dict[str, int], 
        mbti_scores: Dict[str, int], 
        ikigai_scores: Dict[str, int]
    ) -> Dict[str, Any]:
        """
        Identify areas for personal development.
        
        Args:
            trait_scores: Dictionary of trait scores
            mbti_scores: Dictionary of MBTI dimension scores
            ikigai_scores: Dictionary of Ikigai area scores
            
        Returns:
            Dictionary with development suggestions
        """
        development_areas = {
            'areas': []
        }
        
        # 1. Identify low-scoring traits
        low_threshold = 40
        low_traits = {trait_id: score for trait_id, score in trait_scores.items() 
                    if score < low_threshold and trait_id in self.traits_map}
        
        # Add development suggestions for low traits
        for trait_id, score in low_traits.items():
            trait = self.traits_map[trait_id]
            
            # Find activities that develop this trait
            activities = []
            for activity in self.activities:
                if trait_id in activity.trait_relevance and activity.trait_relevance[trait_id] > 70:
                    activities.append(activity.id)
            
            development_areas['areas'].append({
                'id': trait_id,
                'name': trait.name,
                'current_score': score,
                'target_score': 70,
                'description': f"Developing your {trait.name.lower()} can help balance your profile.",
                'recommended_activities': activities[:3]  # Limit to top 3
            })
        
        # 2. Identify MBTI imbalances
        if mbti_scores['T'] > 75 and mbti_scores['F'] < 40:
            development_areas['areas'].append({
                'id': 'emotional_intelligence',
                'name': 'Emotional Intelligence',
                'current_score': mbti_scores['F'],
                'target_score': 60,
                'description': "Developing emotional intelligence can balance your analytical strengths.",
                'recommended_activities': self._find_activities_for_traits(['empathetic', 'supportive', 'emotional'])
            })
        
        if mbti_scores['J'] > 75 and mbti_scores['P'] < 40:
            development_areas['areas'].append({
                'id': 'adaptability',
                'name': 'Adaptability',
                'current_score': mbti_scores['P'],
                'target_score': 60,
                'description': "Developing more flexibility can complement your structured approach.",
                'recommended_activities': self._find_activities_for_traits(['adaptable', 'spontaneous', 'flexible'])
            })
        
        # 3. Identify Ikigai imbalances
        min_area, min_score = min(ikigai_scores.items(), key=lambda x: x[1])
        
        if min_score < 50:
            area_names = {
                'passion': 'Passion (What You Love)',
                'mission': 'Mission (What the World Needs)',
                'profession': 'Profession (What You Can Be Paid For)',
                'vocation': 'Vocation (What You Are Good At)'
            }
            
            development_areas['areas'].append({
                'id': f'ikigai_{min_area}',
                'name': area_names.get(min_area, min_area.capitalize()),
                'current_score': min_score,
                'target_score': 70,
                'description': f"Developing your {area_names.get(min_area, min_area)} area can help you achieve greater life balance.",
                'recommended_activities': self._find_activities_for_ikigai_area(min_area)
            })
        
        # Limit to 3 most important areas
        development_areas['areas'] = sorted(
            development_areas['areas'], 
            key=lambda x: x['current_score']
        )[:3]
        
        return development_areas
    
    def _find_activities_for_traits(self, trait_ids, limit=3):
        """
        Find activities that develop specific traits.
        
        Args:
            trait_ids: List of trait IDs
            limit: Maximum number of activities to return
            
        Returns:
            List of activity IDs
        """
        activities = []
        
        for activity in self.activities:
            for trait_id in trait_ids:
                if trait_id in activity.trait_relevance and activity.trait_relevance[trait_id] > 70:
                    activities.append(activity.id)
                    break
                    
            if len(activities) >= limit:
                break
        
        return activities[:limit]
    
    def _find_activities_for_ikigai_area(self, area, limit=3):
        """
        Find activities that develop a specific Ikigai area.
        
        Args:
            area: Ikigai area name
            limit: Maximum number of activities to return
            
        Returns:
            List of activity IDs
        """
        activities = []
        
        for activity in self.activities:
            if area in activity.ikigai_relevance and activity.ikigai_relevance[area] > 70:
                activities.append(activity.id)
                
            if len(activities) >= limit:
                break
        
        return activities[:limit]

    def _map_llm_traits_to_system(self, llm_traits: List[str]) -> Dict[str, float]:
        """
        Map traits identified by the LLM to our system's trait IDs.
        
        Args:
            llm_traits: List of trait strings from LLM analysis
            
        Returns:
            Dictionary mapping our trait IDs to scores
        """
        # Dictionary to map common trait terms to our trait IDs
        trait_mapping = {
            # Personality traits
            "creative": "creativity",
            "analytical": "analytical_thinking",
            "logical": "logical_reasoning",
            "empathetic": "empathy",
            "compassionate": "empathy",
            "organized": "organization",
            "disciplined": "discipline",
            "curious": "curiosity",
            "adaptable": "adaptability",
            "flexible": "adaptability",
            "resilient": "resilience",
            "persistent": "persistence",
            "confident": "confidence",
            "sociable": "sociability",
            "outgoing": "extraversion",
            "introverted": "introversion",
            "detail-oriented": "attention_to_detail",
            "leader": "leadership",
            "teamwork": "teamwork",
            "cooperative": "teamwork",
            "independent": "independence",
            "innovative": "innovation",
            
            # Interest areas
            "science": "interest_science",
            "technology": "interest_technology",
            "art": "interest_arts",
            "music": "interest_arts",
            "literature": "interest_literature",
            "writing": "interest_literature",
            "helping": "interest_helping",
            "teaching": "interest_education",
            "business": "interest_business",
            "entrepreneurship": "interest_business",
            "nature": "interest_nature",
            "sports": "interest_sports",
            "politics": "interest_politics",
            "social": "interest_social",
            "research": "interest_research"
        }
        
        # Result dictionary mapping our trait IDs to scores
        result = {}
        
        # Process each LLM-identified trait
        for trait in llm_traits:
            trait = trait.lower().strip()
            
            # Check for direct matches
            if trait in trait_mapping:
                our_trait_id = trait_mapping[trait]
                result[our_trait_id] = result.get(our_trait_id, 0) + 3  # Base score for direct match
            else:
                # Check for partial matches
                for llm_trait_term, our_trait_id in trait_mapping.items():
                    if llm_trait_term in trait or trait in llm_trait_term:
                        result[our_trait_id] = result.get(our_trait_id, 0) + 2  # Lower score for partial match
        
        return result