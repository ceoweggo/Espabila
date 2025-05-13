from fastapi import APIRouter, Depends, HTTPException, status, Request, Body
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from bson.objectid import ObjectId
import logging

from models.user import UserCreate, UserResponse, Token, UserInDB
from utils.auth import get_password_hash, verify_password, create_access_token, get_current_active_user
from utils.email import send_welcome_email
from database import database, users_collection, test_results_collection

# Logger
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    # Find user by email
    user = await users_collection.find_one({"email": form_data.username})
    
    # Check if user exists and password is correct
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.get("active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=1440)  # 24 hours
    access_token = create_access_token(
        data={"sub": str(user["_id"])},
        expires_delta=access_token_expires
    )
    
    # Update last login time
    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Return token
    expires_at = datetime.utcnow() + access_token_expires
    
    # Obtener el tipo de perfil del usuario
    profile_type = await get_user_profile_type(user)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_at": expires_at,
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["name"],
            "display_name": get_display_name(user),
            "profile_type": profile_type
        }
    }


@router.post("/users", response_model=UserResponse)
async def register_user(user: UserCreate):
    """
    Register a new user
    """
    # Asegurar que existe un índice único para email
    await users_collection.create_index("email", unique=True)
    
    # Check if email already exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(user.password)
    
    # Preparar metadata
    metadata = {}
    if user.metadata:
        metadata = user.metadata.dict(exclude_unset=True)
    # Dividir nombre y añadir a metadata
    first_name, last_name = split_name(user.name)
    metadata["first_name"] = first_name
    metadata["last_name"] = last_name
    
    # Create user document
    new_user = {
        "email": user.email,
        "name": user.name,
        "hashed_password": hashed_password,
        "active": True,
        "role": "user",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "metadata": metadata
    }
    
    try:
        # Insert user into database
        result = await users_collection.insert_one(new_user)
        
        # Get created user
        created_user = await users_collection.find_one({"_id": result.inserted_id})
        
        # Send welcome email
        try:
            await send_welcome_email(user.email, user.name)
        except Exception as e:
            logger.error(f"Failed to send welcome email: {e}")
        
        # Convert ObjectId to string for response
        created_user["id"] = str(created_user["_id"])
        
        return created_user
    except Exception as e:
        # Manejar el error de duplicado (aunque ya lo comprobamos antes)
        if "duplicate key error" in str(e):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        logger.error(f"Error registering user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )


@router.post("/sso/token", response_model=Dict[str, Any])
async def create_sso_token(request: Request):
    """
    Create token for SSO authenticated user
    """
    try:
        # Get user data from request body
        body = await request.json()
        user_data = body.get("user_data", {})
        
        if not user_data or not user_data.get("email"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User data missing email"
            )
        
        # Check if user exists by email
        email = user_data.get("email")
        user = await users_collection.find_one({"email": email})
        
        if not user:
            # Create user if not exists (using data from SSO)
            if user_data:
                # Construir nombre completo desde first_name y last_name si están disponibles
                full_name = None
                if user_data.get("first_name") and user_data.get("last_name"):
                    full_name = f"{user_data.get('first_name')} {user_data.get('last_name')}"
                elif user_data.get("first_name"):
                    full_name = user_data.get("first_name")
                
                # Use user data from SSO if available
                new_user = {
                    "email": user_data.get("email"),
                    "name": full_name or user_data.get("name", user_data.get("email", "Usuario")),
                    "hashed_password": get_password_hash("!S$0" + datetime.utcnow().isoformat()),  # Random password
                    "active": True,
                    "role": "user",
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                    "metadata": {
                        "sso_provider": user_data.get("provider", "unknown") or "globodain",
                        "sso_id": user_data.get("id") or user_data.get("sub"),
                        "sso_uuid": user_data.get("uuid"),
                        "first_name": user_data.get("first_name"),
                        "last_name": user_data.get("last_name"),
                        "is_business": user_data.get("is_business"),
                        "businesses": user_data.get("owned_businesses") or user_data.get("member_of_businesses")
                    }
                }
                
                # Insert user into database
                result = await users_collection.insert_one(new_user)
                
                # Get created user
                user = await users_collection.find_one({"_id": result.inserted_id})
                
                # Send welcome email
                try:
                    await send_welcome_email(user["email"], user["name"])
                except Exception as e:
                    logger.error(f"Failed to send welcome email: {e}")
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User not found and no user data provided"
                )
        else:
            # Actualizar usuario existente con datos del SSO si los datos son más completos
            if user_data:
                update_data = {}
                
                # Actualizar nombre si tenemos first_name y last_name y el usuario no tiene un nombre personalizado
                if user_data.get("first_name") and user_data.get("last_name") and (user["name"] == user["email"] or not user.get("name")):
                    update_data["name"] = f"{user_data.get('first_name')} {user_data.get('last_name')}"
                
                # Actualizar metadata con datos más completos del SSO
                metadata_updates = {}
                if user_data.get("uuid") and not user.get("metadata", {}).get("sso_uuid"):
                    metadata_updates["sso_uuid"] = user_data.get("uuid")
                
                if user_data.get("first_name") and not user.get("metadata", {}).get("first_name"):
                    metadata_updates["first_name"] = user_data.get("first_name")
                
                if user_data.get("last_name") and not user.get("metadata", {}).get("last_name"):
                    metadata_updates["last_name"] = user_data.get("last_name")
                
                if user_data.get("is_business") is not None and not user.get("metadata", {}).get("is_business"):
                    metadata_updates["is_business"] = user_data.get("is_business")
                
                businesses = user_data.get("owned_businesses") or user_data.get("member_of_businesses")
                if businesses and not user.get("metadata", {}).get("businesses"):
                    metadata_updates["businesses"] = businesses
                
                # Aplicar actualizaciones de metadata si hay cambios
                if metadata_updates:
                    current_metadata = user.get("metadata", {})
                    current_metadata.update(metadata_updates)
                    update_data["metadata"] = current_metadata
                
                # Actualizar usuario si hay cambios
                if update_data:
                    update_data["updated_at"] = datetime.utcnow()
                    await users_collection.update_one(
                        {"_id": user["_id"]},
                        {"$set": update_data}
                    )
                    
                    # Obtener usuario actualizado
                    user = await users_collection.find_one({"_id": user["_id"]})
        
        # Create access token
        access_token_expires = timedelta(minutes=1440)  # 24 hours
        access_token = create_access_token(
            data={"sub": str(user["_id"])},
            expires_delta=access_token_expires
        )
        
        # Update last login time
        await users_collection.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        # Return token
        expires_at = datetime.utcnow() + access_token_expires
        
        # Obtener el tipo de perfil del usuario
        profile_type = await get_user_profile_type(user)
        
        return {
            "access_token": {
                "access_token": access_token,
                "token_type": "bearer",
                "expires_at": expires_at.isoformat()
            },
            "user": {
                "id": str(user["_id"]),
                "email": user["email"],
                "name": user["name"],
                "display_name": get_display_name(user),
                "role": user.get("role", "user"),
                "active": user.get("active", True),
                "metadata": user.get("metadata", {}),
                "profile_type": profile_type
            }
        }
    
    except Exception as e:
        logger.error(f"Error creating SSO token: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating SSO token: {str(e)}"
        )


@router.get("/users/{email}/email")
async def get_user_by_email(email: str):
    """
    Get a user by email
    """
    user = await users_collection.find_one({"email": email})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Convert ObjectId to string for response
    user["id"] = str(user["_id"])
    del user["_id"]
    
    # Remove sensitive data
    if "hashed_password" in user:
        del user["hashed_password"]
    
    return user


@router.post("/password-reset/request")
async def request_password_reset(email: str):
    """
    Request a password reset
    """
    # Find user by email
    user = await users_collection.find_one({"email": email})
    
    # Return success even if user not found for security
    if not user:
        logger.info(f"Password reset requested for non-existent email: {email}")
        return {"detail": "If an account with this email exists, a password reset link has been sent"}
    
    # Generate reset token
    reset_token_expires = timedelta(hours=24)
    reset_token = create_access_token(
        data={"sub": str(user["_id"]), "reset": True},
        expires_delta=reset_token_expires
    )
    
    # Store token in database
    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {
            "reset_token": reset_token,
            "reset_token_expires": datetime.utcnow() + reset_token_expires
        }}
    )
    
    # Send password reset email
    try:
        from utils.email import send_password_reset_email
        await send_password_reset_email(user["email"], user["name"], reset_token)
    except Exception as e:
        logger.error(f"Failed to send password reset email: {e}")
    
    return {"detail": "If an account with this email exists, a password reset link has been sent"}


@router.post("/password-reset/confirm")
async def confirm_password_reset(token: str, new_password: str):
    """
    Confirm a password reset
    """
    try:
        # Decode token
        from utils.auth import jwt, SECRET_KEY, ALGORITHM
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Check if token is valid
        user_id = payload.get("sub")
        is_reset_token = payload.get("reset", False)
        
        if not user_id or not is_reset_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reset token"
            )
        
        # Find user
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check if token is expired
        reset_token_expires = user.get("reset_token_expires")
        if not reset_token_expires or datetime.utcnow() > reset_token_expires:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reset token has expired"
            )
        
        # Check if token matches
        if user.get("reset_token") != token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reset token"
            )
        
        # Update password
        hashed_password = get_password_hash(new_password)
        await users_collection.update_one(
            {"_id": user["_id"]},
            {"$set": {
                "hashed_password": hashed_password,
                "reset_token": None,
                "reset_token_expires": None,
                "updated_at": datetime.utcnow()
            }}
        )
        
        return {"detail": "Password has been reset successfully"}
    
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error confirming password reset: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token"
        ) 

# Función auxiliar para obtener el nombre completo del usuario
def get_display_name(user):
    """Obtener el nombre completo formateado del usuario"""
    if not user:
        return ""
        
    # Si tiene metadata con first_name y last_name, formatear el nombre completo
    metadata = user.get("metadata", {})
    first_name = metadata.get("first_name", "")
    last_name = metadata.get("last_name", "")
    
    if first_name and last_name:
        return f"{first_name} {last_name}".upper()
    
    # Si tiene un nombre establecido, usarlo
    if user.get("name") and user.get("name") != user.get("email"):
        return user.get("name").upper()
    
    # Si no tiene nombre, usar el email
    return user.get("email", "").split("@")[0].upper()

# Función auxiliar para obtener el tipo de perfil del usuario
async def get_user_profile_type(user):
    """Obtener el tipo de perfil del usuario basado en sus resultados de tests"""
    if not user:
        return ""
        
    # Buscar el último test completado para obtener el perfil
    last_test = await test_results_collection.find_one(
        {"user_id": str(user["_id"])}, 
        sort=[("created_at", -1)]
    )
    
    if last_test:
        return last_test.get("profile_type", "")
    
    return ""

# Añadir función para dividir nombre
def split_name(full_name: str):
    parts = full_name.strip().split()
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], " ".join(parts[1:]) 