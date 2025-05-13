from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from typing import Dict, Any, List, Optional
import logging
from datetime import datetime, timedelta
from bson.objectid import ObjectId
import random

from models.test import TestCreate, TestResponse, TestResult, TestHistory
from models.user import UserInDB
from utils.auth import get_current_user
from database import database, tests_collection, test_results_collection, test_sessions_collection, test_definitions_collection, users_collection

# Logger
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Inicializar datos de ejemplo
async def init_test_data():
    """Inicializar datos de ejemplo para las pruebas si no existen"""
    # Verificar si ya tenemos tests definidos
    count = await test_definitions_collection.count_documents({})
    if count > 0:
        return
    
    logger.info("Inicializando datos de ejemplo para las pruebas")
    
    # Datos para test rápido
    rapid_test = {
        "title": "Evaluación Rápida",
        "description": "Evaluación breve con 20 preguntas",
        "test_type": "rapid",
        "category": "personality",
        "difficulty": "easy",
        "duration": 10,  # minutos
        "passing_score": 0.6,
        "total_questions": 20,
        "skills": ["logical_reasoning", "critical_thinking", "data_analysis"],
        "profile_types": [
            {
                "name": "Analytical Problem-Solver",
                "threshold": 0.8,
                "description": "Excelente para resolver problemas complejos con un enfoque analítico",
                "skills": ["Logical reasoning", "Data analysis", "Critical thinking"],
                "recommended_professions": ["Analista de datos", "Consultor", "Investigador"]
            },
            {
                "name": "Compassionate Guide",
                "threshold": 0.7,
                "description": "Gran capacidad para entender y guiar a otros con empatía",
                "skills": ["Empathetic listening", "Supportive communication", "Conflict resolution"],
                "recommended_professions": ["Coach", "Terapeuta", "Mediador"]
            },
            {
                "name": "Strategic Visionary",
                "threshold": 0.75,
                "description": "Habilidad para desarrollar estrategias y visualizar el futuro",
                "skills": ["Strategic planning", "Vision development", "Trend analysis"],
                "recommended_professions": ["Director de estrategia", "Emprendedor", "Consultor de negocios"]
            }
        ],
        "questions": [],  # Aquí irían las preguntas reales
        "active": True,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    # Datos para test completo
    comprehensive_test = {
        "title": "Evaluación Completa",
        "description": "Análisis profundo con 80 preguntas",
        "test_type": "comprehensive",
        "category": "personality",
        "difficulty": "medium",
        "duration": 30,  # minutos
        "passing_score": 0.6,
        "total_questions": 80,
        "skills": ["adaptability", "creative_problem_solving", "risk_assessment"],
        "profile_types": [
            {
                "name": "Innovative Trailblazer",
                "threshold": 0.8,
                "description": "Pionero en ideas innovadoras y enfoques creativos",
                "skills": ["Creative problem-solving", "Adaptability", "Risk assessment"],
                "recommended_professions": ["Innovador", "Emprendedor", "Director creativo"]
            },
            {
                "name": "Strategic Leader",
                "threshold": 0.75,
                "description": "Excelente para liderar equipos y desarrollar estrategias",
                "skills": ["Leadership", "Strategic thinking", "Team building"],
                "recommended_professions": ["Director ejecutivo", "Gerente de proyecto", "Consultor"]
            },
            {
                "name": "Technical Specialist",
                "threshold": 0.85,
                "description": "Experto técnico con gran atención al detalle",
                "skills": ["Technical expertise", "Detail orientation", "Analytical thinking"],
                "recommended_professions": ["Ingeniero", "Científico de datos", "Desarrollador"]
            }
        ],
        "questions": [],  # Aquí irían las preguntas reales
        "active": True,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    # Generar preguntas de ejemplo para ambos tests
    rapid_test["questions"] = generate_sample_questions(20)
    comprehensive_test["questions"] = generate_sample_questions(80)
    
    # Insertar en la base de datos
    await test_definitions_collection.insert_many([rapid_test, comprehensive_test])
    logger.info("Datos de ejemplo para las pruebas inicializados correctamente")

def generate_sample_questions(count):
    """Generar preguntas de ejemplo para las pruebas"""
    questions = []
    for i in range(count):
        question = {
            "id": f"q{i+1}",
            "text": f"Pregunta de ejemplo #{i+1}",
            "type": "multiple_choice",
            "options": [
                {"id": f"a{i+1}", "text": "Opción A"},
                {"id": f"b{i+1}", "text": "Opción B"},
                {"id": f"c{i+1}", "text": "Opción C"},
                {"id": f"d{i+1}", "text": "Opción D"}
            ],
            "correct_option": f"a{i+1}",
            "difficulty": "medium"
        }
        questions.append(question)
    return questions

@router.post("/sessions", response_model=TestResponse)
async def create_test_session(
    test_id: str = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Create a new test session
    """
    # Get user ID
    user_id = current_user.get("user_id")
    
    # Check if test exists
    test = await test_definitions_collection.find_one({"_id": ObjectId(test_id)})
    if not test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Test not found"
        )
    
    # Create session
    session = {
        "user_id": user_id,
        "test_id": test_id,
        "start_time": datetime.now(),
        "end_time": None,
        "total_questions": len(test.get("questions", [])),
        "completed_questions": 0,
        "correct_answers": 0,
        "incorrect_answers": 0,
        "score": 0.0,
        "status": "in_progress",
        "results": [],
        "test_data": {
            "title": test.get("title"),
            "description": test.get("description"),
            "test_type": test.get("test_type"),
            "category": test.get("category"),
            "difficulty": test.get("difficulty")
        },
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    # Insert session
    result = await test_sessions_collection.insert_one(session)
    
    # Get created session
    created_session = await test_sessions_collection.find_one({"_id": result.inserted_id})
    
    # Convert ObjectId to string for response
    created_session["id"] = str(created_session["_id"])
    
    return created_session


@router.get("/sessions/{session_id}", response_model=TestResponse)
async def get_test_session(
    session_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get a test session by ID
    """
    # Get user ID
    user_id = current_user.get("user_id")
    
    # Get session
    session = await test_sessions_collection.find_one({
        "_id": ObjectId(session_id),
        "user_id": user_id  # Ensure user can only access their own sessions
    })
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Test session not found"
        )
    
    # Convert ObjectId to string for response
    session["id"] = str(session["_id"])
    
    return session


@router.put("/sessions/{session_id}", response_model=TestResponse)
async def update_test_session(
    session_id: str,
    result: TestResult,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update a test session with a new result
    """
    # Get user ID
    user_id = current_user.get("user_id")
    
    # Get session
    session = await test_sessions_collection.find_one({
        "_id": ObjectId(session_id),
        "user_id": user_id  # Ensure user can only update their own sessions
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
    
    # Add result
    results = session.get("results", [])
    
    # Check if question already answered
    for existing_result in results:
        if existing_result.get("question_id") == result.question_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Question already answered"
            )
    
    # Add new result
    results.append(result.dict())
    
    # Update session stats
    completed_questions = len(results)
    correct_answers = sum(1 for r in results if r.get("is_correct"))
    incorrect_answers = completed_questions - correct_answers
    score = correct_answers / session.get("total_questions") if session.get("total_questions") > 0 else 0
    
    # Check if test is completed
    status = "in_progress"
    end_time = None
    if completed_questions >= session.get("total_questions"):
        status = "completed"
        end_time = datetime.now()
    
    # Update session
    await test_sessions_collection.update_one(
        {"_id": ObjectId(session_id)},
        {"$set": {
            "results": results,
            "completed_questions": completed_questions,
            "correct_answers": correct_answers,
            "incorrect_answers": incorrect_answers,
            "score": score,
            "status": status,
            "end_time": end_time,
            "updated_at": datetime.now()
        }}
    )
    
    # Get updated session
    updated_session = await test_sessions_collection.find_one({"_id": ObjectId(session_id)})
    
    # Convert ObjectId to string for response
    updated_session["id"] = str(updated_session["_id"])
    
    return updated_session


@router.post("/sessions/{session_id}/complete", response_model=TestResponse)
async def complete_test_session(
    session_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Mark a test session as completed
    """
    # Get user ID
    user_id = current_user.get("user_id")
    
    # Get session
    session = await test_sessions_collection.find_one({
        "_id": ObjectId(session_id),
        "user_id": user_id  # Ensure user can only complete their own sessions
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
    
    # Obtener test definition para determinar el perfil
    test_id = session.get("test_id")
    test_definition = await test_definitions_collection.find_one({"_id": ObjectId(test_id)})
    
    if not test_definition:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Test definition not found"
        )
    
    # Calcular score final
    score = session.get("score", 0.0)
    
    # Determinar el perfil según el puntaje y el tipo de test
    profile_type = ""
    skills = []
    interests = []
    similar_personalities = []
    recommended_professions = []
    
    # Seleccionar el perfil adecuado según el puntaje
    profile_types = test_definition.get("profile_types", [])
    selected_profile = None
    
    for profile in profile_types:
        if score >= profile.get("threshold", 0.0):
            if not selected_profile or profile.get("threshold", 0.0) > selected_profile.get("threshold", 0.0):
                selected_profile = profile
    
    # Si encontramos un perfil, extraer la información
    if selected_profile:
        profile_type = selected_profile.get("name", "")
        skills = selected_profile.get("skills", [])
        recommended_professions = selected_profile.get("recommended_professions", [])
        
        # Generar some similar personalities de los otros perfiles disponibles
        for profile in profile_types:
            if profile != selected_profile:
                similar_personalities.append(profile.get("name", ""))
        
        # Limitar a 3 personalidades similares
        similar_personalities = similar_personalities[:3]
    
    # Actualizar la sesión
    end_time = datetime.now()
    await test_sessions_collection.update_one(
        {"_id": ObjectId(session_id)},
        {"$set": {
            "status": "completed",
            "end_time": end_time,
            "updated_at": datetime.now(),
            "profile_type": profile_type,
            "skills": skills,
            "interests": interests,
            "similar_personalities": similar_personalities,
            "recommended_professions": recommended_professions,
        }}
    )
    
    # Crear un test history record para mostrar en el perfil del usuario
    test_history = {
        "user_id": user_id,
        "test_id": test_id,
        "test_type": test_definition.get("test_type", ""),
        "profile_type": profile_type,
        "score": score,
        "start_time": session.get("start_time"),
        "end_time": end_time,
        "duration": (end_time - session.get("start_time")).total_seconds() if session.get("start_time") else None,
        "status": "completed",
        "skills": skills,
        "interests": interests,
        "similar_personalities": similar_personalities,
        "recommended_professions": recommended_professions,
        "created_at": datetime.now()
    }
    
    # Guardar el resultado en la colección de test_results
    await test_results_collection.insert_one(test_history)
    
    # Get updated session
    updated_session = await test_sessions_collection.find_one({"_id": ObjectId(session_id)})
    
    # Convert ObjectId to string for response
    updated_session["id"] = str(updated_session["_id"])
    
    return updated_session


@router.get("/sessions", response_model=List[TestResponse])
async def get_user_test_sessions(
    status: Optional[str] = Query(None),
    test_type: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get user's test sessions
    """
    # Get user ID
    user_id = current_user.get("user_id")
    
    # Build query
    query = {"user_id": user_id}
    
    # Add filters
    if status:
        query["status"] = status
    
    if test_type:
        query["test_data.test_type"] = test_type
    
    # Get sessions
    cursor = test_sessions_collection.find(query)
    
    # Apply pagination
    cursor = cursor.sort("created_at", -1).skip(offset).limit(limit)
    
    # Get results
    sessions = await cursor.to_list(length=limit)
    
    # Convert ObjectId to string for response
    for session in sessions:
        session["id"] = str(session["_id"])
    
    return sessions


@router.get("/{test_type}", response_model=List[Dict[str, Any]])
async def get_available_tests(
    test_type: str,
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get available tests by type
    """
    # Build query
    query = {"test_type": test_type, "active": True}
    
    # Add filters
    if category:
        query["category"] = category
    
    if difficulty:
        query["difficulty"] = difficulty
    
    # Get tests
    cursor = test_definitions_collection.find(query, {
        "_id": 1,
        "title": 1,
        "description": 1,
        "test_type": 1,
        "category": 1,
        "difficulty": 1,
        "duration": 1,
        "passing_score": 1,
        "tags": 1
    })
    
    # Get results
    tests = await cursor.to_list(length=100)
    
    # Convert ObjectId to string for response
    for test in tests:
        test["id"] = str(test["_id"])
        del test["_id"]
    
    return tests


@router.get("/history/summary", response_model=Dict[str, Any])
async def get_test_history_summary(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get summary of user's test history
    """
    # Get user ID
    user_id = current_user.get("user_id")
    
    # Get total sessions
    total_sessions = await test_sessions_collection.count_documents({"user_id": user_id})
    
    # Get completed sessions
    completed_sessions = await test_sessions_collection.count_documents({
        "user_id": user_id,
        "status": "completed"
    })
    
    # Get average score
    pipeline = [
        {"$match": {"user_id": user_id, "status": "completed"}},
        {"$group": {
            "_id": None,
            "avg_score": {"$avg": "$score"},
            "total_correct": {"$sum": "$correct_answers"},
            "total_questions": {"$sum": "$total_questions"}
        }}
    ]
    
    result = await test_sessions_collection.aggregate(pipeline).to_list(length=1)
    
    avg_score = result[0]["avg_score"] if result else 0
    total_correct = result[0]["total_correct"] if result else 0
    total_questions = result[0]["total_questions"] if result else 0
    
    # Get test type breakdown
    pipeline = [
        {"$match": {"user_id": user_id, "status": "completed"}},
        {"$group": {
            "_id": "$test_data.test_type",
            "count": {"$sum": 1},
            "avg_score": {"$avg": "$score"}
        }}
    ]
    
    test_types = await test_sessions_collection.aggregate(pipeline).to_list(length=10)
    
    # Format test type results
    test_type_breakdown = {}
    for item in test_types:
        test_type_breakdown[item["_id"]] = {
            "count": item["count"],
            "avg_score": item["avg_score"]
        }
    
    # Get recent improvement trend (last 5 completed tests)
    pipeline = [
        {"$match": {"user_id": user_id, "status": "completed"}},
        {"$sort": {"end_time": -1}},
        {"$limit": 5},
        {"$project": {
            "score": 1,
            "end_time": 1,
            "test_data.title": 1,
            "test_data.test_type": 1
        }}
    ]
    
    recent_tests = await test_sessions_collection.aggregate(pipeline).to_list(length=5)
    
    # Format recent tests
    recent_scores = []
    for test in recent_tests:
        recent_scores.append({
            "title": test.get("test_data", {}).get("title", "Unknown Test"),
            "test_type": test.get("test_data", {}).get("test_type", "unknown"),
            "score": test.get("score", 0),
            "date": test.get("end_time", datetime.now()).isoformat()
        })
    
    # Return summary
    return {
        "total_sessions": total_sessions,
        "completed_sessions": completed_sessions,
        "avg_score": avg_score,
        "total_correct": total_correct,
        "total_questions": total_questions,
        "accuracy": total_correct / total_questions if total_questions > 0 else 0,
        "test_type_breakdown": test_type_breakdown,
        "recent_scores": recent_scores
    }


@router.get("/health")
async def test_health():
    """Health check endpoint for tests module"""
    return {"status": "ok", "message": "Tests module is working"}

@router.post("/initialize-demo-test")
async def initialize_demo_test(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Inicializar un test de demostración para el usuario actual.
    Útil para propósitos de demostración.
    """
    # Get user ID
    user_id = current_user.get("user_id")
    
    # Check if user already has tests
    existing_tests = await test_results_collection.count_documents({"user_id": user_id})
    
    if existing_tests > 0:
        return {"status": "ok", "message": "User already has tests", "test_count": existing_tests}
    
    # Get a test definition (preferably comprehensive)
    test_definition = await test_definitions_collection.find_one({"test_type": "comprehensive"})
    
    if not test_definition:
        # If no comprehensive test, get any test
        test_definition = await test_definitions_collection.find_one({})
        
        if not test_definition:
            # If no tests at all, run initialization
            await init_test_data()
            test_definition = await test_definitions_collection.find_one({})
    
    # Create a completed test for the user
    test_id = str(test_definition.get("_id"))
    
    # Seleccionar un perfil aleatorio de los disponibles
    profile_types = test_definition.get("profile_types", [])
    profile_type = profile_types[0] if profile_types else {}
    
    # Si hay más de un perfil, elegir uno aleatoriamente
    if len(profile_types) > 1:
        profile_type = random.choice(profile_types)
    
    end_time = datetime.now()
    start_time = end_time - timedelta(minutes=25)  # Test took 25 minutes
    
    # Crear datos de profile_type
    profile_type_name = profile_type.get("name", "Innovative Trailblazer")
    profile_skills = profile_type.get("skills", ["Creative problem-solving", "Adaptability", "Risk assessment"])
    profile_recommended_professions = profile_type.get("recommended_professions", ["Innovador", "Emprendedor", "Director creativo"])
    
    # Generar personalidades similares
    similar_personalities = []
    for p in profile_types:
        if p != profile_type:
            similar_personalities.append(p.get("name", ""))
    similar_personalities = similar_personalities[:3]  # Limitar a 3
    
    # Intereses aleatorios
    interests = ["Technology", "Innovation", "Leadership", "Design", "Communication"]
    selected_interests = random.sample(interests, min(3, len(interests)))

    # Demo MBTI
    mbti_type = "ENFP"
    mbti_group = "Diplomats"
    advice = "Sigue tu pasión y busca el equilibrio entre tus intereses y tus habilidades."
    recommended_activities = ["Voluntariado", "Pintura", "Mentoría"]
    
    test_history = {
        "user_id": user_id,
        "test_id": test_id,
        "test_type": test_definition.get("test_type", "comprehensive"),
        "profile_type": profile_type_name,
        "score": 0.85,  # Demo score
        "start_time": start_time,
        "end_time": end_time,
        "duration": 1500,  # 25 minutes in seconds
        "status": "completed",
        "skills": profile_skills,
        "interests": selected_interests,
        "similar_personalities": similar_personalities,
        "recommended_professions": profile_recommended_professions,
        "mbti_type": mbti_type,
        "mbti_group": mbti_group,
        "advice": advice,
        "recommended_activities": recommended_activities,
        "created_at": end_time
    }
    
    # Guardar el resultado en la colección de test_results
    result = await test_results_collection.insert_one(test_history)
    
    # También crear una sesión de test para este resultado
    session = {
        "user_id": user_id,
        "test_id": test_id,
        "start_time": start_time,
        "end_time": end_time,
        "total_questions": len(test_definition.get("questions", [])),
        "completed_questions": len(test_definition.get("questions", [])),
        "correct_answers": int(0.85 * len(test_definition.get("questions", []))),  # 85% correcto
        "incorrect_answers": int(0.15 * len(test_definition.get("questions", []))),  # 15% incorrecto
        "score": 0.85,
        "status": "completed",
        "results": [],  # No necesitamos detalles de respuestas para demo
        "test_data": {
            "title": test_definition.get("title"),
            "description": test_definition.get("description"),
            "test_type": test_definition.get("test_type"),
            "category": test_definition.get("category"),
            "difficulty": test_definition.get("difficulty")
        },
        "profile_type": profile_type_name,
        "skills": profile_skills,
        "interests": selected_interests,
        "similar_personalities": similar_personalities,
        "recommended_professions": profile_recommended_professions,
        "mbti_type": mbti_type,
        "mbti_group": mbti_group,
        "advice": advice,
        "recommended_activities": recommended_activities,
        "created_at": end_time,
        "updated_at": end_time
    }
    
    session_result = await test_sessions_collection.insert_one(session)
    
    # Después de crear el test, actualizar el usuario con el tipo de perfil
    try:
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            # Actualizar metadata del usuario con el tipo de perfil
            metadata = user.get("metadata", {})
            metadata["profile_type"] = profile_type_name
            metadata["test_completed"] = True
            metadata["mbti_type"] = mbti_type
            metadata["mbti_group"] = mbti_group
            metadata["advice"] = advice
            metadata["recommended_activities"] = recommended_activities
            await users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {
                    "metadata": metadata,
                    "updated_at": datetime.now()
                }}
            )
    except Exception as e:
        logger.error(f"Error updating user with profile type: {e}")
    
    # Convertir ObjectId a string en la respuesta
    return {
        "status": "ok", 
        "message": "Demo test initialized successfully", 
        "test_id": str(result.inserted_id),
        "session_id": str(session_result.inserted_id),
        "profile_type": profile_type_name,
        "skills": profile_skills,
        "interests": selected_interests,
        "recommended_professions": profile_recommended_professions,
        "mbti_type": mbti_type,
        "mbti_group": mbti_group,
        "advice": advice,
        "recommended_activities": recommended_activities
    }

@router.post("/start-test")
async def start_test(test_type: str = Body(...), current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Inicia un test rápido o completo y devuelve las preguntas.
    """
    if test_type == "quick":
        test = await test_definitions_collection.find_one({"test_type": "rapid", "active": True})
    elif test_type == "comprehensive":
        test = await test_definitions_collection.find_one({"test_type": "comprehensive", "active": True})
    else:
        raise HTTPException(status_code=400, detail="Tipo de test no válido")
    if not test:
        raise HTTPException(status_code=404, detail="Test no encontrado")
    return {"test_id": str(test["_id"]), "questions": test["questions"]}

@router.post("/submit-test")
async def submit_test(
    test_id: str = Body(...),
    answers: Dict[str, Any] = Body(...),
    test_type: str = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Recibe las respuestas, guarda el resultado y genera el perfil psicotécnico realista (MBTI e Ikigai).
    """
    user_id = current_user.get("user_id")

    # Obtener definición del test
    test = await test_definitions_collection.find_one({"_id": ObjectId(test_id)})
    if not test:
        raise HTTPException(status_code=404, detail="Test no encontrado")
    questions = test.get("questions", [])

    # Mapear preguntas por ID
    question_map = {q["id"]: q for q in questions}

    # Inicializar contadores MBTI e Ikigai
    mbti_scores = {d: 0 for d in ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']}
    ikigai_scores = {a: 0 for a in ['passion', 'mission', 'vocation', 'profession']}
    open_answers = {}

    # Procesar respuestas
    for qid, value in answers.items():
        q = question_map.get(qid)
        if not q:
            continue
        # MBTI
        mbti_dim = q.get('mbti_dimension')
        if mbti_dim and mbti_dim in mbti_scores:
            # Para escala/múltiple, sumar 1; para open, ignorar
            if isinstance(value, (int, float)):
                mbti_scores[mbti_dim] += value
            else:
                mbti_scores[mbti_dim] += 1
        # Ikigai
        ikigai_area = q.get('ikigai_area')
        if ikigai_area and ikigai_area in ikigai_scores:
            ikigai_scores[ikigai_area] += 1
        # Guardar respuestas abiertas para narrativa
        if q.get('type') == 'open' or q.get('tipo') == 'abierta':
            open_answers[qid] = value

    # Determinar tipo MBTI dominante (simplificado)
    def get_mbti_type(scores):
        # E/I, S/N, T/F, J/P
        pairs = [('E', 'I'), ('S', 'N'), ('T', 'F'), ('J', 'P')]
        result = ''
        for a, b in pairs:
            if scores[a] >= scores[b]:
                result += a
            else:
                result += b
        return result
    mbti_type = get_mbti_type(mbti_scores)

    # Determinar área Ikigai dominante
    ikigai_area = max(ikigai_scores, key=ikigai_scores.get)

    # Mapas de perfiles (ejemplo)
    MBTI_MAP = {
        'INTJ': {
            'profileType': 'Arquitecto',
            'skills': ['Pensamiento estratégico', 'Planificación', 'Análisis'],
            'interests': ['Innovación', 'Ciencia', 'Tecnología'],
            'similiarPersonalities': ['Elon Musk', 'Isaac Newton'],
            'recommendedProfessions': ['Ingeniero', 'Científico', 'Estratega'],
            'advice': 'Aprovecha tu capacidad de ver patrones y planificar a largo plazo.',
            'recommendedActivities': ['Resolver acertijos', 'Diseñar proyectos']
        },
        'ENFP': {
            'profileType': 'Activista',
            'skills': ['Empatía', 'Comunicación', 'Creatividad'],
            'interests': ['Arte', 'Psicología', 'Educación'],
            'similiarPersonalities': ['Robin Williams', 'Anne Frank'],
            'recommendedProfessions': ['Coach', 'Escritor', 'Docente'],
            'advice': 'Usa tu energía para inspirar y motivar a otros.',
            'recommendedActivities': ['Escribir', 'Organizar eventos']
        },
        # ...otros tipos MBTI...
    }
    mbti_profile = MBTI_MAP.get(mbti_type, MBTI_MAP['INTJ'])

    IKIGAI_MAP = {
        'passion': {
            'skills': ['Creatividad', 'Motivación'],
            'interests': ['Arte', 'Innovación'],
            'recommendedProfessions': ['Artista', 'Emprendedor'],
            'advice': 'Sigue aquello que te apasiona y te hace perder la noción del tiempo.'
        },
        'mission': {
            'skills': ['Empatía', 'Servicio'],
            'interests': ['Voluntariado', 'Educación'],
            'recommendedProfessions': ['Docente', 'Trabajador social'],
            'advice': 'Busca cómo tu trabajo puede impactar positivamente en el mundo.'
        },
        'vocation': {
            'skills': ['Liderazgo', 'Comunicación'],
            'interests': ['Negocios', 'Gestión'],
            'recommendedProfessions': ['Gerente', 'Consultor'],
            'advice': 'Aprovecha tus talentos para crear valor y oportunidades.'
        },
        'profession': {
            'skills': ['Especialización', 'Disciplina'],
            'interests': ['Ciencia', 'Tecnología'],
            'recommendedProfessions': ['Ingeniero', 'Investigador'],
            'advice': 'Desarrolla tu experiencia y busca la excelencia profesional.'
        }
    }
    ikigai_profile = IKIGAI_MAP[ikigai_area]

    # Construir resultado final
    result = {
        "profileType": mbti_profile['profileType'],
        "mbtiType": mbti_type,
        "skills": list(set(mbti_profile['skills'] + ikigai_profile['skills'])),
        "interests": list(set(mbti_profile['interests'] + ikigai_profile['interests'])),
        "similiarPersonalities": mbti_profile['similiarPersonalities'],
        "recommendedProfessions": list(set(mbti_profile['recommendedProfessions'] + ikigai_profile['recommendedProfessions'])),
        "advice": mbti_profile['advice'] + ' ' + ikigai_profile['advice'],
        "recommendedActivities": mbti_profile['recommendedActivities']
    }

    # Guardar resultado en la base de datos
    test_doc = {
        "user_id": user_id,
        "test_id": test_id,
        "test_type": test_type,
        "answers": answers,
        "profile_type": result["profileType"],
        "mbti_type": mbti_type,
        "ikigai_area": ikigai_area,
        "skills": result["skills"],
        "interests": result["interests"],
        "similiarPersonalities": result["similiarPersonalities"],
        "recommended_professions": result["recommendedProfessions"],
        "advice": result["advice"],
        "recommended_activities": result["recommendedActivities"],
        "created_at": datetime.now()
    }
    await test_results_collection.insert_one(test_doc)

    # Actualizar perfil del usuario
    try:
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            metadata = user.get("metadata", {})
            metadata["profile_type"] = result["profileType"]
            metadata["mbti_type"] = mbti_type
            metadata["ikigai_area"] = ikigai_area
            metadata["skills"] = result["skills"]
            metadata["interests"] = result["interests"]
            metadata["similiarPersonalities"] = result["similiarPersonalities"]
            metadata["recommended_professions"] = result["recommendedProfessions"]
            metadata["advice"] = result["advice"]
            metadata["recommended_activities"] = result["recommendedActivities"]
            metadata["test_completed"] = True
            await users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"metadata": metadata, "updated_at": datetime.now()}}
            )
    except Exception as e:
        logger.error(f"Error updating user with profile type: {e}")

    return {"profile": result, "test_id": test_id}

@router.get('/{test_id}')
async def get_test_result_by_id(test_id: str):
    try:
        test = await test_results_collection.find_one({"_id": ObjectId(test_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid test_id format")

    if not test:
        # Simulación/mock si no existe
        return {
            "id": test_id,
            "profileType": "Demo Profile",
            "mbtiType": "ENFP",
            "mbtiGroup": "Diplomats",
            "skills": ["Creativity", "Empathy"],
            "interests": ["Art", "Helping others"],
            "similiarPersonalities": ["Oprah Winfrey", "Robin Williams"],
            "recommendedProfessions": ["Coach", "Artista"],
            "advice": "Sigue tu pasión.",
            "recommendedActivities": ["Voluntariado", "Pintura"]
        }

    mapped = {
        "id": str(test.get("_id")),
        "profileType": test.get("profileType") or test.get("profile_type", ""),
        "mbtiType": test.get("mbtiType") or test.get("mbti_type", ""),
        "mbtiGroup": test.get("mbtiGroup") or test.get("mbti_group", ""),
        "skills": test.get("skills", []),
        "interests": test.get("interests", []),
        "similiarPersonalities": test.get("similiarPersonalities") or test.get("similar_personalities", []),
        "recommendedProfessions": test.get("recommendedProfessions") or test.get("recommended_professions", []),
        "advice": test.get("advice", ""),
        "recommendedActivities": test.get("recommendedActivities") or test.get("recommended_activities", []),
    }
    return mapped 