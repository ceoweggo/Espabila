from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.responses import JSONResponse
from typing import Dict, Any, List
from datetime import datetime

from services.test import PersonalitySystem
from utils.auth import get_current_user
from database import test_blocks_collection, test_sessions_collection

import logging

# Logger
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()
personality_system = PersonalitySystem()

@router.post("/")
async def create_test(
    language: str = "es",
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Create a new test with questions in the specified language
    """
    try:
        test = await personality_system.create_test(language)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=test
        )
    except Exception as e:
        logger.error(f"Error creating test: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating test: {str(e)}"
        )

@router.get("/questions/{test_type}", response_model=Dict[str, Any])
async def test_questions(
    test_type: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Retrieve questions for a test, avoiding repetition for users who have taken tests before.
    
    - Quick test → 10 questions per block, 4 blocks total (randomly selected)
    - Comprehensive test → 15 questions per block, 6 blocks total (randomly selected)
    """
    # Get all blocks from the database
    blocks_in_db = await test_blocks_collection.find().to_list(length=None)
    
    # Select and format blocks based on test type
    import random
    
    if test_type == 'quick':
        # Randomly select 4 blocks for quick test
        if len(blocks_in_db) > 4:
            blocks_in_db = random.sample(blocks_in_db, 4)
        
        # Limit to 10 questions per block
        blocks = []
        for block in blocks_in_db:
            block['_id'] = str(block['_id'])
            
            if 'questions' in block and len(block['questions']) > 10:
                block['questions'] = random.sample(block['questions'], 10)
            blocks.append(block)
            
    elif test_type == 'comprehensive': 
        # Randomly select 6 blocks for comprehensive test
        if len(blocks_in_db) > 6:
            blocks_in_db = random.sample(blocks_in_db, 6)
        
        # Limit to 15 questions per block
        blocks = []
        for block in blocks_in_db:
            block['_id'] = str(block['_id'])
            
            if 'questions' in block and len(block['questions']) > 15:
                block['questions'] = random.sample(block['questions'], 15)
            blocks.append(block)
    else:
        blocks = []

    return {"blocks": blocks}

@router.post("/sessions")
async def create_test_session(
    data: dict,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Create a new test session or retrieve an existing one
    """
    try:
        if not data.get("test_type"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Test type is required"
            )
            
        user_id = current_user.get("user_id")
        session = await personality_system.create_session(user_id, data.get("test_type"))
        
        # Convert datetime objects to ISO format strings
        session_dict = session.dict() if hasattr(session, "dict") else dict(session)
        for key, value in session_dict.items():
            if isinstance(value, datetime):
                session_dict[key] = value.isoformat()
        
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=session_dict
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating test session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating test session: {str(e)}"
        )

@router.put("/sessions/{session_id}")
async def update_test_session(
    session_id: str,
    data: Dict[str, Any] = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update a test session with new answers
    """
    try:
        user_id = current_user.get("user_id")
        
        answers = data.get("answers")
        if not answers:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Answers data is required"
            )
            
        updated_session = await personality_system.update_session(session_id, user_id, answers)
        return updated_session
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating test session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating test session: {str(e)}"
        )

@router.post("/sessions/{session_id}/complete")
async def complete_test_session(
    session_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Complete a test session and process the results
    
    This endpoint:
    1. Marks the session as complete
    2. Processes all answers 
    3. Creates or updates the user's personality profile
    4. Stores the test result
    5. Returns the complete analysis
    """
    try:
        user_id = current_user.get("user_id")
        result = await personality_system.complete_session(session_id, user_id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error completing test session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error completing test session: {str(e)}"
        )

@router.delete("/sessions/{session_id}")
async def reset_test_session(
    session_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Reset a test session (delete it)
    """
    try:
        user_id = current_user.get("user_id")
        result = await personality_system.reset_session(session_id, user_id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error resetting test session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error resetting test session: {str(e)}"
        )

@router.get("/sessions/history")
async def get_test_history(
    limit: int = 10,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get the user's test history
    """
    try:
        user_id = current_user.get("user_id")
        history = await personality_system.get_user_test_history(user_id, limit)
        return history
    except Exception as e:
        logger.error(f"Error getting test history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting test history: {str(e)}"
        )

@router.get("/results/{result_id}")
async def get_test_result(
    result_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get a specific test result
    """
    try:
        result = await personality_system.get_test_result(result_id)
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Test result not found"
            )
            
        # Verify the result belongs to the current user
        if str(result["user_id"]) != current_user.get("user_id"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this test result"
            )
            
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting test result: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting test result: {str(e)}"
        )

@router.post("/visualize/ikigai")
async def visualize_ikigai(
    ikigai_scores: Dict[str, int],
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Generate visualization data for Ikigai profile
    """
    try:
        viz_data = await personality_system.get_ikigai_visualization(ikigai_scores)
        return viz_data
    except Exception as e:
        logger.error(f"Error generating visualization: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating visualization: {str(e)}"
        )

@router.post("/visualize/traits")
async def visualize_traits(
    trait_scores: Dict[str, int],
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Generate visualization data for trait profile
    """
    try:
        viz_data = await personality_system.get_trait_visualization(trait_scores)
        return viz_data
    except Exception as e:
        logger.error(f"Error generating visualization: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating visualization: {str(e)}"
        )

@router.post("/narrative")
async def generate_narrative(
    result: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Generate a personalized narrative based on test results
    """
    try:
        narrative = await personality_system.get_personality_narrative(result)
        return {"narrative": narrative}
    except Exception as e:
        logger.error(f"Error generating narrative: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating narrative: {str(e)}"
        )

@router.get("/sessions/{session_id}/results")
async def get_session_results(
    session_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get results for a specific test session
    """
    try:
        user_id = current_user.get("user_id")
        
        # Buscar la sesión
        from bson import ObjectId
        session = await test_sessions_collection.find_one({"_id": ObjectId(session_id)})
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )
            
        # Verificar que la sesión pertenece al usuario
        if str(session.get("user_id")) != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this session"
            )
            
        # Verificar que la sesión está completa
        if session.get("status") != "completed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Session is not completed yet"
            )
            
        # Obtener el resultado asociado
        test_result_id = session.get("test_result_id")
        if not test_result_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No result found for this session"
            )
            
        # Obtener el resultado utilizando el servicio existente
        result = await personality_system.get_test_result(str(test_result_id))
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Result not found"
            )
            
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting session results: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting session results: {str(e)}"
        )