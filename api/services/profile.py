from typing import Dict, Any, List
from bson import ObjectId
from pymongo import ReturnDocument
import logging
import random

from database import profiles_collection

# Logger
logger = logging.getLogger(__name__)

class ProfileService:
    """
    Profile functions to determine person's skills
    """

    # MBTI Personality Profiles
    MBTI_PROFILES = {
        'INTJ': {
            'name': 'Architect',
            'nameEs': 'Arquitecto',
            'group': 'Analysts',
            'groupEs': 'Analistas',
            'skills': ['Strategic thinking', 'Planning', 'Analysis'],
            'skillsEs': ['Pensamiento estratégico', 'Planificación', 'Análisis'],
            'interests': ['Innovation', 'Science', 'Technology'],
            'interestsEs': ['Innovación', 'Ciencia', 'Tecnología'],
            'similarPersonalities': ['Elon Musk', 'Isaac Newton'],
            'similarPersonalitiesEs': ['Elon Musk', 'Isaac Newton'],
            'recommendedProfessions': ['Engineer', 'Scientist', 'Strategist'],
            'recommendedProfessionsEs': ['Ingeniero', 'Científico', 'Estratega'],
            'advice': 'Leverage your ability to see patterns and plan long-term.',
            'adviceEs': 'Aprovecha tu capacidad de ver patrones y planificar a largo plazo.',
            'recommendedActivities': ['Solving puzzles', 'Designing projects'],
            'recommendedActivitiesEs': ['Resolver acertijos', 'Diseñar proyectos']
        },
        'INTP': {
            'name': 'Logician',
            'nameEs': 'Lógico',
            'group': 'Analysts',
            'groupEs': 'Analistas',
            'skills': ['Logical analysis', 'Innovation', 'Abstract thinking'],
            'skillsEs': ['Análisis lógico', 'Innovación', 'Pensamiento abstracto'],
            'interests': ['Science', 'Philosophy', 'Technology'],
            'interestsEs': ['Ciencia', 'Filosofía', 'Tecnología'],
            'similarPersonalities': ['Albert Einstein', 'Charles Darwin'],
            'similarPersonalitiesEs': ['Albert Einstein', 'Charles Darwin'],
            'recommendedProfessions': ['Scientist', 'Programmer', 'Philosopher'],
            'recommendedProfessionsEs': ['Científico', 'Programador', 'Filósofo'],
            'advice': 'Leverage your capacity for innovation and logical thinking.',
            'adviceEs': 'Aprovecha tu capacidad de innovación y pensamiento lógico.',
            'recommendedActivities': ['Programming', 'Learning new theories'],
            'recommendedActivitiesEs': ['Programar', 'Aprender nuevas teorías']
        },
        'ENTJ': {
            'name': 'Commander',
            'nameEs': 'Comandante',
            'group': 'Analysts',
            'groupEs': 'Analistas',
            'skills': ['Leadership', 'Strategy', 'Decision-making'],
            'skillsEs': ['Liderazgo', 'Estrategia', 'Decisión'],
            'interests': ['Business', 'Politics', 'Management'],
            'interestsEs': ['Negocios', 'Política', 'Gestión'],
            'similarPersonalities': ['Steve Jobs', 'Margaret Thatcher'],
            'similarPersonalitiesEs': ['Steve Jobs', 'Margaret Thatcher'],
            'recommendedProfessions': ['CEO', 'Politician', 'Executive'],
            'recommendedProfessionsEs': ['CEO', 'Político', 'Ejecutivo'],
            'advice': 'Use your leadership ability to inspire others.',
            'adviceEs': 'Usa tu capacidad de liderazgo para inspirar a otros.',
            'recommendedActivities': ['Leading teams', 'Planning strategies'],
            'recommendedActivitiesEs': ['Liderar equipos', 'Planificar estrategias']
        },
        'ENTP': {
            'name': 'Debater',
            'nameEs': 'Polemista',
            'group': 'Analysts',
            'groupEs': 'Analistas',
            'skills': ['Creativity', 'Debate', 'Vision'],
            'skillsEs': ['Creatividad', 'Debates', 'Visión'],
            'interests': ['Innovation', 'Debates', 'Ideas'],
            'interestsEs': ['Innovación', 'Debates', 'Ideas'],
            'similarPersonalities': ['Leonardo da Vinci', 'Richard Feynman'],
            'similarPersonalitiesEs': ['Leonardo da Vinci', 'Richard Feynman'],
            'recommendedProfessions': ['Entrepreneur', 'Lawyer', 'Inventor'],
            'recommendedProfessionsEs': ['Emprendedor', 'Abogado', 'Inventor'],
            'advice': 'Use your creativity to generate new ideas and solutions.',
            'adviceEs': 'Aprovecha tu creatividad para generar nuevas ideas y soluciones.',
            'recommendedActivities': ['Debating', 'Innovating'],
            'recommendedActivitiesEs': ['Debatir', 'Innovar']
        },
        'INFJ': {
            'name': 'Advocate',
            'nameEs': 'Defensor',
            'group': 'Diplomats',
            'groupEs': 'Diplomáticos',
            'skills': ['Empathy', 'Intuition', 'Creativity'],
            'skillsEs': ['Empatía', 'Intuición', 'Creatividad'],
            'interests': ['Psychology', 'Self-improvement', 'Helping others'],
            'interestsEs': ['Psicología', 'Autoconocimiento', 'Ayudar a otros'],
            'similarPersonalities': ['Martin Luther King Jr.', 'Mahatma Gandhi'],
            'similarPersonalitiesEs': ['Martin Luther King Jr.', 'Mahatma Gandhi'],
            'recommendedProfessions': ['Counselor', 'Psychologist', 'Writer'],
            'recommendedProfessionsEs': ['Consejero', 'Psicólogo', 'Escritor'],
            'advice': 'Use your intuition and empathy to help others grow.',
            'adviceEs': 'Usa tu intuición y empatía para ayudar a otros a crecer.',
            'recommendedActivities': ['Writing', 'Counseling'],
            'recommendedActivitiesEs': ['Escribir', 'Aconsejar']
        },
        'INFP': {
            'name': 'Mediator',
            'nameEs': 'Mediador',
            'group': 'Diplomats',
            'groupEs': 'Diplomáticos',
            'skills': ['Creativity', 'Idealism', 'Empathy'],
            'skillsEs': ['Creatividad', 'Idealismo', 'Empatía'],
            'interests': ['Art', 'Literature', 'Personal growth'],
            'interestsEs': ['Arte', 'Literatura', 'Crecimiento personal'],
            'similarPersonalities': ['J.R.R. Tolkien', 'William Shakespeare'],
            'similarPersonalitiesEs': ['J.R.R. Tolkien', 'William Shakespeare'],
            'recommendedProfessions': ['Writer', 'Artist', 'Therapist'],
            'recommendedProfessionsEs': ['Escritor', 'Artista', 'Terapeuta'],
            'advice': 'Express your creativity through meaningful projects that align with your values.',
            'adviceEs': 'Expresa tu creatividad a través de proyectos significativos que se alineen con tus valores.',
            'recommendedActivities': ['Creative writing', 'Art projects'],
            'recommendedActivitiesEs': ['Escritura creativa', 'Proyectos artísticos']
        },
        'ENFJ': {
            'name': 'Protagonist',
            'nameEs': 'Protagonista',
            'group': 'Diplomats',
            'groupEs': 'Diplomáticos',
            'skills': ['Leadership', 'Empathy', 'Communication'],
            'skillsEs': ['Liderazgo', 'Empatía', 'Comunicación'],
            'interests': ['Personal development', 'Social causes', 'Education'],
            'interestsEs': ['Desarrollo personal', 'Causas sociales', 'Educación'],
            'similarPersonalities': ['Barack Obama', 'Oprah Winfrey'],
            'similarPersonalitiesEs': ['Barack Obama', 'Oprah Winfrey'],
            'recommendedProfessions': ['Teacher', 'Coach', 'HR Manager'],
            'recommendedProfessionsEs': ['Profesor', 'Coach', 'Gerente de RRHH'],
            'advice': 'Use your natural charisma to inspire others toward positive change.',
            'adviceEs': 'Usa tu carisma natural para inspirar a otros hacia un cambio positivo.',
            'recommendedActivities': ['Mentoring', 'Community organizing'],
            'recommendedActivitiesEs': ['Mentoría', 'Organización comunitaria']
        },
        'ENFP': {
            'name': 'Campaigner',
            'nameEs': 'Activista',
            'group': 'Diplomats',
            'groupEs': 'Diplomáticos',
            'skills': ['Creativity', 'Enthusiasm', 'Communication'],
            'skillsEs': ['Creatividad', 'Entusiasmo', 'Comunicación'],
            'interests': ['People', 'Innovation', 'Creativity'],
            'interestsEs': ['Personas', 'Innovación', 'Creatividad'],
            'similarPersonalities': ['Robin Williams', 'Mark Twain'],
            'similarPersonalitiesEs': ['Robin Williams', 'Mark Twain'],
            'recommendedProfessions': ['Actor', 'Journalist', 'Entrepreneur'],
            'recommendedProfessionsEs': ['Actor', 'Periodista', 'Emprendedor'],
            'advice': 'Channel your enthusiasm into projects that inspire both you and others.',
            'adviceEs': 'Canaliza tu entusiasmo en proyectos que te inspiren tanto a ti como a los demás.',
            'recommendedActivities': ['Brainstorming', 'Social gatherings'],
            'recommendedActivitiesEs': ['Lluvia de ideas', 'Reuniones sociales']
        },
        'ISTJ': {
            'name': 'Logistician',
            'nameEs': 'Logista',
            'group': 'Sentinels',
            'groupEs': 'Centinelas',
            'skills': ['Organization', 'Attention to detail', 'Reliability'],
            'skillsEs': ['Organización', 'Atención al detalle', 'Confiabilidad'],
            'interests': ['Structure', 'Order', 'Tradition'],
            'interestsEs': ['Estructura', 'Orden', 'Tradición'],
            'similarPersonalities': ['George Washington', 'Queen Elizabeth II'],
            'similarPersonalitiesEs': ['George Washington', 'Reina Isabel II'],
            'recommendedProfessions': ['Accountant', 'Manager', 'Military officer'],
            'recommendedProfessionsEs': ['Contador', 'Gerente', 'Oficial militar'],
            'advice': 'Use your organizational skills to create efficient systems for yourself and others.',
            'adviceEs': 'Utiliza tus habilidades organizativas para crear sistemas eficientes para ti y para los demás.',
            'recommendedActivities': ['Organizing', 'Planning'],
            'recommendedActivitiesEs': ['Organizar', 'Planificar']
        },
        'ISFJ': {
            'name': 'Defender',
            'nameEs': 'Defensor',
            'group': 'Sentinels',
            'groupEs': 'Centinelas',
            'skills': ['Caring', 'Attention to detail', 'Reliability'],
            'skillsEs': ['Cuidado', 'Atención al detalle', 'Confiabilidad'],
            'interests': ['Helping others', 'Security', 'Tradition'],
            'interestsEs': ['Ayudar a otros', 'Seguridad', 'Tradición'],
            'similarPersonalities': ['Mother Teresa', 'Kate Middleton'],
            'similarPersonalitiesEs': ['Madre Teresa', 'Kate Middleton'],
            'recommendedProfessions': ['Nurse', 'Teacher', 'Social worker'],
            'recommendedProfessionsEs': ['Enfermero', 'Profesor', 'Trabajador social'],
            'advice': 'Use your nurturing nature to support others while taking care of yourself.',
            'adviceEs': 'Utiliza tu naturaleza protectora para apoyar a otros mientras te cuidas a ti mismo.',
            'recommendedActivities': ['Volunteering', 'Family gatherings'],
            'recommendedActivitiesEs': ['Voluntariado', 'Reuniones familiares']
        },
        'ESTJ': {
            'name': 'Executive',
            'nameEs': 'Ejecutivo',
            'group': 'Sentinels',
            'groupEs': 'Centinelas',
            'skills': ['Organization', 'Leadership', 'Efficiency'],
            'skillsEs': ['Organización', 'Liderazgo', 'Eficiencia'],
            'interests': ['Order', 'Tradition', 'Security'],
            'interestsEs': ['Orden', 'Tradición', 'Seguridad'],
            'similarPersonalities': ['Lyndon B. Johnson', 'Judge Judy'],
            'similarPersonalitiesEs': ['Lyndon B. Johnson', 'Juez Judy'],
            'recommendedProfessions': ['Manager', 'Judge', 'Military officer'],
            'recommendedProfessionsEs': ['Gerente', 'Juez', 'Oficial militar'],
            'advice': 'Use your organizational skills to lead others efficiently toward clear goals.',
            'adviceEs': 'Utiliza tus habilidades organizativas para guiar a otros de manera eficiente hacia objetivos claros.',
            'recommendedActivities': ['Leading committees', 'Planning events'],
            'recommendedActivitiesEs': ['Liderar comités', 'Planificar eventos']
        },
        'ESFJ': {
            'name': 'Consul',
            'nameEs': 'Cónsul',
            'group': 'Sentinels',
            'groupEs': 'Centinelas',
            'skills': ['Social awareness', 'Cooperation', 'Organization'],
            'skillsEs': ['Conciencia social', 'Cooperación', 'Organización'],
            'interests': ['Community', 'Tradition', 'Supporting others'],
            'interestsEs': ['Comunidad', 'Tradición', 'Apoyar a otros'],
            'similarPersonalities': ['Bill Clinton', 'Taylor Swift'],
            'similarPersonalitiesEs': ['Bill Clinton', 'Taylor Swift'],
            'recommendedProfessions': ['HR specialist', 'Event planner', 'Healthcare provider'],
            'recommendedProfessionsEs': ['Especialista en RRHH', 'Planificador de eventos', 'Profesional de la salud'],
            'advice': 'Use your social skills to create harmony and support in your communities.',
            'adviceEs': 'Utiliza tus habilidades sociales para crear armonía y apoyo en tus comunidades.',
            'recommendedActivities': ['Hosting events', 'Community service'],
            'recommendedActivitiesEs': ['Organizar eventos', 'Servicio comunitario']
        },
        'ISTP': {
            'name': 'Virtuoso',
            'nameEs': 'Virtuoso',
            'group': 'Explorers',
            'groupEs': 'Exploradores',
            'skills': ['Practical problem-solving', 'Adaptability', 'Technical ability'],
            'skillsEs': ['Resolución práctica de problemas', 'Adaptabilidad', 'Habilidad técnica'],
            'interests': ['Mechanics', 'Action', 'Craftsmanship'],
            'interestsEs': ['Mecánica', 'Acción', 'Artesanía'],
            'similarPersonalities': ['Michael Jordan', 'Tom Cruise'],
            'similarPersonalitiesEs': ['Michael Jordan', 'Tom Cruise'],
            'recommendedProfessions': ['Engineer', 'Mechanic', 'Pilot'],
            'recommendedProfessionsEs': ['Ingeniero', 'Mecánico', 'Piloto'],
            'advice': 'Use your practical skills and adaptability to solve concrete problems.',
            'adviceEs': 'Utiliza tus habilidades prácticas y adaptabilidad para resolver problemas concretos.',
            'recommendedActivities': ['DIY projects', 'Sports'],
            'recommendedActivitiesEs': ['Proyectos DIY', 'Deportes']
        },
        'ISFP': {
            'name': 'Adventurer',
            'nameEs': 'Aventurero',
            'group': 'Explorers',
            'groupEs': 'Exploradores',
            'skills': ['Aesthetics', 'Creativity', 'Adaptability'],
            'skillsEs': ['Estética', 'Creatividad', 'Adaptabilidad'],
            'interests': ['Art', 'Nature', 'Expression'],
            'interestsEs': ['Arte', 'Naturaleza', 'Expresión'],
            'similarPersonalities': ['Bob Dylan', 'Frida Kahlo'],
            'similarPersonalitiesEs': ['Bob Dylan', 'Frida Kahlo'],
            'recommendedProfessions': ['Artist', 'Designer', 'Craftsperson'],
            'recommendedProfessionsEs': ['Artista', 'Diseñador', 'Artesano'],
            'advice': 'Express your unique perspective through creative and aesthetic pursuits.',
            'adviceEs': 'Expresa tu perspectiva única a través de actividades creativas y estéticas.',
            'recommendedActivities': ['Creating art', 'Exploring nature'],
            'recommendedActivitiesEs': ['Crear arte', 'Explorar la naturaleza']
        },
        'ESTP': {
            'name': 'Entrepreneur',
            'nameEs': 'Emprendedor',
            'group': 'Explorers',
            'groupEs': 'Exploradores',
            'skills': ['Risk-taking', 'Persuasion', 'Adaptability'],
            'skillsEs': ['Toma de riesgos', 'Persuasión', 'Adaptabilidad'],
            'interests': ['Action', 'Adventure', 'Competition'],
            'interestsEs': ['Acción', 'Aventura', 'Competición'],
            'similarPersonalities': ['Ernest Hemingway', 'Madonna'],
            'similarPersonalitiesEs': ['Ernest Hemingway', 'Madonna'],
            'recommendedProfessions': ['Entrepreneur', 'Sales', 'Athlete'],
            'recommendedProfessionsEs': ['Emprendedor', 'Ventas', 'Atleta'],
            'advice': 'Use your energy and adaptability to seize opportunities as they arise.',
            'adviceEs': 'Utiliza tu energía y adaptabilidad para aprovechar las oportunidades a medida que surjan.',
            'recommendedActivities': ['Sports', 'Business ventures'],
            'recommendedActivitiesEs': ['Deportes', 'Emprendimientos']
        },
        'ESFP': {
            'name': 'Entertainer',
            'nameEs': 'Animador',
            'group': 'Explorers',
            'groupEs': 'Exploradores',
            'skills': ['Performance', 'Social enthusiasm', 'Adaptability'],
            'skillsEs': ['Actuación', 'Entusiasmo social', 'Adaptabilidad'],
            'interests': ['Entertainment', 'Social interaction', 'Adventure'],
            'interestsEs': ['Entretenimiento', 'Interacción social', 'Aventura'],
            'similarPersonalities': ['Marilyn Monroe', 'Elvis Presley'],
            'similarPersonalitiesEs': ['Marilyn Monroe', 'Elvis Presley'],
            'recommendedProfessions': ['Performer', 'Event planner', 'Sales'],
            'recommendedProfessionsEs': ['Artista', 'Planificador de eventos', 'Ventas'],
            'advice': 'Use your natural enthusiasm to bring joy and energy to others.',
            'adviceEs': 'Utiliza tu entusiasmo natural para llevar alegría y energía a los demás.',
            'recommendedActivities': ['Performing', 'Social events'],
            'recommendedActivitiesEs': ['Actuar', 'Eventos sociales']
        }
    }

    # IKIGAI Areas and Profiles updated to match frontend naming conventions
    IKIGAI_PROFILES = {
        'passion': {
            'skills': ['Creativity', 'Motivation', 'Enthusiasm'],
            'skillsEs': ['Creatividad', 'Motivación', 'Entusiasmo'],
            'interests': ['Art', 'Innovation', 'Self-expression'],
            'interestsEs': ['Arte', 'Innovación', 'Expresión personal'],
            'recommendedProfessions': ['Artist', 'Entrepreneur', 'Instructor'],
            'recommendedProfessionsEs': ['Artista', 'Emprendedor', 'Instructor'],
            'advice': 'Follow what you are passionate about and what makes you lose track of time.',
            'adviceEs': 'Sigue aquello que te apasiona y te hace perder la noción del tiempo.',
            'recommendedActivities': ['Creative activities', 'Sharing your passion with others'],
            'recommendedActivitiesEs': ['Actividades creativas', 'Compartir tu pasión con otros']
        },
        'mission': {
            'skills': ['Empathy', 'Service', 'Communication'],
            'skillsEs': ['Empatía', 'Servicio', 'Comunicación'],
            'interests': ['Volunteering', 'Education', 'Social impact'],
            'interestsEs': ['Voluntariado', 'Educación', 'Impacto social'],
            'recommendedProfessions': ['Teacher', 'Social worker', 'Coach'],
            'recommendedProfessionsEs': ['Docente', 'Trabajador social', 'Coach'],
            'advice': 'Look for how your work can positively impact the world.',
            'adviceEs': 'Busca cómo tu trabajo puede impactar positivamente en el mundo.',
            'recommendedActivities': ['Volunteering', 'Mentoring'],
            'recommendedActivitiesEs': ['Voluntariado', 'Mentoría']
        },
        'vocation': {
            'skills': ['Leadership', 'Communication', 'Organization'],
            'skillsEs': ['Liderazgo', 'Comunicación', 'Organización'],
            'interests': ['Business', 'Management', 'Professional development'],
            'interestsEs': ['Negocios', 'Gestión', 'Desarrollo profesional'],
            'recommendedProfessions': ['Manager', 'Consultant', 'Director'],
            'recommendedProfessionsEs': ['Gerente', 'Consultor', 'Director'],
            'advice': 'Use your talents to create value and opportunities.',
            'adviceEs': 'Aprovecha tus talentos para crear valor y oportunidades.',
            'recommendedActivities': ['Networking', 'Skill development'],
            'recommendedActivitiesEs': ['Networking', 'Desarrollo de habilidades']
        },
        'profession': {
            'skills': ['Specialization', 'Discipline', 'Methodology'],
            'skillsEs': ['Especialización', 'Disciplina', 'Metodología'],
            'interests': ['Science', 'Technology', 'Research'],
            'interestsEs': ['Ciencia', 'Tecnología', 'Investigación'],
            'recommendedProfessions': ['Engineer', 'Researcher', 'Analyst'],
            'recommendedProfessionsEs': ['Ingeniero', 'Investigador', 'Analista'],
            'advice': 'Develop your expertise and seek professional excellence.',
            'adviceEs': 'Desarrolla tu experiencia y busca la excelencia profesional.',
            'recommendedActivities': ['Continuous learning', 'Research'],
            'recommendedActivitiesEs': ['Aprendizaje continuo', 'Investigación']
        }
    }

    def update_user_profile(user_id, user_profile):
        """
        Update user profile or create it if it doesn't exist
        """
        profile = profiles_collection.find_one_and_update(
            {'user_id': ObjectId(user_id)},
            {'$set': user_profile},
            upsert=True,  # This creates a new document if no match is found
            return_document=ReturnDocument.AFTER  # Return the updated document
        )
        
        return profile
        

    # Cargar los datos de perfiles de personalidad desde un archivo JSON
    @staticmethod
    def load_personality_types():
        """Load MBTI personality types from configuration file"""
        try:
            # Structure based on frontend format
            return {
                # Analysts
                'INTJ': { 'name': 'Architect', 'nameEs': 'Arquitecto', 'group': 'Analysts', 'groupEs': 'Analistas' },
                'INTP': { 'name': 'Logician', 'nameEs': 'Lógico', 'group': 'Analysts', 'groupEs': 'Analistas' },
                'ENTJ': { 'name': 'Commander', 'nameEs': 'Comandante', 'group': 'Analysts', 'groupEs': 'Analistas' },
                'ENTP': { 'name': 'Debater', 'nameEs': 'Polemista', 'group': 'Analysts', 'groupEs': 'Analistas' },
                
                # Diplomats
                'INFJ': { 'name': 'Advocate', 'nameEs': 'Defensor', 'group': 'Diplomats', 'groupEs': 'Diplomáticos' },
                'INFP': { 'name': 'Mediator', 'nameEs': 'Mediador', 'group': 'Diplomats', 'groupEs': 'Diplomáticos' },
                'ENFJ': { 'name': 'Protagonist', 'nameEs': 'Protagonista', 'group': 'Diplomats', 'groupEs': 'Diplomáticos' },
                'ENFP': { 'name': 'Campaigner', 'nameEs': 'Activista', 'group': 'Diplomats', 'groupEs': 'Diplomáticos' },
                
                # Sentinels
                'ISTJ': { 'name': 'Logistician', 'nameEs': 'Logista', 'group': 'Sentinels', 'groupEs': 'Centinelas' },
                'ISFJ': { 'name': 'Defender', 'nameEs': 'Defensor', 'group': 'Sentinels', 'groupEs': 'Centinelas' },
                'ESTJ': { 'name': 'Executive', 'nameEs': 'Ejecutivo', 'group': 'Sentinels', 'groupEs': 'Centinelas' },
                'ESFJ': { 'name': 'Consul', 'nameEs': 'Cónsul', 'group': 'Sentinels', 'groupEs': 'Centinelas' },
                
                # Explorers
                'ISTP': { 'name': 'Virtuoso', 'nameEs': 'Virtuoso', 'group': 'Explorers', 'groupEs': 'Exploradores' },
                'ISFP': { 'name': 'Adventurer', 'nameEs': 'Aventurero', 'group': 'Explorers', 'groupEs': 'Exploradores' },
                'ESTP': { 'name': 'Entrepreneur', 'nameEs': 'Emprendedor', 'group': 'Explorers', 'groupEs': 'Exploradores' },
                'ESFP': { 'name': 'Entertainer', 'nameEs': 'Animador', 'group': 'Explorers', 'groupEs': 'Exploradores' },
            }
        except Exception as e:
            logger.error(f"Error loading personality types: {e}")
            return {}
    
    # Cargar los perfiles predefinidos (compatibles con el frontend)
    def load_profile_types():
            """Load predefined profile types"""
            try:
                return [
                    {
                        "profileType": "Innovative Trailblazer",
                        "profileTypeEs": "Pionero Innovador",
                        "mbtiType": "ENTP",
                        "mbtiGroup": "Analysts",
                        "mbtiGroupEs": "Analistas",
                        "skills": [
                            "Creative problem-solving",
                            "Design thinking",
                            "Innovation mindset",
                            "Conceptual thinking",
                            "Pattern recognition"
                        ],
                        "skillsEs": [
                            "Resolución creativa de problemas",
                            "Pensamiento de diseño",
                            "Mentalidad innovadora",
                            "Pensamiento conceptual",
                            "Reconocimiento de patrones"
                        ],
                        "interests": [
                            "Designing new solutions",
                            "Challenging conventional thinking",
                            "Exploring emerging technologies",
                            "Connecting seemingly unrelated ideas",
                            "Creating original content"
                        ],
                        "interestsEs": [
                            "Diseñar nuevas soluciones",
                            "Desafiar el pensamiento convencional",
                            "Explorar tecnologías emergentes",
                            "Conectar ideas aparentemente no relacionadas",
                            "Crear contenido original"
                        ],
                        "similarPersonalities": [
                            "Leonardo da Vinci",
                            "Steve Jobs",
                            "Marie Curie",
                            "Elon Musk",
                            "Frida Kahlo"
                        ],
                        "similarPersonalitiesEs": [
                            "Leonardo da Vinci",
                            "Steve Jobs",
                            "Marie Curie",
                            "Elon Musk",
                            "Frida Kahlo"
                        ],
                        "recommendedProfessions": [
                            "Product Designer",
                            "Entrepreneur",
                            "Creative Director",
                            "R&D Specialist",
                            "Innovation Consultant"
                        ],
                        "recommendedProfessionsEs": [
                            "Diseñador de Productos",
                            "Emprendedor",
                            "Director Creativo",
                            "Especialista en I+D",
                            "Consultor de Innovación"
                        ],
                        "advice": "Your natural ability to see possibilities where others see obstacles is your superpower. Focus on environments that value creativity and innovation.",
                        "adviceEs": "Tu capacidad natural para ver posibilidades donde otros ven obstáculos es tu superpoder. Céntrate en entornos que valoren la creatividad y la innovación.",
                        "recommendedActivities": [
                            "Brainstorming sessions",
                            "Design thinking workshops",
                            "Innovation challenges",
                            "Creative collaborations",
                            "Prototyping and testing new ideas"
                        ],
                        "recommendedActivitiesEs": [
                            "Sesiones de lluvia de ideas",
                            "Talleres de pensamiento de diseño",
                            "Desafíos de innovación",
                            "Colaboraciones creativas",
                            "Creación de prototipos y prueba de nuevas ideas"
                        ]
                    },
                    {
                        "profileType": "Analytical Problem-Solver",
                        "profileTypeEs": "Solucionador Analítico de Problemas",
                        "mbtiType": "INTJ",
                        "mbtiGroup": "Analysts",
                        "mbtiGroupEs": "Analistas",
                        "skills": [
                            "Logical reasoning",
                            "Data analysis",
                            "Critical thinking",
                            "System optimization",
                            "Strategic planning"
                        ],
                        "skillsEs": [
                            "Razonamiento lógico",
                            "Análisis de datos",
                            "Pensamiento crítico",
                            "Optimización de sistemas",
                            "Planificación estratégica"
                        ],
                        "interests": [
                            "Solving complex problems",
                            "Finding patterns in data",
                            "Optimizing systems and processes",
                            "Understanding how things work",
                            "Developing effective strategies"
                        ],
                        "interestsEs": [
                            "Resolver problemas complejos",
                            "Encontrar patrones en los datos",
                            "Optimizar sistemas y procesos",
                            "Entender cómo funcionan las cosas",
                            "Desarrollar estrategias efectivas"
                        ],
                        "similarPersonalities": [
                            "Alan Turing",
                            "Albert Einstein",
                            "Ada Lovelace",
                            "Sherlock Holmes",
                            "Katherine Johnson"
                        ],
                        "similarPersonalitiesEs": [
                            "Alan Turing",
                            "Albert Einstein",
                            "Ada Lovelace",
                            "Sherlock Holmes",
                            "Katherine Johnson"
                        ],
                        "recommendedProfessions": [
                            "Data Scientist",
                            "Systems Analyst",
                            "Research Scientist",
                            "Strategy Consultant",
                            "Software Engineer"
                        ],
                        "recommendedProfessionsEs": [
                            "Científico de Datos",
                            "Analista de Sistemas",
                            "Investigador Científico",
                            "Consultor de Estrategia",
                            "Ingeniero de Software"
                        ],
                        "advice": "Your analytical mind excels at finding solutions to complex problems. Look for roles that challenge you intellectually and allow you to dig deep into analysis.",
                        "adviceEs": "Tu mente analítica sobresale en encontrar soluciones a problemas complejos. Busca roles que te desafíen intelectualmente y te permitan profundizar en el análisis.",
                        "recommendedActivities": [
                            "Data analysis projects",
                            "Logic puzzles and games",
                            "Research and investigation",
                            "System design and optimization",
                            "Strategic problem-solving workshops"
                        ],
                        "recommendedActivitiesEs": [
                            "Proyectos de análisis de datos",
                            "Rompecabezas lógicos y juegos",
                            "Investigación e indagación",
                            "Diseño y optimización de sistemas",
                            "Talleres de resolución estratégica de problemas"
                        ]
                    },
                    # Additional profiles would be included here...
                    {
                        "profileType": "Compassionate Guide",
                        "profileTypeEs": "Guía Compasivo",
                        "mbtiType": "ENFJ",
                        "mbtiGroup": "Diplomats",
                        "mbtiGroupEs": "Diplomáticos",
                        "skills": [
                            "Empathetic listening",
                            "Emotional intelligence",
                            "Supportive communication",
                            "Community building",
                            "Conflict resolution"
                        ],
                        "skillsEs": [
                            "Escucha empática",
                            "Inteligencia emocional",
                            "Comunicación de apoyo",
                            "Construcción de comunidad",
                            "Resolución de conflictos"
                        ],
                        "interests": [
                            "Supporting others' growth",
                            "Building meaningful connections",
                            "Understanding human behavior",
                            "Creating inclusive environments",
                            "Promoting emotional well-being"
                        ],
                        "interestsEs": [
                            "Apoyar el crecimiento de otros",
                            "Construir conexiones significativas",
                            "Entender el comportamiento humano",
                            "Crear entornos inclusivos",
                            "Promover el bienestar emocional"
                        ],
                        "similarPersonalities": [
                            "Mahatma Gandhi",
                            "Mother Teresa",
                            "Carl Rogers",
                            "Malala Yousafzai",
                            "Martin Luther King Jr."
                        ],
                        "similarPersonalitiesEs": [
                            "Mahatma Gandhi",
                            "Madre Teresa",
                            "Carl Rogers",
                            "Malala Yousafzai",
                            "Martin Luther King Jr."
                        ],
                        "recommendedProfessions": [
                            "Counselor or Therapist",
                            "Social Worker",
                            "Community Organizer",
                            "Human Resources Specialist",
                            "Teacher or Mentor"
                        ],
                        "recommendedProfessionsEs": [
                            "Consejero o Terapeuta",
                            "Trabajador Social",
                            "Organizador Comunitario",
                            "Especialista en Recursos Humanos",
                            "Profesor o Mentor"
                        ],
                        "advice": "Your natural ability to connect with others and create supportive environments is increasingly valuable in our complex world.",
                        "adviceEs": "Tu capacidad natural para conectar con otros y crear entornos de apoyo es cada vez más valiosa en nuestro mundo complejo.",
                        "recommendedActivities": [
                            "Peer support programs",
                            "Community service projects",
                            "Emotional intelligence workshops",
                            "Conflict resolution training",
                            "Mentoring relationships"
                        ],
                        "recommendedActivitiesEs": [
                            "Programas de apoyo entre pares",
                            "Proyectos de servicio comunitario",
                            "Talleres de inteligencia emocional",
                            "Formación en resolución de conflictos",
                            "Relaciones de mentoría"
                        ]
                    },
                ]
            except Exception as e:
                logger.error(f"Error loading profile types: {e}")
                return []
    
    # Función para determinar el tipo de perfil basado en los traits
    def determine_profile_from_traits(traits: Dict[str, int]) -> str:
        """
        Determines the profile type based on accumulated traits
        """
        # Define profiles and their associated traits
        profile_trait_mapping = {
            "Innovative Trailblazer": ["creative", "innovative", "unconventional", "imaginative", "adaptability"],
            "Analytical Problem-Solver": ["analytical", "logical", "structured", "methodical", "problem_solving"],
            "Compassionate Guide": ["empathetic", "supportive", "caring", "communicative", "facilitator"],
            "Strategic Organizer": ["organized", "structured", "planning", "efficient", "reliable"],
            "Inspiring Communicator": ["expressive", "communicative", "persuasive", "inspiring", "connecting"],
            "Creative Explorer": ["artistic", "sensory", "creative", "experimental", "autonomous"],
            "Practical Supporter": ["reliable", "collaborative", "practical", "dedicated", "realistic"]
        }
        
        # Calculate score for each profile
        profile_scores = {}
        for profile, related_traits in profile_trait_mapping.items():
            score = sum(traits.get(trait, 0) for trait in related_traits)
            profile_scores[profile] = score
        
        # Return the profile with the highest score
        if not profile_scores:
            return "Innovative Trailblazer"  # Default profile
        
        return max(profile_scores.items(), key=lambda x: x[1])[0]

    def process_responses_with_option_values(answers: Dict[str, Any], questions_map: Dict[str, Dict], language: str = "EN") -> Dict[str, Any]:
        """
        Processes responses using the specific values of each selected option
        Updated to match frontend structure
        """
        # Initialize counters
        traits = {}
        mbti_scores = {d: 0 for d in ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']}
        ikigai_scores = {a: 0 for a in ['passion', 'mission', 'vocation', 'profession']}
        
        # Determine which set of option values to use based on language
        option_values_field = "optionValuesEs" if language.upper() == "ES" else "optionValues"
        
        for question_id, value in answers.items():
            if question_id not in questions_map:
                continue
                
            question = questions_map[question_id]
            
            # Process based on question type
            if question.get('type') in ['multiple-select', 'multiple-choice']:
                # Get values for selected options
                options = value if isinstance(value, list) else [value]
                
                # Determine the indices of selected options
                option_values = question.get(option_values_field, [])
                option_list = question.get('options' if language.upper() != "ES" else 'optionsEs', [])
                
                # For each selected option
                for selected_option in options:
                    # Find option index
                    try:
                        if isinstance(selected_option, int):
                            # If it's already an index
                            index = selected_option
                        else:
                            # If it's a value
                            index = option_list.index(selected_option)
                            
                        # Add trait values if there's a valueMap for this option
                        if index < len(option_values) and option_values[index]:
                            option_traits = option_values[index]
                            
                            # Accumulate each trait
                            for trait, value in option_traits.items():
                                if trait == 'mbti_dimension' and value in mbti_scores:
                                    mbti_scores[value] += 1
                                elif trait == 'ikigai_area' and value in ikigai_scores:
                                    ikigai_scores[value] += 1
                                elif trait not in ['mbti_dimension', 'ikigai_area']:
                                    traits[trait] = traits.get(trait, 0) + value
                    except (ValueError, TypeError) as e:
                        logger.warning(f"Error processing option {selected_option} for question {question_id}: {e}")
            
            elif question.get('type') == 'scale':
                # Get the scale value
                scale_value = value if isinstance(value, (int, float)) else 3
                
                # Find the relevant scale range
                itemScaleValues = question.get('itemScaleValues', [])
                if itemScaleValues and len(itemScaleValues) > 0:
                    # Frontend format uses arrays for items
                    item_index = 0  # Default to first item if not specified
                    
                    # Find matching range in the item's scale values
                    item_scales = itemScaleValues[item_index] if item_index < len(itemScaleValues) else []
                    matched_range = None
                    
                    for range_data in item_scales:
                        if range_data.get('min', 1) <= scale_value <= range_data.get('max', 5):
                            matched_range = range_data
                            break
                    
                    # If found a range, process its traits
                    if matched_range:
                        for trait, value in matched_range.items():
                            if trait == 'mbti_dimension' and value in mbti_scores:
                                mbti_scores[value] += 1
                            elif trait == 'ikigai_area' and value in ikigai_scores:
                                ikigai_scores[value] += 1
                            elif trait not in ['min', 'max', 'mbti_dimension', 'ikigai_area']:
                                traits[trait] = traits.get(trait, 0) + value
                else:
                    # For backward compatibility, check for scaleValues
                    scale_values = question.get('scaleValues', [])
                    matched_range = None
                    
                    for range_data in scale_values:
                        if range_data.get('min', 1) <= scale_value <= range_data.get('max', 5):
                            matched_range = range_data
                            break
                    
                    # If found a range, process its traits
                    if matched_range:
                        for trait, value in matched_range.items():
                            if trait == 'mbti_dimension' and value in mbti_scores:
                                mbti_scores[value] += 1
                            elif trait == 'ikigai_area' and value in ikigai_scores:
                                ikigai_scores[value] += 1
                            elif trait not in ['min', 'max', 'mbti_dimension', 'ikigai_area']:
                                traits[trait] = traits.get(trait, 0) + value
            
            elif question.get('type') == 'open':
                # Analyze open response using keywords
                text = str(value).lower() if value else ""
                
                if text:
                    # Use keyword analysis based on language
                    keyword_field = "keywordAnalysisEs" if language.upper() == "ES" else "keywordAnalysis"
                    keywords = question.get(keyword_field, {})
                    
                    # For each keyword category
                    keywords_found = False
                    for trait, words in keywords.items():
                        matches = sum(1 for word in words if word in text)
                        if matches > 0:
                            keywords_found = True
                            traits[trait] = traits.get(trait, 0) + matches
                    
                    # If no keywords found, use base traits
                    if not keywords_found and question.get('baseTraits'):
                        for trait, value in question.get('baseTraits', {}).items():
                            traits[trait] = traits.get(trait, 0) + value
                    
                    # MBTI dimension and Ikigai base area
                    mbti_dim = question.get('mbti_dimension')
                    if mbti_dim and mbti_dim in mbti_scores:
                        mbti_scores[mbti_dim] += 1
                    
                    ikigai_area = question.get('ikigai_area')
                    if ikigai_area and ikigai_area in ikigai_scores:
                        ikigai_scores[ikigai_area] += 1
        
        # Determine MBTI type based on scores
        mbti_type = ProfileService.determine_mbti_type(mbti_scores)
        
        # Determine predominant Ikigai area
        ikigai_area = max(ikigai_scores.items(), key=lambda x: x[1])[0] if ikigai_scores else "passion"
        
        # Determine profile type
        profile_type = ProfileService.determine_profile_from_traits(traits)
        
        return {
            "traits": traits,
            "mbti_type": mbti_type,
            "ikigai_area": ikigai_area,
            "profile_type": profile_type,
            "mbti_scores": mbti_scores,
            "ikigai_scores": ikigai_scores
        }

    @staticmethod
    def determine_mbti_type(scores: Dict[str, int]) -> str:
        """Determinar tipo MBTI a partir de puntuaciones de dimensiones"""
        mbti_type = ''
        mbti_type += 'E' if scores['E'] >= scores['I'] else 'I'
        mbti_type += 'S' if scores['S'] >= scores['N'] else 'N'
        mbti_type += 'T' if scores['T'] >= scores['F'] else 'F'
        mbti_type += 'J' if scores['J'] >= scores['P'] else 'P'
        return mbti_type

    # Función para procesar las respuestas del test Ikigai
    def process_ikigai_responses(answers: Dict[str, Any], questions_map: Dict[str, Any]) -> Dict[str, Any]:
        """
        Procesa las respuestas de un test Ikigai y calcula los traits
        """
        # Inicializar contador de traits
        traits = {}
        
        # Procesar cada respuesta
        for question_id, answer_value in answers.items():
            if question_id not in questions_map:
                continue
                
            question = questions_map[question_id]
            question_traits = question.get('traits', {})
            
            if question.get('tipo') == 'multiple' or question.get('type') == 'multiple-choice':
                # Si es una selección múltiple, procesar cada opción seleccionada
                if isinstance(answer_value, list):
                    for option_index in answer_value:
                        for trait, value in question_traits.items():
                            current_value = traits.get(trait, 0)
                            traits[trait] = current_value + value
                else:
                    # Si es una selección única
                    for trait, value in question_traits.items():
                        current_value = traits.get(trait, 0)
                        traits[trait] = current_value + value
                        
            elif question.get('tipo') == 'escala' or question.get('type') == 'scale':
                # Si es una escala, el valor es directo
                if isinstance(answer_value, (int, float)):
                    for trait, value in question_traits.items():
                        current_value = traits.get(trait, 0)
                        traits[trait] = current_value + (value * answer_value / 5)  # Normalizar por 5 (máx escala)
                        
            elif question.get('tipo') == 'abierta' or question.get('type') == 'open':
                # Para preguntas abiertas, sólo sumamos los traits si hay una respuesta
                if answer_value and len(str(answer_value).strip()) > 0:
                    for trait, value in question_traits.items():
                        current_value = traits.get(trait, 0)
                        traits[trait] = current_value + value
        
        # Determinar el área Ikigai predominante basado en los traits
        ikigai_scores = {
            "passion": sum(traits.get(t, 0) for t in ["creativo", "pasion", "motivacion", "inspiracion"]),
            "mission": sum(traits.get(t, 0) for t in ["empatico", "servicio", "impacto", "proposito"]),
            "vocation": sum(traits.get(t, 0) for t in ["talento", "habilidad", "profesional", "eficacia"]),
            "profession": sum(traits.get(t, 0) for t in ["remuneracion", "productividad", "expertise", "demanda"])
        }
        
        dominant_area = max(ikigai_scores.items(), key=lambda x: x[1])[0]
        
        # Determinar el perfil basado en los traits
        profile_type = ProfileService.determine_profile_from_traits(traits)
        
        return {
            "traits": traits,
            "ikigai_area": dominant_area,
            "profile_type": profile_type
        }

    # Función para calcular el tipo MBTI a partir de las respuestas
    def calculate_mbti_type(answers: Dict[str, Any], questions_map: Dict[str, Any]) -> str:
        """Calcular tipo MBTI basado en respuestas a preguntas"""
        # Inicializar contadores para cada dimensión MBTI
        dimensions = {
            'E': 0, 'I': 0,  # Extroversión vs. Introversión
            'S': 0, 'N': 0,  # Sensorial vs. Intuitivo
            'T': 0, 'F': 0,  # Pensamiento vs. Sentimiento
            'J': 0, 'P': 0   # Juicio vs. Percepción
        }
        
        # Procesar cada respuesta
        for question_id, answer_value in answers.items():
            if question_id not in questions_map:
                continue
                
            question = questions_map[question_id]
            mbti_dimension = question.get('mbti_dimension')
            
            if not mbti_dimension or mbti_dimension not in dimensions:
                continue
                
            # Dependiendo del tipo de respuesta, añadir a la dimensión correspondiente
            if isinstance(answer_value, (int, float)):
                if answer_value > 3:  # En escala de 1-5, puntuaciones > 3 cuentan para la dimensión
                    dimensions[mbti_dimension] += 1
            elif isinstance(answer_value, str):
                if answer_value.lower() in ['yes', 'true', 'agree']:
                    dimensions[mbti_dimension] += 1
            elif isinstance(answer_value, list) and len(answer_value) > 0:
                dimensions[mbti_dimension] += 1
        
        # Determinar el tipo MBTI basado en las puntuaciones
        mbti_type = ''
        mbti_type += 'E' if dimensions['E'] >= dimensions['I'] else 'I'
        mbti_type += 'S' if dimensions['S'] >= dimensions['N'] else 'N'
        mbti_type += 'T' if dimensions['T'] >= dimensions['F'] else 'F'
        mbti_type += 'J' if dimensions['J'] >= dimensions['P'] else 'P'
        
        return mbti_type

    # Generar un perfil basado en tipo MBTI y área Ikigai
    def generate_profile(mbti_type: str, ikigai_area: str) -> Dict[str, Any]:
        """
        Genera un perfil completo basado en el tipo MBTI y el área Ikigai
        """
        # Cargar tipos de personalidad y perfiles predefinidos
        personality_types = ProfileService.load_personality_types()
        profile_types = ProfileService.load_profile_types()
        
        # Verificar si el tipo MBTI existe
        if mbti_type not in personality_types:
            mbti_type = random.choice(list(personality_types.keys()))
        
        # Obtener información básica del tipo MBTI
        mbti_info = personality_types[mbti_type]
        
        # Buscar un perfil predefinido basado en MBTI o seleccionar uno aleatorio
        matching_profiles = [p for p in profile_types if p.get('mbtiType') == mbti_type]
        if not matching_profiles:
            profile = random.choice(profile_types)
        else:
            profile = matching_profiles[0]
        
        # Construir la respuesta final
        result = {
            "profileType": profile.get("profileType", mbti_info.get("name", "")),
            "profileTypeEs": profile.get("profileTypeEs", mbti_info.get("nameEs", "")),
            "mbtiType": mbti_type,
            "mbtiGroup": mbti_info.get("group", ""),
            "mbtiGroupEs": mbti_info.get("groupEs", ""),
            "skills": profile.get("skills", []),
            "skillsEs": profile.get("skillsEs", []),
            "interests": profile.get("interests", []),
            "interestsEs": profile.get("interestsEs", []),
            "similiarPersonalities": profile.get("similarPersonalities", []),
            "similarPersonalitiesEs": profile.get("similarPersonalitiesEs", []),
            "recommendedProfessions": profile.get("recommendedProfessions", []),
            "recommendedProfessionsEs": profile.get("recommendedProfessionsEs", []),
            "advice": profile.get("advice", ""),
            "adviceEs": profile.get("adviceEs", ""),
            "recommendedActivities": profile.get("recommendedActivities", []),
            "recommendedActivitiesEs": profile.get("recommendedActivitiesEs", []),
            "ikigai_area": ikigai_area
        }
        
        return result