# METODOLOGÍA DE ANÁLISIS DE PERSONALIDAD Y RECOMENDACIONES
Basado en el famoso proceso japonés Ikigai y el famoso test de personalidad "16 Personalities", se propone optimizar de forma concisa la identificación de la personalidad sin incurrir en el encasillamiento de la misma.
El objetivo de esta metodología es ayudar a la persona a encontrar su camino proponiendo una serie de actividades con las que pueda encontrar realmente su objetivo de vida.

## Cómo funciona la metodología
Se han creado una serie de preguntas abiertas, de selección múltiple, selección única o puntuadas en un baremo.
Las respuestas de estas preguntas tienen asociada una puntuación con la cual se intenta asignar al individuo una personalidad en base a gustos, capacidad cognitiva, inteligencia emocional, lógica, cálculo y tendencias. 

Aunque de manera inicial las preguntas no tienen ese enfoque, el objetivo de este proyecto es reconducirlo hasta permitir asociar lo más precisamente posible la personalidad del individuo y recomendar actividades con las que él mismo pueda identificar su propósito de vida. 

### Funcionamiento lógico
Se han registrado numerosas personalidades, habilidades, intereses y actividades recomendadas con una puntuación asignada siguiendo un patrón. Por ejemplo: una actividad lógica cómo es el ajedrez o la programación va más asociada a conductas lógicas del individuo cuya tendencia suele ser la inteligencia sobre lo superficial, teniendo una asignación más analítica, creativa, ordenada, paciente, lógoca y enfocada en la resolución de problemas. 

## Cómo funciona la aplicación
El individuo realiza un test respondiendo, lo más certeramente posible, a las preguntas planteadas.
A veces el problema del individuo es que ni él mismo sabe la respuesta, por lo que trataremos de ir afinando el perfil del mismo.

El test se compone de dos tipos, principalmente:
- Test rápido, de unas 20 preguntas aleatorias organizadas en 4 bloques diferentes.
- Test completo, de unas 90 preguntas aleatorias organizadas en 6 bloques diferentes.

Mientras más test realice el indivio, el perfil irá afinando más según las respuestas obtenidas. 
Las preguntas no podrán repetirse, pero si algunas respuestas en preguntas similares (pero no del todo iguales).

A medida que el proyecto avance, estas preguntas irán siendo completadas por expertos o interesados en la psicología y otros campos de estudio relativos a este. 

## Explicar parte técnica de la aplicación

Relación en el procesamiento del test

├── Routes (API Endpoints)
│   └── PersonalitySystem (Main Service)
│       ├── TestService (Test Management)
│       │   └── TestProcessor (Response Processing)
│       └── Sessions (Session Management)
│           └── TestService (Reference)
├── Models (Data Structures)
└── Database (MongoDB Collections)

### Creación de test:


Tracing the execution:

1.- The request hits the /v1/tests/sessions/{session_id}/complete endpoint.

2.- This endpoint calls the complete_test_session function (likely in api/services/test.py).

3.- Inside complete_test_session, a TestService instance is created, and its process_test_responses method is called with user_data and test_responses.

4.- The TestService.process_test_responses method creates a TestProcessor instance and calls its process_responses method.

5.- The TestProcessor.__init__ method calls DataRepository methods (load_traits, load_question_blocks, load_celebrities, load_activities, load_professions, load_skills, load_interests, load_advices) to load data from the database into instance variables (self.traits, self.question_blocks, etc.).

6.- TestProcessor.process_responses then calculates trait_scores using _calculate_trait_scores, which iterates through the test_responses and uses the loaded question_blocks and traits data to update scores.

7.- After calculating trait_scores, it calculates mbti_scores, mbti_type, and ikigai_scores.

8.- Finally, it calls _generate_recommendations, which in turn calls individual methods like _recommend_activities, _recommend_professions, etc., using the calculated scores and the data loaded in __init__.