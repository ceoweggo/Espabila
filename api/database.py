import motor.motor_asyncio
import os
from dotenv import load_dotenv
import logging
from contextlib import asynccontextmanager

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger("database")

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "espabila")

# Create a MongoDB client
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
database = client[DB_NAME]

@asynccontextmanager
async def lifespan_db(app=None):
    # Startup: verify MongoDB connection
    try:
        await client.admin.command('ping')
        logger.info("Connected to MongoDB successfully")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise
    yield
    # Shutdown
    client.close()
    logger.info("Closed MongoDB connection")

# Collections
users_collection = database.users
tests_collection = database.tests
test_results_collection = database.test_results
test_sessions_collection = database.test_sessions
test_definitions_collection = database.test_definitions

async def init_db():
    try:
        # Crear índice único para email en users_collection
        await users_collection.create_index("email", unique=True)
        logger.info("Índice único para email creado correctamente")
    except Exception as e:
        logger.error(f"Error creando índice para email: {e}") 