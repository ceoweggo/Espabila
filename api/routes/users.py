from fastapi import APIRouter, Depends, HTTPException, status
from bson.objectid import ObjectId
import logging
from datetime import datetime

from models.user import UserInDB, User
from utils.auth import get_current_user
from database import users_collection, test_profiles_collection, test_results_collection

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

# Nuevo endpoint para obtener el perfil completo del usuario autenticado
@router.get("/profile")
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user's complete profile"""
    user_id = current_user.get("user_id")

    # Obtener la información básica del usuario primero
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
         raise HTTPException(status_code=404, detail="User not found")

    # Buscar el perfil de test del usuario
    profile = await test_profiles_collection.find_one({"user_id": ObjectId(user_id)})

    # Obtener historial de tests para el dashboard
    tests_cursor = test_results_collection.find({"user_id": user_id}).sort("created_at", -1)
    tests = await tests_cursor.to_list(length=100)  # Limitar a los últimos 100 tests

    # Formatear historial de tests
    formatted_tests = []
    for test in tests:
        test_id = str(test.get("_id")) if test.get("_id") else ""
        created_date = test.get("created_at")
        formatted_date = created_date.strftime("%d/%m/%Y") if isinstance(created_date, datetime) else ""
        formatted_time = created_date.strftime("%H:%M:%S") if isinstance(created_date, datetime) else ""

        formatted_test = {
            "id": test_id,
            "test_type": test.get("test_type", ""),
            "date": formatted_date,
            "time": formatted_time,
            # Puedes agregar más campos del resultado del test aquí si son necesarios en el dashboard
        }
        formatted_tests.append(formatted_test)

    if not profile:
        # Si no hay perfil de test, devolver un perfil básico con la info del usuario
        return {
            "id": str(user["_id"]),
            "name": user.get("name", ""),
            "email": user.get("email", ""),
            "profile_type": "", # O un indicador de que no ha completado tests
            "skills": [],
            "interests": [],
            "similar_personalities": [],
            "recommended_professions": [],
            "completed_tests": formatted_tests,
            "tests_count": len(tests)
        }

    # Si se encuentra el perfil de test, devolverlo (necesitarás ajustar el mapeo)
    profile["_id"] = str(profile["_id"])
    profile["user_id"] = str(profile["user_id"])

    # Mapear los datos del perfil y el historial de tests a una estructura para el frontend
    # Asegúrate de incluir todos los campos que el frontend espera en UserProfile
    return {
        "id": profile["user_id"],
        "name": user.get("name", ""), # Ahora 'user' está definido aquí
        "email": user.get("email", ""), # Ahora 'user' está definido aquí
        "profile_type": profile.get("mbti_type", ""), # Usando MBTI como profile_type
        "skills": profile.get("recommended_skills", []),
        "interests": profile.get("recommended_interests", []),
        "similar_personalities": profile.get("recommended_personalities", []),
        "recommended_professions": profile.get("recommended_professions", []),
        "completed_tests": formatted_tests,
        "tests_count": len(tests)
    }

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
