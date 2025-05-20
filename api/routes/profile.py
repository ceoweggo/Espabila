from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from typing import Dict, Any

from services.test import PersonalitySystem
from utils.auth import get_current_user

import logging

# Logger
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

personality_system = PersonalitySystem()

@router.get("/")
async def get_user_profile(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get the user's personality profile
    """
    print("Entra en el profile")
    try:
        user_id = current_user.get("user_id")
        profile = await personality_system.get_user_profile(user_id)
        print("Perfil: ", profile)
        if not profile:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"detail": "Profile not found. Complete a test to create your profile."}
            )
            
        return profile
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting user profile: {str(e)}"
        )

