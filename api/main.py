from fastapi import FastAPI, HTTPException, Request, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
import os
from dotenv import load_dotenv
import logging
import uvicorn
from datetime import datetime
from bson.objectid import ObjectId

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("api")

# Import database from new module
from database import database, lifespan_db, init_db

# Create FastAPI app with the database lifespan manager
app = FastAPI(
    title="EspaBila API",
    description="API for EspaBila educational platform",
    version="0.1.0",
    lifespan=lifespan_db
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", os.getenv("FRONTEND_URL", "http://localhost:8081"), "http://localhost:8081", "http://localhost:3000"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Evento de inicio de la aplicación
@app.on_event("startup")
async def startup_event():
    """Ejecutar tareas de inicialización"""
    try:
        # Inicializar la base de datos
        await init_db()
        
        # Importar la función de inicialización de tests después de configurar la base de datos
        # para evitar importaciones circulares
        from routes.tests import init_test_data
        
        logger.info("Inicializando datos de prueba...")
        await init_test_data()
        logger.info("Datos de prueba inicializados correctamente")
    except Exception as e:
        logger.error(f"Error inicializando datos de prueba: {e}")

def setup_routes():
    # Skip circular imports
    from routes.auth import router as auth_router
    from routes.tests import router as tests_router
    from routes.users import router as users_router
    
    app.include_router(auth_router, prefix="/v1/auth", tags=["auth"])
    app.include_router(tests_router, prefix="/v1/tests", tags=["tests"])
    app.include_router(users_router, prefix="/v1/users", tags=["users"])

# Llamar a la configuración de rutas
setup_routes()

# Redirecciones para backward compatibility y para atender directamente las peticiones del frontend
@app.get("/api/v1/auth/users/{email}/email")
async def handle_get_user_by_email(email: str):
    """Handle requests to get user by email directly"""
    user = await database.users.find_one({"email": email})
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Convert ObjectId to string for response
    user["id"] = str(user["_id"])
    del user["_id"]
    
    # Remove sensitive data
    if "hashed_password" in user:
        del user["hashed_password"]
    
    return user

@app.post("/api/v1/auth/users")
async def handle_create_user(request: Request):
    """Handle requests to create user directly"""
    body = await request.json()
    from routes.auth import register_user
    from models.user import UserCreate
    user_create = UserCreate(**body)
    return await register_user(user_create)

@app.post("/api/v1/auth/token")
async def handle_token(request: Request):
    """Handle token requests directly"""
    body = await request.json()
    from routes.auth import login_for_access_token
    from fastapi.security import OAuth2PasswordRequestForm
    
    # Convert JSON to form data
    form_data = OAuth2PasswordRequestForm(username=body.get("username"), password=body.get("password"), scope="")
    return await login_for_access_token(form_data)

@app.post("/api/v1/auth/sso/token")
async def handle_sso_token(request: Request):
    """Handle SSO token requests directly"""
    from routes.auth import create_sso_token
    return await create_sso_token(request)

@app.get("/api/v1/users/{user_id}/profile")
async def handle_user_profile(user_id: str, request: Request):
    """Handle requests for user profile directly"""
    # Extract authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = auth_header.replace("Bearer ", "")
    
    # Validate token and get current user
    from utils.auth import get_current_user
    
    current_user = await get_current_user(token)
    
    # Check if user is requesting their own info or is an admin
    if current_user.get("user_id") != user_id and not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access this user's profile"
        )
    
    # Get user from database
    try:
        user = await database.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
    except Exception as e:
        logger.error(f"Error getting user profile: {e}")
        raise HTTPException(
            status_code=404,
            detail="User not found or invalid ID format"
        )
    
    # Obtener el nombre para mostrar
    from routes.auth import get_display_name
    display_name = get_display_name(user)
    
    # Get user's test history from test_results collection
    try:
        tests_cursor = database.test_results.find({"user_id": user_id}).sort("created_at", -1)
        tests = await tests_cursor.to_list(length=100)  # Limit to last 100 tests
    except Exception as e:
        logger.error(f"Error getting test results: {e}")
        tests = []
    
    # Get profile type from most recent comprehensive test
    latest_comprehensive_test = None
    for test in tests:
        if test.get("test_type") == "comprehensive":
            latest_comprehensive_test = test
            break
    
    # Format results for frontend display
    formatted_tests = []
    for test in tests:
        # Asegurar que el ObjectId se convierta a string si existe
        test_id = str(test.get("_id")) if test.get("_id") else ""
        
        # Formatear fecha en formato legible
        created_date = test.get("created_at")
        formatted_date = ""
        formatted_time = ""
        if created_date:
            if isinstance(created_date, datetime):
                formatted_date = created_date.strftime("%d/%m/%Y")
                formatted_time = created_date.strftime("%H:%M:%S")
        
        # Formatear habilidades para mostrar en la interfaz
        skills_formatted = []
        for skill in test.get("skills", []):
            # Convertir a formato de UI (capitalizar y reemplazar _ por espacios)
            skill_display = skill.replace("_", " ").title()
            skills_formatted.append(skill_display)
        
        # Crear un objeto formateado para el frontend
        formatted_test = {
            "id": test_id,
            "profile_type": test.get("profile_type", ""),
            "test_type": test.get("test_type", ""),
            "date": formatted_date,
            "time": formatted_time,
            "score": test.get("score", 0),
            "skills": skills_formatted,
            "recommended_professions": test.get("recommended_professions", []),
            "similar_personalities": test.get("similar_personalities", []),
        }
        formatted_tests.append(formatted_test)
    
    # Build profile data
    profile_data = {
        "id": user_id,
        "email": user.get("email"),
        "name": user.get("name"),
        "display_name": display_name,
        "metadata": user.get("metadata", {}),
        "profile_type": latest_comprehensive_test.get("profile_type", "") if latest_comprehensive_test else "",
        "skills": latest_comprehensive_test.get("skills", []) if latest_comprehensive_test else [],
        "interests": latest_comprehensive_test.get("interests", []) if latest_comprehensive_test else [],
        "similar_personalities": latest_comprehensive_test.get("similar_personalities", []) if latest_comprehensive_test else [],
        "recommended_professions": latest_comprehensive_test.get("recommended_professions", []) if latest_comprehensive_test else [],
        "completed_tests": formatted_tests,
        "tests_count": len(tests)
    }
    
    return profile_data

@app.get("/health")
async def health_check():
    """Health check endpoint to verify the API is running"""
    return {"status": "ok"}

@app.post("/api/v1/users/{user_id}/initialize-demo")
async def initialize_user_demo(user_id: str, request: Request):
    """Inicializar datos de demostración para un usuario"""
    # Extract authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = auth_header.replace("Bearer ", "")
    
    # Validate token and get current user
    from utils.auth import get_current_user
    
    current_user = await get_current_user(token)
    
    # Check if user is requesting for themselves
    if current_user.get("user_id") != user_id and not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=403,
            detail="Not authorized to initialize demo for this user"
        )
    
    # Call the initialize_demo_test function
    from routes.tests import initialize_demo_test
    result = await initialize_demo_test(current_user)
    
    return result

if __name__ == "__main__":
    port = int(os.getenv("API_PORT", 2000))
    uvicorn.run("main:app", host=os.getenv("API_HOST", "0.0.0.0"), port=port, reload=True)
