from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import Dict, Any, List, Optional
from bson.objectid import ObjectId
import logging
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

from models.user import UserResponse, UserInDB, UserSubscription, User, UserCreate, UserUpdate
from models.test import TestResult, TestHistory
from utils.auth import get_current_active_user, get_current_user
from utils.email import send_welcome_email
from database import database, users_collection, test_results_collection

# Logger
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

@router.get("/me", response_model=User)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user's info"""
    user_id = current_user.get("user_id")
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["id"] = str(user["_id"])
    return user

@router.get("/{user_identifier}", response_model=User)
async def get_user_by_identifier(
    user_identifier: str, 
    current_user: UserInDB = Depends(get_current_user)
):
    """Get user by ID or email. Only accessible by admins or the user themselves."""
    # Extract current user's ID and role, handling both object and dict formats
    user_id_value = getattr(current_user, 'id', None) or current_user.get('user_id') if isinstance(current_user, dict) else None
    email_value = getattr(current_user, 'email', None) or current_user.get('email') if isinstance(current_user, dict) else None
    role_value = getattr(current_user, 'role', None) or current_user.get('role') if isinstance(current_user, dict) else None
    
    # Determine if we're looking up by ID or email (simple email validation)
    is_email = '@' in user_identifier
    
    try:
        # Get user from database based on identifier type
        if is_email:
            query = {"email": user_identifier}
            user = await users_collection.find_one(query)
        else:
            # Intentar primero como ObjectId
            try:
                query = {"_id": ObjectId(user_identifier)}
                user = await users_collection.find_one(query)
            except:
                # Si falla, probar con id como string
                query = {"id": user_identifier}
                user = await users_collection.find_one(query)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Asegúrate de que el ID esté en formato string para la respuesta
        if "_id" in user and not "id" in user:
            user["id"] = str(user["_id"])
        
        # Check if user is requesting their own info or is an admin
        # Compare both ID and email for proper authorization
        is_owner = (user_id_value == user.get('id') or email_value == user.get('email'))
        is_admin = role_value == "admin"
        
        if not (is_owner or is_admin):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this user's information"
            )
        
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving user: {str(e)}"
        )

@router.get("/{user_id}/profile", response_model=Dict[str, Any])
async def get_user_profile(user_id: str, current_user: dict = Depends(get_current_user)):
    """Get user profile with test history and profile information"""
    # Permitir solo al propio usuario o admin
    if str(current_user.get("user_id")) != user_id and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's profile"
        )
    # Buscar tests por user_id (string)
    tests_cursor = test_results_collection.find({"user_id": user_id}).sort("created_at", -1)
    tests = await tests_cursor.to_list(length=100)  # Limit to last 100 tests
    # Convertir ObjectId a string en cada test
    for test in tests:
        if "_id" in test:
            test["id"] = str(test["_id"])
            del test["_id"]
    # Get profile type from most recent comprehensive test, o el más reciente si no hay comprehensive
    latest_profile_test = None
    for test in tests:
        if test.get("test_type") == "comprehensive":
            latest_profile_test = test
            break
    if not latest_profile_test and tests:
        latest_profile_test = tests[0]  # Usa el más reciente si no hay comprehensive
    # Build profile data
    profile_data = {
        "profile_type": latest_profile_test.get("profile_type", "") if latest_profile_test else "",
        "skills": latest_profile_test.get("skills", []) if latest_profile_test else [],
        "interests": latest_profile_test.get("interests", []) if latest_profile_test else [],
        "similar_personalities": latest_profile_test.get("similar_personalities", []) if latest_profile_test else [],
        "recommended_professions": latest_profile_test.get("recommended_professions", []) if latest_profile_test else [],
        "completed_tests": [
            {
                "id": test.get("id"),
                "date": test.get("created_at").isoformat() if isinstance(test.get("created_at"), datetime) else test.get("created_at"),
                "type": test.get("test_type"),
                "result": test
            } for test in tests
        ]
    }
    return profile_data

@router.put("/me", response_model=User)
async def update_user_info(user_update: UserUpdate, current_user: UserInDB = Depends(get_current_user)):
    """Update current user information"""
    # Convert model to dict and remove None values
    update_data = user_update.dict(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update"
        )
    
    # Update user in database
    user_id_value = getattr(current_user, 'id', None) or current_user.get('user_id') if isinstance(current_user, dict) else None
    result = await users_collection.update_one(
        {"id": user_id_value},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_304_NOT_MODIFIED,
            detail="User data not modified"
        )
    
    # Get updated user
    updated_user = await users_collection.find_one({"id": user_id_value})
    return updated_user

@router.get("/me/tests", response_model=List[TestHistory])
async def get_user_tests(current_user: UserInDB = Depends(get_current_user)):
    """Get current user's test history"""
    user_id_value = getattr(current_user, 'id', None) or current_user.get('user_id') if isinstance(current_user, dict) else None
    tests_cursor = test_results_collection.find({"user_id": user_id_value}).sort("created_at", -1)
    tests = await tests_cursor.to_list(length=100)  # Limit to last 100 tests
    for test in tests:
        if "_id" in test:
            test["id"] = str(test["_id"])
            del test["_id"]
    return tests

@router.get("/me/subscriptions", response_model=Optional[UserSubscription])
async def get_current_user_subscription(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    """
    Get current user subscription
    """
    # Get user by ID
    user_id = current_user.get("user_id")
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Return subscription if exists
    return user.get("subscription")

@router.put("/me/subscriptions", response_model=UserSubscription)
async def update_current_user_subscription(
    subscription_data: UserSubscription,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """
    Update current user subscription
    """
    # Get user by ID
    user_id = current_user.get("user_id")
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Always update the updated_at field
    subscription_data.updated_at = datetime.utcnow()
    
    # Update user subscription
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"subscription": subscription_data.dict(), "updated_at": datetime.utcnow()}}
    )
    
    # Get updated user
    updated_user = await users_collection.find_one({"_id": ObjectId(user_id)})
    
    # Return subscription
    return updated_user.get("subscription")