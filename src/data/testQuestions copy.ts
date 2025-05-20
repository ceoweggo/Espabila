import { QuestionBlock } from "@/types";

export const quickTestBlocks: QuestionBlock[] = [
  {
    id: "mindscape",
    title: "Mindscape Explorers",
    titleEs: "Explorando el subconsciente",
    description: "Discover how you process information and make decisions",
    descriptionEs: "Descubre cómo procesas información y tomas decisiones",
    questions: [
      {
        id: "mindscape_1",
        text: "What activities do you enjoy so much that you feel that time flies?",
        textEs: "¿Con qué actividades disfrutas tanto que sientes que el tiempo vuela?",
        type: "multiple-select",
        maxOptions: 3,
        options: [
          "Drawing, imagining or conceptualizing (creating new things)",
          "Making presentations in front of an audience, telling stories, speaking aloud...",
          "Solving puzzles, challenges or problems; Trying to understand how things work",
          "Listening to and helping or supporting other people",
          "Moving outdoors, playing sports, feeling nature...",
          "Doing research, trying to learn and understand new things",
          "To be calm with yourself, to think, observe and reflect, to be alone",
          "Organizing and ordering things. Planning tasks or organizing plans and activities."
        ],
        optionsEs: [
          "Dibujar, imaginar o conceptualizar (crear cosas nuevas)",
          "Realizar exposiciones ante un público, contar historias, hablar en voz alta..",
          "Resolver acertijos, retos o problemas; Intentar entender cómo funcionan las cosas",
          "Escuchar y ayudar o apoyar a otras personas",
          "Moverte al aire libre, hacer deporte, sentir la naturaleza...",
          "Investigar, intentar aprender y comprender cosas nuevas",
          "Conetar en calma contigo mismo, pensar, observar y reflexionar estar a solas",
          "Organizar y ordenar cosas. Planificar tareas u organizar planes y actividades"
        ],
        optionValues: [
          { creative: 5, artistic: 4, imaginative: 3, mbti_dimension: 'N', ikigai_area: 'passion' },
          { expressive: 5, communicative: 4, extroverted: 3, mbti_dimension: 'E', ikigai_area: 'mission' },
          { analytical: 5, logical: 4, problem_solving: 3, mbti_dimension: 'T', ikigai_area: 'profession' },
          { empathetic: 5, supportive: 4, caring: 3, mbti_dimension: 'F', ikigai_area: 'mission' },
          { physical: 5, active: 4, nature_oriented: 3, mbti_dimension: 'S', ikigai_area: 'passion' },
          { curious: 5, intellectual: 4, learning_oriented: 3, mbti_dimension: 'N', ikigai_area: 'profession' },
          { reflective: 5, introspective: 4, calm: 3, mbti_dimension: 'I', ikigai_area: 'vocation' },
          { organized: 5, structured: 4, planning: 3, mbti_dimension: 'J', ikigai_area: 'profession' }
        ]
      },
      {
        id: "mindscape_2",
        text: "Think about what you are doing when you are having a good time, What is it?",
        textEs: "Piensa en lo que estas haciendo cuando te lo estás pasando bien. ¿Qué es?",
        type: "multiple-select",
        maxOptions: 3,
        options: [
          "Chatting with someone I'm having a good time with.",
          "Reading, listening to music, watching a movie",
          "Being quietly thinking; Being alone.",
          "Creating something of my own; Drawing or writing.",
          "Playing sports, walking outdoors or dancing.",
          "Learning new things that made me curious.",
          "Making plans, squaring things up or helping something can be organized",
          "Helping or supporting a friend, partner, or someone in need",
          "Laughing at jokes, telling jokes or funny stories, goofing around",
        ],
        optionsEs: [
          "Charlando con alguien con quien me lo paso bien",
          "Leyendo, escuchando música, viendo una película",
          "Estando tranquilamente pensando; Estando a solas",
          "Creando algo mío; Dibujando o escribiendo",
          "Haciendo deporte, paseando al aire libre o bailando",
          "Aprendiendo cosas nuevas que me daban curiosidad",
          "Haciendo planes, cuadrando cosas o ayudando a que algo pueda organizarse",
          "Ayudando o apoyando a algún amigo, compañero, o alguien que lo necesita",
          "Riéndome con las bromas, contando chistes o historias graciosas, haciendo el tonto"
        ],
        optionValues: [
          { creative: 5, artistic: 4, imaginative: 3, mbti_dimension: 'N', ikigai_area: 'passion' },
          { expressive: 5, communicative: 4, extroverted: 3, mbti_dimension: 'E', ikigai_area: 'mission' },
          { analytical: 5, logical: 4, problem_solving: 3, mbti_dimension: 'T', ikigai_area: 'profession' },
          { empathetic: 5, supportive: 4, caring: 3, mbti_dimension: 'F', ikigai_area: 'mission' },
          { physical: 5, active: 4, nature_oriented: 3, mbti_dimension: 'S', ikigai_area: 'passion' },
          { curious: 5, intellectual: 4, learning_oriented: 3, mbti_dimension: 'N', ikigai_area: 'profession' },
          { reflective: 5, introspective: 4, calm: 3, mbti_dimension: 'I', ikigai_area: 'vocation' },
          { organized: 5, structured: 4, planning: 3, mbti_dimension: 'J', ikigai_area: 'profession' }
        ]
      },
      {
        id: "mindscape_3",
        text: "Complete the phase: One of the things I would love to be able to do someday is to...",
        textEs: "Completa la fase: Una de las cosas que me encantaría poder hacer algún día es...",
        type: "open",
        minValue: 10,
        maxValue: 200,
        keywordAnalysis: {
          creative: ["unique", "innovative", "different", "creative", "new", "unusual", "original", "imagination", "artistic"],
          analytical: ["analyzed", "logical", "structured", "systematic", "method", "process", "details", "thorough", "rational"],
          collaborative: ["team", "together", "group", "colleagues", "others", "helped", "shared", "collective", "communicated"],
          intuitive: ["felt", "sensed", "intuition", "gut", "feeling", "instinct", "suddenly", "insight", "emotional"]
        },
        keywordAnalysisEs: {
          creative: ["única", "innovadora", "diferente", "creativa", "nueva", "inusual", "original", "imaginación", "artística"],
          analytical: ["analicé", "lógica", "estructurada", "sistemática", "método", "proceso", "detalles", "exhaustiva", "racional"],
          collaborative: ["equipo", "juntos", "grupo", "colegas", "otros", "ayudamos", "compartimos", "colectivo", "comunicamos"],
          intuitive: ["sentí", "percibí", "intuición", "instinto", "sensación", "presentimiento", "repentinamente", "insight", "emocional"]
        },
        baseTraits: {
          creative: 1,
          analytical: 1
        },
        mbti_dimension: 'N',
        ikigai_area: 'passion'
      },
      {
        id: "mindscape_4",
        text: "What do you remember that you loved to do when you were little?",
        textEs: "¿Qué recuerdas que te encantaba hacer cuando eras pequeño?",
        type: "open",
        minValue: 10,
        maxValue: 200,
        keywordAnalysis: {
          creative: ["unique", "innovative", "different", "creative", "new", "unusual", "original", "imagination", "artistic"],
          analytical: ["analyzed", "logical", "structured", "systematic", "method", "process", "details", "thorough", "rational"],
          collaborative: ["team", "together", "group", "colleagues", "others", "helped", "shared", "collective", "communicated"],
          intuitive: ["felt", "sensed", "intuition", "gut", "feeling", "instinct", "suddenly", "insight", "emotional"]
        },
        keywordAnalysisEs: {
          creative: ["única", "innovadora", "diferente", "creativa", "nueva", "inusual", "original", "imaginación", "artística"],
          analytical: ["analicé", "lógica", "estructurada", "sistemática", "método", "proceso", "detalles", "exhaustiva", "racional"],
          collaborative: ["equipo", "juntos", "grupo", "colegas", "otros", "ayudamos", "compartimos", "colectivo", "comunicamos"],
          intuitive: ["sentí", "percibí", "intuición", "instinto", "sensación", "presentimiento", "repentinamente", "insight", "emocional"]
        },
        baseTraits: {
          creative: 1,
          analytical: 1
        },
        mbti_dimension: 'N',
        ikigai_area: 'passion'
      },
      {
        id: "mindscape_5",
        text: "What things do you feel that move you inside?",
        textEs: "¿Qué cosas sientes que te mueven por dentro?",
        type: "multiple-select",
        maxOptions: 3,
        options: [
          "Chatting with someone I'm having a good time with.",
          "Reading, listening to music, watching a movie",
          "Being quietly thinking; Being alone.",
          "Creating something of my own; Drawing or writing.",
          "Playing sports, walking outdoors or dancing.",
          "Learning new things that made me curious.",
          "Making plans, squaring things up or helping something can be organized",
          "Helping or supporting a friend, partner, or someone in need",
          "Laughing at jokes, telling jokes or funny stories, goofing around",
        ],
        optionsEs: [
          "Imaginar e inventar algo nuevo",
          "Descubrir el por qué de las cosas y aprender por mi cuenta",
          "Expresar y comunicar mis ideas o lo que pienso y siento",
          "Mejorarme a mí mismo y lograr nuevos retos",
          "Sentir que puedo conectar con otras personas y ayudarlas",
          "Que el mundo sea más justo y que haya menos desigualdades",
          "Entender lo que pasa, pensar con más profundidad",
          "Reirme, disfrutar y pasarlo bien sin sentir presión",
          "Sentirme inspirado por historias, personas o ideas"
        ],
        optionValues: [
          { creative: 5, artistic: 4, imaginative: 3, mbti_dimension: 'N', ikigai_area: 'passion' },
          { expressive: 5, communicative: 4, extroverted: 3, mbti_dimension: 'E', ikigai_area: 'mission' },
          { analytical: 5, logical: 4, problem_solving: 3, mbti_dimension: 'T', ikigai_area: 'profession' },
          { empathetic: 5, supportive: 4, caring: 3, mbti_dimension: 'F', ikigai_area: 'mission' },
          { physical: 5, active: 4, nature_oriented: 3, mbti_dimension: 'S', ikigai_area: 'passion' },
          { curious: 5, intellectual: 4, learning_oriented: 3, mbti_dimension: 'N', ikigai_area: 'profession' },
          { reflective: 5, introspective: 4, calm: 3, mbti_dimension: 'I', ikigai_area: 'vocation' },
          { organized: 5, structured: 4, planning: 3, mbti_dimension: 'J', ikigai_area: 'profession' }
        ]
      },
      {
        id: "mindscape_6",
        text: "What color do you think represents you the most?",
        textEs: "¿Qué color crees que te representa más?",
        type: "multiple-choice",
        options: [
          "Yellow: Energy and inner joy",
          "Blue: Calm, depth and sensitivity",
          "Red: Passion, action and courage",
          "Green: Nature, balance and harmony",
          "Orange: creativity, enthusiasm and movement",
          "Violet: Intuition, imagination and emotional connection"
        ],
        optionsEs: [
          "Amarillo: Energía y alegría interior",
          "Azul: Calma, profundidad y sensibilidad",
          "Rojo: Pasión, acción y valentía",
          "Verde: Naturaleza, equilibrio y armonía",
          "Naranja: Creatividad, entusiasmo y movimiento",
          "Violeta: Intuición, imaginación y conexión emocional"
        ],
        optionValues: [
          { creative: 5, artistic: 4, imaginative: 3, mbti_dimension: 'N', ikigai_area: 'passion' },
          { expressive: 5, communicative: 4, extroverted: 3, mbti_dimension: 'E', ikigai_area: 'mission' },
          { analytical: 5, logical: 4, problem_solving: 3, mbti_dimension: 'T', ikigai_area: 'profession' },
          { empathetic: 5, supportive: 4, caring: 3, mbti_dimension: 'F', ikigai_area: 'mission' },
          { physical: 5, active: 4, nature_oriented: 3, mbti_dimension: 'S', ikigai_area: 'passion' },
          { curious: 5, intellectual: 4, learning_oriented: 3, mbti_dimension: 'N', ikigai_area: 'profession' },
          { reflective: 5, introspective: 4, calm: 3, mbti_dimension: 'I', ikigai_area: 'vocation' },
          { organized: 5, structured: 4, planning: 3, mbti_dimension: 'J', ikigai_area: 'profession' }
        ]
      }
    ]
  },
  {
    id: "skills",
    title: "Discovering my skills",
    titleEs: "Descubriendo mis habilidades",
    description: "Identifying what skills and capabilities you possess is crucial in determining your pathway",
    descriptionEs: "Identificar qué habilidades y capacidades posees es crucial para determinar tu camino",
    questions: [
      {
        id: "skills_1",
        text: "What things do you tend to be good at easily?",
        textEs: "¿Qué cosas se te suelen dar bien con facilidad?",
        type: "multiple-select",
        maxOptions: 3,
        options: [
          "Summarizing or creating useful outlines",
          "Explaining something or resolving doubts for others",
          "Assembling, configuring, or fixing things",
          "Detecting things that aren't right; Reviewing for errors",
          "Using methods and procedures to solve exercises and problems",
          "Listening attentively, understanding and remembering what's important",
          "Being well organized when I have many tasks, assignments, or exams",
          "Doing several things at once",
          "Continuing with the path/process/action when most cannot"
        ],
        optionsEs: [
          "Hacer resúmenes o esquemas útiles",
          "Explicar algo o resolver una duda a los demás",
          "Montar, configurar o arreglar cosas",
          "Detectar cosas que no están bien; Revisar errores",
          "Usar métodos y procedimientos para resolver ejercicios y problemas",
          "Escuchar atentamente, comprender y recordar lo importante",
          "Organizarme bien por mi cuenta cuando tengo muchas tareas, deberes o exámenes",
          "Hacer varias cosas a la vez",
          "Continuar con el camino/proceso/acción cuando la mayoría no pueden"
        ],
        optionValues: [
          { analytical: 4, structured: 5, mbti_dimension: 'J', ikigai_area: 'profession' },
          { communicative: 5, teaching: 4, mbti_dimension: 'E', ikigai_area: 'mission' },
          { practical: 5, technical: 4, mbti_dimension: 'S', ikigai_area: 'profession' },
          { detail_oriented: 5, critical: 4, mbti_dimension: 'J', ikigai_area: 'profession' },
          { methodical: 5, problem_solving: 4, mbti_dimension: 'T', ikigai_area: 'profession' },
          { attentive: 5, receptive: 4, mbti_dimension: 'I', ikigai_area: 'vocation' },
          { organized: 5, independent: 4, mbti_dimension: 'J', ikigai_area: 'profession' },
          { multitasking: 5, adaptable: 4, mbti_dimension: 'P', ikigai_area: 'vocation' },
          { perseverant: 5, resilient: 4, mbti_dimension: 'J', ikigai_area: 'vocation' }
        ]
      },
      {
        id: "skills_2",
        text: "What kind of things do others usually ask you for help with?",
        textEs: "¿Para qué tipo de cosas suelen pedirte ayuda los demás?",
        type: "open",
        minValue: 10,
        maxValue: 200,
        keywordAnalysis: {
          technical: ["fix", "repair", "computer", "device", "technology", "assemble", "build", "install", "configure"],
          creative: ["design", "create", "draw", "write", "imagine", "idea", "concept", "artistic", "style"],
          academic: ["homework", "assignment", "study", "learn", "understand", "explain", "subject", "class", "course"],
          social: ["advice", "listen", "support", "understand", "conflict", "relationship", "communication", "guide", "counsel"],
          organizational: ["organize", "plan", "schedule", "manage", "coordinate", "arrange", "systematic", "efficient", "structure"]
        },
        keywordAnalysisEs: {
          technical: ["arreglar", "reparar", "ordenador", "dispositivo", "tecnología", "montar", "construir", "instalar", "configurar"],
          creative: ["diseñar", "crear", "dibujar", "escribir", "imaginar", "idea", "concepto", "artístico", "estilo"],
          academic: ["deberes", "tarea", "estudiar", "aprender", "entender", "explicar", "asignatura", "clase", "curso"],
          social: ["consejo", "escuchar", "apoyar", "comprender", "conflicto", "relación", "comunicación", "guiar", "aconsejar"],
          organizational: ["organizar", "planificar", "programar", "gestionar", "coordinar", "preparar", "sistemático", "eficiente", "estructura"]
        },
        baseTraits: {
          helpful: 3,
          valuable: 2
        },
        mbti_dimension: 'F',
        ikigai_area: 'mission'
      },
      {
        id: "skills_3",
        text: "Rate your understanding of these knowledge areas from 1 to 5",
        textEs: "Del 1 al 5, ¿cómo de fácil se te hace entender estas ramas de conocimiento?",
        type: "scale",
        minLabel: "Difficult",
        maxLabel: "Easy",
        minLabelEs: "Difícil",
        maxLabelEs: "Fácil",
        minValue: 1,
        maxValue: 5,
        items: [
          "Solving exercises, understanding formulas, reasoning through problems",
          "Reading, writing texts and expressing ideas clearly",
          "Understanding how things work, doing experiments and analyzing data",
          "Understanding the past and different cultures and societies",
          "Reflecting, debating or thinking about deep topics"
        ],
        itemsEs: [
          "Resolver ejercicios, entender fórmulas, razonar problemas",
          "Leer, escribir textos y expresar ideas con claridad",
          "Entender cómo funcionan las cosas, hacer experimentos y analizar datos",
          "Comprender el pasado y las diferentes culturas y sociedades",
          "Reflexionar, debatir o pensar sobre temas profundos"
        ],
        itemScaleValues: [
          [
            { min: 1, max: 2, analytical: 1, mathematical: 1, mbti_dimension: 'T', ikigai_area: 'profession' },
            { min: 3, max: 3, analytical: 2, mathematical: 2, mbti_dimension: null, ikigai_area: null },
            { min: 4, max: 5, analytical: 4, mathematical: 4, mbti_dimension: 'T', ikigai_area: 'profession' }
          ],
          [
            { min: 1, max: 2, linguistic: 1, expressive: 1, mbti_dimension: 'F', ikigai_area: 'passion' },
            { min: 3, max: 3, linguistic: 2, expressive: 2, mbti_dimension: null, ikigai_area: null },
            { min: 4, max: 5, linguistic: 4, expressive: 4, mbti_dimension: 'F', ikigai_area: 'passion' }
          ],
          [
            { min: 1, max: 2, scientific: 1, inquisitive: 1, mbti_dimension: 'N', ikigai_area: 'profession' },
            { min: 3, max: 3, scientific: 2, inquisitive: 2, mbti_dimension: null, ikigai_area: null },
            { min: 4, max: 5, scientific: 4, inquisitive: 4, mbti_dimension: 'N', ikigai_area: 'profession' }
          ],
          [
            { min: 1, max: 2, historical: 1, cultural: 1, mbti_dimension: 'S', ikigai_area: 'mission' },
            { min: 3, max: 3, historical: 2, cultural: 2, mbti_dimension: null, ikigai_area: null },
            { min: 4, max: 5, historical: 4, cultural: 4, mbti_dimension: 'S', ikigai_area: 'mission' }
          ],
          [
            { min: 1, max: 2, philosophical: 1, abstract: 1, mbti_dimension: 'N', ikigai_area: 'passion' },
            { min: 3, max: 3, philosophical: 2, abstract: 2, mbti_dimension: null, ikigai_area: null },
            { min: 4, max: 5, philosophical: 4, abstract: 4, mbti_dimension: 'N', ikigai_area: 'passion' }
          ]
        ]
      },
      {
        id: "skills_4",
        text: "When working in a group, what do you usually do without being asked?",
        textEs: "Cuando trabajas en grupo, ¿qué sueles hacer sin que nadie te lo pida?",
        type: "multiple-select",
        maxOptions: 2,
        options: [
          "I usually organize the work and my teammates",
          "I try to think of ideas to make it more creative",
          "I am the one who writes the most and completes the project",
          "I present the work in public, I explain what we have done",
          "I try to create a good atmosphere among colleagues so that everyone feels good and participates",
          "I help ensure the work doesn't fall behind, that it gets done without wasting time"
        ],
        optionsEs: [
          "Suelo organizar el trabajo y a mis compañeros",
          "Intento pensar ideas para hacerlo más creativo",
          "Soy el que más escribe y completa el proyecto",
          "Presento el trabajo en público, expongo lo que hemos hecho",
          "Intento generar buen clima entre los compañeros para que todos se sientan bien y participen",
          "Ayudo a que el trabajo no se retrase, que se haga sin perder tiempo"
        ],
        optionValues: [
          { leadership: 5, organizational: 4, mbti_dimension: 'J', ikigai_area: 'mission' },
          { creative: 5, innovative: 4, mbti_dimension: 'N', ikigai_area: 'passion' },
          { responsible: 5, diligent: 4, mbti_dimension: 'J', ikigai_area: 'profession' },
          { communicative: 5, expressive: 4, mbti_dimension: 'E', ikigai_area: 'mission' },
          { empathetic: 5, team_oriented: 4, mbti_dimension: 'F', ikigai_area: 'mission' },
          { efficient: 5, practical: 4, mbti_dimension: 'T', ikigai_area: 'profession' }
        ]
      },
      {
        id: "skills_5",
        text: "How do you think you learn or understand new things more easily?",
        textEs: "¿Cómo crees que aprendes o entiendes las cosas nuevas más fácilmente?",
        type: "multiple-select",
        maxOptions: 2,
        options: [
          "Seeing examples or solved videos",
          "Listening to someone who explains well",
          "Practicing on my own",
          "Repeating many times, memorizing",
          "Explaining it to another person",
          "Writing several times, underlining",
          "Studying with others, talking in a group"
        ],
        optionsEs: [
          "Viendo ejemplos o vídeos resueltos",
          "Escuchando a alguien que explica bien",
          "Practicando por tu cuenta",
          "Repitiendo muchas veces, memorizando",
          "Explicándoselo a otra persona",
          "Escribiendo varais veces, subrayando",
          "Estudiando entre varios, hablando en grupo"
        ],
        optionValues: [
          { visual: 5, observant: 4, mbti_dimension: 'S', ikigai_area: 'profession' },
          { auditory: 5, receptive: 4, mbti_dimension: 'E', ikigai_area: 'vocation' },
          { kinesthetic: 5, independent: 4, mbti_dimension: 'I', ikigai_area: 'profession' },
          { repetitive: 5, methodical: 4, mbti_dimension: 'S', ikigai_area: 'profession' },
          { teaching: 5, expressive: 4, mbti_dimension: 'E', ikigai_area: 'mission' },
          { writing: 5, structured: 4, mbti_dimension: 'J', ikigai_area: 'profession' },
          { collaborative: 5, social: 4, mbti_dimension: 'E', ikigai_area: 'mission' }
        ]
      },
      {
        id: "skills_6",
        text: "I feel confident when...",
        textEs: "Me siento con confianza cuando...",
        type: "open",
        subQuestion: "I remember feeling very proud and very happy with myself when...",
        subQuestionEs: "Recuerdo que me sentí muy orgulloso y muy contento conmigo mismo cuando...",
        minValue: 10,
        maxValue: 200,
        keywordAnalysis: {
          achievement: ["completed", "accomplished", "succeeded", "achieved", "won", "overcame", "mastered", "finished", "solved"],
          recognition: ["praised", "recognized", "appreciated", "acknowledged", "valued", "rewarded", "noticed", "admired", "respected"],
          helping: ["helped", "assisted", "supported", "taught", "guided", "mentored", "enabled", "contributed", "facilitated"],
          creating: ["created", "designed", "built", "developed", "produced", "invented", "crafted", "composed", "innovated"]
        },
        keywordAnalysisEs: {
          achievement: ["completé", "logré", "tuve éxito", "alcancé", "gané", "superé", "dominé", "terminé", "resolví"],
          recognition: ["elogiado", "reconocido", "apreciado", "agradecido", "valorado", "recompensado", "notado", "admirado", "respetado"],
          helping: ["ayudé", "asistí", "apoyé", "enseñé", "guié", "mentoreé", "permití", "contribuí", "facilité"],
          creating: ["creé", "diseñé", "construí", "desarrollé", "produje", "inventé", "elaboré", "compuse", "innové"]
        },
        baseTraits: {
          confident: 3,
          proud: 2
        },
        mbti_dimension: 'T',
        ikigai_area: 'vocation'
      },
    ]
  },
  {
    id: "world_needs",
    title: "The world needs you",
    titleEs: "El mundo te necesita",
    description: "Exploring how you can contribute to society",
    descriptionEs: "Exploramos cómo puedes contribuir con la sociedad",
    questions: [
      {
        id: "world_needs_1",
        text: "What kind of things move you deeply inside?",
        textEs: "¿Qué tipo de cosas te remueven más por dentro?",
        type: "multiple-select",
        maxOptions: 3,
        options: [
          "Pollution",
          "When people who suffer in silence are not understood",
          "When someone has fewer opportunities to develop",
          "When someone is rejected for who they are",
          "When animals are mistreated",
          "When social media harms people",
          "When mental health is disregarded"
        ],
        optionsEs: [
          "La contaminación",
          "Cuando no se entiende a las personas que sufren en silencio",
          "Cuando alguien tiene menos oportunidades para desarrollarse",
          "Cuando alguien es rechazado por como es",
          "Cuando se maltrata a los animales",
          "Cuando las redes sociales hacen daño a las personas",
          "Cuando se desestima la salud mental"
        ],
        optionValues: [
          { environmental: 5, ecological: 4, mbti_dimension: 'F', ikigai_area: 'mission' },
          { empathetic: 5, compassionate: 4, mbti_dimension: 'F', ikigai_area: 'mission' },
          { justice: 5, equality: 4, mbti_dimension: 'F', ikigai_area: 'mission' },
          { inclusive: 5, accepting: 4, mbti_dimension: 'F', ikigai_area: 'mission' },
          { protective: 5, caring: 4, mbti_dimension: 'F', ikigai_area: 'mission' },
          { awareness: 5, ethical: 4, mbti_dimension: 'T', ikigai_area: 'mission' },
          { supportive: 5, understanding: 4, mbti_dimension: 'F', ikigai_area: 'mission' }
        ]
      }, {
        id: "world_needs_2",
        text: "Can you imagine helping others, animals, or the planet in the future?",
        textEs: "¿Te imaginas ayudando a los demás, a los animales o al planeta en un futuro?",
        type: "scale",
          minLabel: "Difficult",
          maxLabel: "Easy",
          minLabelEs: "Difícil",
          maxLabelEs: "Fácil",
          minValue: 1,
          maxValue: 5,
          items: [
            "How much you imagine it"
          ],
          itemsEs: [
            "Cuánto te lo imaginas",
          ],
          itemScaleValues: [
            [
              { min: 1, max: 2, altruistic: 1, service_oriented: 1, mbti_dimension: 'T', ikigai_area: 'mission' },
              { min: 3, max: 3, altruistic: 2, service_oriented: 2, mbti_dimension: null, ikigai_area: null },
              { min: 4, max: 5, altruistic: 4, service_oriented: 4, mbti_dimension: 'F', ikigai_area: 'mission' }
            ]
          ]
      }, {
        id: "world_needs_3",
        text: "What types of people inspire you the most?",
        textEs: "¿Qué tipos de personas te inspiran más?",
        type: "multiple-select",
        maxOptions: 2,
        options: [
          "Those who teach, accompany and help others grow",
          "Those who fight to improve themselves every day",
          "Those who take care of others without expecting anything in return",
          "Those who are able to transform a problem into a solution",
          "Those who create beauty and art, who move and connect with others",
          "Those who manage to unite different people with diverse points of view",
          "Those who never give up and always learn"
        ],
        optionsEs: [
          "Quienes enseñan, acompañan y ayudan a crecer a otros",
          "Quienes luchan por superarse así mismos cada día",
          "Quienes cuidan de los demás sin esperar nada a cambio",
          "Quienes son capaces de transformas un problema en una solución",
          "Quienes crean belleza y arte, que emocionan y conectan con los demás",
          "Quienes logran unir a personas diferentes con diversos puntos de vista",
          "Quienes nunca se rinden y aprenden siempre"
        ],
        optionValues: [
          { mentoring: 5, supportive: 4, mbti_dimension: 'F', ikigai_area: 'mission' },
          { growth_oriented: 5, determined: 4, mbti_dimension: 'J', ikigai_area: 'vocation' },
          { selfless: 5, nurturing: 4, mbti_dimension: 'F', ikigai_area: 'mission' },
          { problem_solving: 5, innovative: 4, mbti_dimension: 'T', ikigai_area: 'profession' },
          { creative: 5, artistic: 4, mbti_dimension: 'N', ikigai_area: 'passion' },
          { unifying: 5, diplomatic: 4, mbti_dimension: 'F', ikigai_area: 'mission' },
          { resilient: 5, lifelong_learner: 4, mbti_dimension: 'J', ikigai_area: 'vocation' }
        ]
      }, {
        id: "world_needs_4",
        text: "If many people were like me, the world would have more...",
        textEs: "Si muchas personas fueran cómo yo, el mundo tendría más ...",
        type: "open",
        minValue: 10,
        maxValue: 200,
        keywordAnalysis: {
          compassion: ["kindness", "empathy", "caring", "understanding", "supportive", "helping", "generous", "considerate", "thoughtful"],
          justice: ["fairness", "equality", "rights", "dignity", "respect", "integrity", "honesty", "ethics", "morality"],
          creativity: ["innovation", "ideas", "imagination", "art", "beauty", "originality", "inspiration", "expression", "vision"],
          harmony: ["peace", "balance", "cooperation", "unity", "collaboration", "togetherness", "stability", "calm", "tranquility"]
        },
        keywordAnalysisEs: {
          compassion: ["bondad", "empatía", "cuidado", "comprensión", "apoyo", "ayuda", "generosidad", "consideración", "atención"],
          justice: ["justicia", "igualdad", "derechos", "dignidad", "respeto", "integridad", "honestidad", "ética", "moralidad"],
          creativity: ["innovación", "ideas", "imaginación", "arte", "belleza", "originalidad", "inspiración", "expresión", "visión"],
          harmony: ["paz", "equilibrio", "cooperación", "unidad", "colaboración", "unión", "estabilidad", "calma", "tranquilidad"]
        },
        baseTraits: {
          valuedriven: 3,
          visionary: 2
        },
        mbti_dimension: 'F',
        ikigai_area: 'mission'
      }, 
    ]
  },
  {
    id: "money",
    title: "Value paid",
    titleEs: "Valor pagado",
    description: "Let's analyze how much you value yourself and how much you think your work is worth",
    descriptionEs: "Vamos a analizar qué tanto te valoras y cuánto crees que vale tu trabajo",
    questions: [
      {
        id: "money_1",
        text: "What kind of things would you like to do in the future if you could also make a living from it?",
        textEs: "¿Qué tipo de cosas te gustaría hacer en un futuro si además pudieses ganarte la vida con ello?",
        type: "multiple-choice",
        maxOptions: 3,
        options: [
          "Design, create or invent things that don't yet exist",
          "Transmit inspiring sensations and ideas, recording, writing or speaking",
          "Help others understand, learn and improve",
          "Be present for those who need help",
          "Solve problems, detecting errors and proposing solutions",
          "Plan, coordinate and make everything work",
          "Care for the environment and everything around it"
        ],
        optionsEs: [
          "Diseñar, crear o inventar cosas que aún no existen",
          "Transmitir sensaciones e ideas inspiradoras, grabando, escribiendo o hablando",
          "Ayudar a otros a entender, aprender y mejorar",
          "Estar presente para aquellos que necesiten ayuda",
          "Resolver problemas, detectando errores y proponiendo soluciones",
          "Planificar, coordinar y hacer que todo pueda funcionar",
          "Cuidar del entorno  y todo lo que lo rodea"
        ],
        optionValues: [
          { creative: 5, innovative: 4, mbti_dimension: 'N', ikigai_area: 'passion' },
          { expressive: 5, communicative: 4, mbti_dimension: 'E', ikigai_area: 'mission' },
          { teaching: 5, supportive: 4, mbti_dimension: 'F', ikigai_area: 'mission' },
          { helping: 5, empathetic: 4, mbti_dimension: 'F', ikigai_area: 'mission' },
          { problem_solving: 5, analytical: 4, mbti_dimension: 'T', ikigai_area: 'profession' },
          { organizational: 5, leadership: 4, mbti_dimension: 'J', ikigai_area: 'profession' },
          { environmental: 5, nurturing: 4, mbti_dimension: 'F', ikigai_area: 'mission' }
        ]
      },
      {
        id: "money_2",
        text: "How would you like to be recognized in the future?",
        textEs: "¿Cómo te gustaría que te reconocieran en un futuro?",
        type: "open",
        minValue: 10,
        maxValue: 200,
        keywordAnalysis: {
          achievement: ["successful", "accomplished", "expert", "skilled", "talented", "proficient", "capable", "competent", "qualified"],
          innovation: ["creative", "innovative", "inventive", "groundbreaking", "original", "pioneering", "visionary", "revolutionary", "trendsetting"],
          impact: ["influential", "impactful", "significant", "important", "meaningful", "valuable", "beneficial", "helpful", "useful"],
          character: ["honest", "ethical", "reliable", "trustworthy", "dependable", "responsible", "respectful", "principled", "integral"]
        },
        keywordAnalysisEs: {
          achievement: ["exitoso", "logrado", "experto", "hábil", "talentoso", "competente", "capaz", "cualificado", "destacado"],
          innovation: ["creativo", "innovador", "inventivo", "revolucionario", "original", "pionero", "visionario", "transformador", "tendencia"],
          impact: ["influyente", "impactante", "significativo", "importante", "relevante", "valioso", "beneficioso", "útil", "provechoso"],
          character: ["honesto", "ético", "confiable", "fidedigno", "responsable", "respetuoso", "íntegro", "transparente", "auténtico"]
        },
        baseTraits: {
          ambitious: 3,
          valuedriven: 2
        },
        mbti_dimension: 'E',
        ikigai_area: 'vocation'
      }, 
      {
        id: "money_3",
        text: "What characteristics do you think you would value most when thinking about work in the future?",
        textEs: "Qué características crees que valorarías más cuando piensas en el trabajo en un futuro?",
        type: "scale",
        minLabel: "Very little",
        maxLabel: "Very much",
        minLabelEs: "Muy poco",
        maxLabelEs: "Muchísimo",
        minValue: 1,
        maxValue: 5,
        items: [
          "Doing things my way or with autonomy",
          "Feeling that I help and contribute something useful to others",
          "Always learning new things and being able to solve challenges",
          "Having peace of mind and financial stability",
          "Being able to do different things imagining and creating",
          "Being with other people and not working alone"
        ],
        itemsEs: [
          "Hacer las cosas a mi manera o con autonomía",
          "Sentir que ayudo y aporto algo útil a otros",
          "Aprender siempre cosas nuevas y poder resolver retos",
          "Tener tranquilidad y estabilidad económica",
          "Poder hacer cosas diferentes imaginando y creando",
          "Estar con otras personas y no trabajar en soledad"
        ],
        itemScaleValues: [
          [
            { min: 1, max: 2, autonomous: 1, independent: 1, mbti_dimension: 'I', ikigai_area: 'vocation' },
            { min: 3, max: 3, autonomous: 2, independent: 2, mbti_dimension: null, ikigai_area: null },
            { min: 4, max: 5, autonomous: 4, independent: 4, mbti_dimension: 'I', ikigai_area: 'vocation' }
          ],
          [
            { min: 1, max: 2, helpful: 1, contributive: 1, mbti_dimension: 'F', ikigai_area: 'mission' },
            { min: 3, max: 3, helpful: 2, contributive: 2, mbti_dimension: null, ikigai_area: null },
            { min: 4, max: 5, helpful: 4, contributive: 4, mbti_dimension: 'F', ikigai_area: 'mission' }
          ],
          [
            { min: 1, max: 2, growth_oriented: 1, challenge_seeking: 1, mbti_dimension: 'N', ikigai_area: 'profession' },
            { min: 3, max: 3, growth_oriented: 2, challenge_seeking: 2, mbti_dimension: null, ikigai_area: null },
            { min: 4, max: 5, growth_oriented: 4, challenge_seeking: 4, mbti_dimension: 'N', ikigai_area: 'profession' }
          ],
          [
            { min: 1, max: 2, security_seeking: 1, stability_oriented: 1, mbti_dimension: 'S', ikigai_area: 'profession' },
            { min: 3, max: 3, security_seeking: 2, stability_oriented: 2, mbti_dimension: null, ikigai_area: null },
            { min: 4, max: 5, security_seeking: 4, stability_oriented: 4, mbti_dimension: 'S', ikigai_area: 'profession' }
          ],
          [
            { min: 1, max: 2, creative: 1, variety_seeking: 1, mbti_dimension: 'N', ikigai_area: 'passion' },
            { min: 3, max: 3, creative: 2, variety_seeking: 2, mbti_dimension: null, ikigai_area: null },
            { min: 4, max: 5, creative: 4, variety_seeking: 4, mbti_dimension: 'N', ikigai_area: 'passion' }
          ],
          [
            { min: 1, max: 2, social: 1, collaborative: 1, mbti_dimension: 'E', ikigai_area: 'mission' },
            { min: 3, max: 3, social: 2, collaborative: 2, mbti_dimension: null, ikigai_area: null },
            { min: 4, max: 5, social: 4, collaborative: 4, mbti_dimension: 'E', ikigai_area: 'mission' }
          ]
        ]
      },
      {
        id: "money_4",
        text: "Have you ever imagined creating your own idea, brand or project? How do you think it could be?",
        textEs: "¿Alguna vez te has imaginado creando tu propia idea, marca o proyecto? ¿cómo crees que podría ser?",
        type: "open",
        minValue: 100,
        maxValue: 2000,
        keywordAnalysis: {
          entrepreneurial: ["business", "startup", "company", "entrepreneur", "venture", "enterprise", "founder", "ownership", "profits"],
          innovative: ["innovative", "unique", "novel", "different", "breakthrough", "disruptive", "cutting-edge", "leading", "pioneering"],
          impactful: ["change", "difference", "impact", "influence", "benefit", "improve", "transform", "enhance", "contribute"],
          sustainable: ["sustainable", "eco-friendly", "green", "environmental", "responsible", "ethical", "conscious", "fair", "balanced"]
        },
        keywordAnalysisEs: {
          entrepreneurial: ["negocio", "emprendimiento", "empresa", "emprendedor", "proyecto", "empresarial", "fundador", "propiedad", "ganancias"],
          innovative: ["innovador", "único", "novedoso", "diferente", "revolucionario", "disruptivo", "vanguardia", "líder", "pionero"],
          impactful: ["cambio", "diferencia", "impacto", "influencia", "beneficio", "mejorar", "transformar", "potenciar", "contribuir"],
          sustainable: ["sostenible", "ecológico", "verde", "ambiental", "responsable", "ético", "consciente", "justo", "equilibrado"]
        },
        baseTraits: {
          visionary: 3,
          entrepreneurial: 3
        },
        mbti_dimension: 'N',
        ikigai_area: 'passion'
      }
    ]
  }
];

// Comprehensive test includes all the quick test questions plus additional ones
export const comprehensiveTestBlocks: QuestionBlock[] = [
  {
    id: "mindscape",
    title: "Mindscape Explorers",
    description: "Discover how you process information and make decisions",
    questions: [
      // Include the 5 quick test questions
      ...quickTestBlocks.find(block => block.id === "mindscape")?.questions || [],
      
      // Add 15 more questions for the comprehensive test
      {
        id: "mindscape_6",
        text: "When learning something new, I prefer:",
        type: "multiple-choice",
        options: [
          "Reading detailed instructions",
          "Watching a demonstration",
          "Trying it myself through trial and error",
          "Discussing it with someone experienced"
        ],
        traits: {
          theoretical: 1,
          visual: 1,
          experiential: 1,
          collaborative: 1
        }
      },
      {
        id: "mindscape_7",
        text: "How do you typically organize your thoughts?",
        type: "multiple-choice",
        options: [
          "Linear and sequential",
          "Mind maps and visual connections",
          "Notes and lists",
          "I don't typically organize my thoughts"
        ],
        traits: {
          linear: 1,
          visual: 1,
          structured: 1,
          intuitive: 1
        }
      },
      {
        id: "mindscape_8",
        text: "How likely are you to challenge conventional wisdom?",
        type: "scale",
        minLabel: "I rarely question conventions",
        maxLabel: "I regularly challenge norms",
        traits: {
          conventional: 1,
          disruptive: 1
        }
      },
      {
        id: "mindscape_9",
        text: "When making decisions, how much do you rely on data versus intuition?",
        type: "scale",
        minLabel: "Completely data-driven",
        maxLabel: "Completely intuition-driven",
        traits: {
          analytical: 1,
          intuitive: 1
        }
      },
      {
        id: "mindscape_10",
        text: "How do you respond to criticism of your ideas?",
        type: "multiple-choice",
        options: [
          "I welcome it as a chance to improve",
          "I defend my position with evidence",
          "I feel personally attacked",
          "I consider it but trust my own judgment"
        ],
        traits: {
          openness: 1,
          conviction: 1,
          sensitivity: 1,
          confidence: 1
        }
      },
      {
        id: "mindscape_11",
        text: "Describe a situation where you had to think outside the box:",
        type: "open",
        traits: {
          creativity: 1,
          innovation: 1
        }
      },
      {
        id: "mindscape_12",
        text: "How do you typically approach complex systems?",
        type: "multiple-choice",
        options: [
          "Break them down into components",
          "Look for patterns and connections",
          "Focus on the overall purpose",
          "Experiment to see how they work"
        ],
        traits: {
          analytical: 1,
          pattern_recognition: 1,
          holistic: 1,
          experiential: 1
        }
      },
      {
        id: "mindscape_13",
        text: "How easily can you switch between different types of mental tasks?",
        type: "scale",
        minLabel: "I prefer focusing on one type",
        maxLabel: "I switch easily between tasks",
        traits: {
          focused: 1,
          flexible: 1
        }
      },
      {
        id: "mindscape_14",
        text: "How do you approach ethical dilemmas?",
        type: "multiple-choice",
        options: [
          "Apply consistent principles",
          "Consider the specific context",
          "Trust my moral intuition",
          "Consider the impact on all involved"
        ],
        traits: {
          principle_driven: 1,
          contextual: 1,
          intuitive: 1,
          utilitarian: 1
        }
      },
      {
        id: "mindscape_15",
        text: "What's more important in your thinking process?",
        type: "multiple-choice",
        options: [
          "Accuracy and precision",
          "Speed and efficiency",
          "Creativity and originality",
          "Depth and thoroughness"
        ],
        traits: {
          precision: 1,
          efficiency: 1,
          creativity: 1,
          thoroughness: 1
        }
      },
      {
        id: "mindscape_16",
        text: "How do you handle information overload?",
        type: "multiple-choice",
        options: [
          "Prioritize and focus on essentials",
          "Look for patterns and themes",
          "Take breaks to process and reflect",
          "Create systems to organize information"
        ],
        traits: {
          prioritization: 1,
          pattern_recognition: 1,
          reflective: 1,
          systematic: 1
        }
      },
      {
        id: "mindscape_17",
        text: "How important is aesthetic beauty in your thought processes?",
        type: "scale",
        minLabel: "Function over form",
        maxLabel: "Beauty is essential",
        traits: {
          pragmatic: 1,
          aesthetic: 1
        }
      },
      {
        id: "mindscape_18",
        text: "When solving problems, I'm more likely to:",
        type: "multiple-choice",
        options: [
          "Apply proven methods",
          "Create novel approaches",
          "Combine existing ideas in new ways",
          "Research what others have done"
        ],
        traits: {
          conventional: 1,
          innovative: 1,
          synthesizing: 1,
          research_oriented: 1
        }
      },
      {
        id: "mindscape_19",
        text: "How do you feel about ambiguity and uncertainty?",
        type: "scale",
        minLabel: "I strongly dislike it",
        maxLabel: "I'm comfortable with it",
        traits: {
          structure_seeking: 1,
          ambiguity_tolerant: 1
        }
      },
      {
        id: "mindscape_20",
        text: "Describe how you approach learning a complex new skill:",
        type: "open",
        traits: {
          learning_approach: 1,
          patience: 1
        }
      }
    ]
  },
  {
    id: "social_dynamics",
    title: "Social Compass",
    description: "Understand how you relate to others and navigate social situations",
    questions: [
      // Include the 5 quick test questions
      ...quickTestBlocks.find(block => block.id === "social_dynamics")?.questions || [],
      
      // Add 15 more questions for the comprehensive test
      {
        id: "social_6",
        text: "How do you typically respond when someone disagrees with you?",
        type: "multiple-choice",
        options: [
          "Try to understand their perspective",
          "Present evidence for my viewpoint",
          "Become frustrated or defensive",
          "Seek a compromise"
        ],
        traits: {
          empathy: 1,
          conviction: 1,
          emotional_reactivity: 1,
          negotiation: 1
        }
      },
      {
        id: "social_7",
        text: "How comfortable are you with being vulnerable with others?",
        type: "scale",
        minLabel: "Very uncomfortable",
        maxLabel: "Very comfortable",
        traits: {
          vulnerability: 1,
          guardedness: 1
        }
      },
      {
        id: "social_8",
        text: "In group settings, I'm most likely to:",
        type: "multiple-choice",
        options: [
          "Take the lead and organize others",
          "Contribute ideas but not take charge",
          "Listen and support others' ideas",
          "Work independently within the group"
        ],
        traits: {
          leadership: 1,
          contribution: 1,
          supportive: 1,
          independent: 1
        }
      },
      {
        id: "social_9",
        text: "How do you typically build trust with new people?",
        type: "open",
        traits: {
          trust_building: 1,
          social_intelligence: 1
        }
      },
      {
        id: "social_10",
        text: "How important is it for you to be liked by others?",
        type: "scale",
        minLabel: "Not important",
        maxLabel: "Very important",
        traits: {
          independent: 1,
          approval_seeking: 1
        }
      },
      {
        id: "social_11",
        text: "When someone shares a problem, I'm more likely to:",
        type: "multiple-choice",
        options: [
          "Listen and validate their feelings",
          "Offer solutions and advice",
          "Share a similar experience",
          "Ask questions to help them find clarity"
        ],
        traits: {
          empathetic: 1,
          problem_solving: 1,
          relatability: 1,
          coaching: 1
        }
      },
      {
        id: "social_12",
        text: "How do you handle receiving praise or recognition?",
        type: "multiple-choice",
        options: [
          "I feel uncomfortable and deflect it",
          "I accept it graciously but humbly",
          "I feel energized and motivated by it",
          "I question whether I truly deserve it"
        ],
        traits: {
          modesty: 1,
          confidence: 1,
          external_motivation: 1,
          self_doubt: 1
        }
      },
      {
        id: "social_13",
        text: "How do you typically respond to others' emotions?",
        type: "multiple-choice",
        options: [
          "I feel them intensely myself",
          "I recognize them but stay detached",
          "I try to problem-solve or cheer them up",
          "I sometimes find it difficult to identify what they're feeling"
        ],
        traits: {
          empathy: 1,
          emotional_boundaries: 1,
          practical_support: 1,
          emotional_awareness: 1
        }
      },
      {
        id: "social_14",
        text: "How do you typically handle social events with strangers?",
        type: "open",
        traits: {
          social_adaptation: 1,
          comfort_with_strangers: 1
        }
      },
      {
        id: "social_15",
        text: "How important is having deep connections versus having many connections?",
        type: "scale",
        minLabel: "Many connections",
        maxLabel: "Few deep connections",
        traits: {
          breadth_social: 1,
          depth_social: 1
        }
      },
      {
        id: "social_16",
        text: "How do you typically respond when you feel misunderstood?",
        type: "multiple-choice",
        options: [
          "Explain myself more clearly",
          "Ask questions to identify the misunderstanding",
          "Feel frustrated but let it go",
          "Assume it's not important and move on"
        ],
        traits: {
          articulation: 1,
          clarification_seeking: 1,
          frustration_tolerance: 1,
          detachment: 1
        }
      },
      {
        id: "social_17",
        text: "How do you handle being in positions of authority?",
        type: "multiple-choice",
        options: [
          "I'm comfortable directing others",
          "I prefer to lead by example",
          "I try to empower others to make decisions",
          "I'm uncomfortable with authority positions"
        ],
        traits: {
          directive_leadership: 1,
          exemplary_leadership: 1,
          democratic_leadership: 1,
          authority_aversion: 1
        }
      },
      {
        id: "social_18",
        text: "How do you respond when someone is upset with you?",
        type: "multiple-choice",
        options: [
          "Try to understand their perspective",
          "Defend my position or actions",
          "Feel guilty regardless of fault",
          "Distance myself from the situation"
        ],
        traits: {
          empathy: 1,
          self_defense: 1,
          guilt_proneness: 1,
          avoidance: 1
        }
      },
      {
        id: "social_19",
        text: "How do you handle giving negative feedback?",
        type: "multiple-choice",
        options: [
          "Direct but kind approach",
          "Sandwich it between positive comments",
          "Avoid giving negative feedback",
          "Focus only on actionable improvements"
        ],
        traits: {
          directness: 1,
          diplomacy: 1,
          conflict_avoidance: 1,
          practicality: 1
        }
      },
      {
        id: "social_20",
        text: "Describe your approach to navigating workplace or school politics:",
        type: "open",
        traits: {
          political_savvy: 1,
          social_strategy: 1
        }
      }
    ]
  },
  {
    id: "passion_purpose",
    title: "Passion Pathfinders",
    description: "Explore what drives you and gives your life meaning",
    questions: [
      // Include the 5 quick test questions
      ...quickTestBlocks.find(block => block.id === "passion_purpose")?.questions || [],
      
      // Add 15 more questions for the comprehensive test
      {
        id: "passion_6",
        text: "What's more important to you in your work?",
        type: "multiple-choice",
        options: [
          "Making a positive impact on others",
          "Financial stability and security",
          "Learning and growth opportunities",
          "Recognition and advancement"
        ],
        traits: {
          altruism: 1,
          security: 1,
          growth: 1,
          achievement: 1
        }
      },
      {
        id: "passion_7",
        text: "How do you feel when your work doesn't align with your personal values?",
        type: "multiple-choice",
        options: [
          "Very uncomfortable, I need alignment",
          "Conflicted but can separate work and values",
          "Fine as long as the work isn't harmful",
          "Work is just a means to support my life"
        ],
        traits: {
          value_alignment: 1,
          compartmentalization: 1,
          ethical_boundaries: 1,
          pragmatism: 1
        }
      },
      {
        id: "passion_8",
        text: "What motivates you to persist through difficult challenges?",
        type: "open",
        traits: {
          resilience: 1,
          motivation_source: 1
        }
      },
      {
        id: "passion_9",
        text: "How important is creativity in your life and work?",
        type: "scale",
        minLabel: "Not important",
        maxLabel: "Essential",
        traits: {
          creativity: 1,
          conventional: 1
        }
      },
      {
        id: "passion_10",
        text: "Which best describes your attitude toward your career path?",
        type: "multiple-choice",
        options: [
          "I have a clear calling I'm pursuing",
          "I'm exploring multiple interests",
          "I prioritize practicality over passion",
          "I'm still discovering what I want to do"
        ],
        traits: {
          vocational_clarity: 1,
          exploratory: 1,
          pragmatic: 1,
          self_discovery: 1
        }
      },
      {
        id: "passion_11",
        text: "How important is it for you to leave a legacy?",
        type: "scale",
        minLabel: "Not important",
        maxLabel: "Very important",
        traits: {
          legacy_oriented: 1,
          present_focused: 1
        }
      },
      {
        id: "passion_12",
        text: "Describe a project or activity where you felt completely engaged and fulfilled:",
        type: "open",
        traits: {
          engagement: 1,
          fulfillment_sources: 1
        }
      },
      {
        id: "passion_13",
        text: "How do you define success for yourself?",
        type: "open",
        traits: {
          success_definition: 1,
          values: 1
        }
      },
      {
        id: "passion_14",
        text: "How willing are you to sacrifice comfort for passion?",
        type: "scale",
        minLabel: "Comfort is priority",
        maxLabel: "Will sacrifice for passion",
        traits: {
          security_seeking: 1,
          passion_driven: 1
        }
      },
      {
        id: "passion_15",
        text: "How do you feel when you can't engage in activities you're passionate about?",
        type: "multiple-choice",
        options: [
          "Restless and unfulfilled",
          "Disappointed but adaptable",
          "I find other ways to express myself",
          "I can easily focus on other things"
        ],
        traits: {
          passion_dependency: 1,
          adaptability: 1,
          creative_expression: 1,
          detachment: 1
        }
      },
      {
        id: "passion_16",
        text: "What role does helping others play in your sense of purpose?",
        type: "multiple-choice",
        options: [
          "Central to my purpose",
          "Important but not primary",
          "I help others through my work/skills",
          "I focus more on personal goals"
        ],
        traits: {
          altruism: 1,
          balanced_purpose: 1,
          indirect_service: 1,
          self_development: 1
        }
      },
      {
        id: "passion_17",
        text: "How do you react when you discover something new that excites you?",
        type: "multiple-choice",
        options: [
          "Dive deep into learning everything about it",
          "Explore it while balancing existing interests",
          "Enjoy it casually without major commitment",
          "Carefully consider how it fits my goals"
        ],
        traits: {
          deep_dive: 1,
          balanced_exploration: 1,
          casual_interest: 1,
          strategic: 1
        }
      },
      {
        id: "passion_18",
        text: "How often do you reflect on your life's meaning and purpose?",
        type: "scale",
        minLabel: "Rarely",
        maxLabel: "Frequently",
        traits: {
          existential_reflection: 1,
          practical_focus: 1
        }
      },
      {
        id: "passion_19",
        text: "What brings you the greatest sense of meaning?",
        type: "multiple-choice",
        options: [
          "Making a difference in others' lives",
          "Creating something lasting",
          "Learning and growing as a person",
          "Finding joy and contentment"
        ],
        traits: {
          service: 1,
          creation: 1,
          growth: 1,
          happiness: 1
        }
      },
      {
        id: "passion_20",
        text: "Describe how you balance practical needs with pursuing your passions:",
        type: "open",
        traits: {
          life_balance: 1,
          practical_passion: 1
        }
      }
    ]
  },
  {
    id: "future_vision",
    title: "Future Visionaries",
    description: "Uncover your approach to planning and visualizing your future",
    questions: [
      // Include the 5 quick test questions
      ...quickTestBlocks.find(block => block.id === "future_vision")?.questions || [],
      
      // Add 15 more questions for the comprehensive test
      {
        id: "future_6",
        text: "How much do past experiences influence your future decisions?",
        type: "scale",
        minLabel: "Minimal influence",
        maxLabel: "Strong influence",
        traits: {
          future_oriented: 1,
          experience_based: 1
        }
      },
      {
        id: "future_7",
        text: "When visualizing your future, do you focus more on:",
        type: "multiple-choice",
        options: [
          "Concrete goals and milestones",
          "General direction and flexibility",
          "Feelings and experiences you want to have",
          "Avoiding potential problems"
        ],
        traits: {
          goal_oriented: 1,
          direction_oriented: 1,
          experience_oriented: 1,
          prevention_focused: 1
        }
      },
      {
        id: "future_8",
        text: "How do you typically approach setting goals?",
        type: "multiple-choice",
        options: [
          "Set specific, measurable objectives",
          "Create flexible guidelines",
          "Focus on what inspires me in the moment",
          "Consider what's realistic given constraints"
        ],
        traits: {
          structured_planning: 1,
          flexible_planning: 1,
          inspiration_driven: 1,
          pragmatic: 1
        }
      },
      {
        id: "future_9",
        text: "How do you feel about committing to long-term plans?",
        type: "multiple-choice",
        options: [
          "Comfortable and necessary",
          "Helpful but need flexibility",
          "Uncomfortable with long commitments",
          "Prefer short-term commitments"
        ],
        traits: {
          long_term_oriented: 1,
          balanced_planning: 1,
          flexibility_needs: 1,
          short_term_focused: 1
        }
      },
      {
        id: "future_10",
        text: "Describe a significant goal you're working toward and why it matters to you:",
        type: "open",
        traits: {
          goal_clarity: 1,
          purpose_alignment: 1
        }
      },
      {
        id: "future_11",
        text: "How do you handle setbacks to your plans?",
        type: "multiple-choice",
        options: [
          "Immediately develop an alternative plan",
          "Take time to process before readjusting",
          "See it as a sign to try something different",
          "Push harder on the original plan"
        ],
        traits: {
          adaptability: 1,
          reflective: 1,
          redirecting: 1,
          persistence: 1
        }
      },
      {
        id: "future_12",
        text: "How much do you consider other people's expectations when planning your future?",
        type: "scale",
        minLabel: "Not at all",
        maxLabel: "Very much",
        traits: {
          autonomous: 1,
          other_directed: 1
        }
      },
      {
        id: "future_13",
        text: "How do you balance stability and growth in your future planning?",
        type: "multiple-choice",
        options: [
          "Prioritize stability, then consider growth",
          "Prioritize growth, accept some instability",
          "Seek balanced approach to both",
          "Focus on different aspects at different times"
        ],
        traits: {
          security_seeking: 1,
          growth_seeking: 1,
          balanced_approach: 1,
          contextual: 1
        }
      },
      {
        id: "future_14",
        text: "How clear is your vision of your ideal future?",
        type: "scale",
        minLabel: "Very vague",
        maxLabel: "Crystal clear",
        traits: {
          vision_clarity: 1,
          openness: 1
        }
      },
      {
        id: "future_15",
        text: "How often do you revisit and adjust your goals?",
        type: "multiple-choice",
        options: [
          "Regularly scheduled reviews",
          "When circumstances change significantly",
          "When feeling dissatisfied or stuck",
          "Rarely change once goals are set"
        ],
        traits: {
          structured_review: 1,
          adaptability: 1,
          intuitive_adjustment: 1,
          commitment: 1
        }
      },
      {
        id: "future_16",
        text: "What role does innovation play in your vision of the future?",
        type: "multiple-choice",
        options: [
          "Essential - I want to create something new",
          "Important - I want to improve existing things",
          "Secondary - I focus on proven approaches",
          "Minimal - I prefer established paths"
        ],
        traits: {
          innovative: 1,
          improving: 1,
          conventional: 1,
          traditional: 1
        }
      },
      {
        id: "future_17",
        text: "How much do you consider global/societal trends in your future planning?",
        type: "scale",
        minLabel: "Focus on personal context",
        maxLabel: "Highly aware of bigger trends",
        traits: {
          personal_focus: 1,
          systemic_awareness: 1
        }
      },
      {
        id: "future_18",
        text: "How do you approach making life-changing decisions?",
        type: "open",
        traits: {
          decision_process: 1,
          risk_assessment: 1
        }
      },
      {
        id: "future_19",
        text: "What is your approach to financial planning for the future?",
        type: "multiple-choice",
        options: [
          "Detailed budgeting and investment planning",
          "General saving with flexible allocation",
          "Focus on current income growth",
          "Live in the present, minimal future planning"
        ],
        traits: {
          financial_planning: 1,
          flexible_resources: 1,
          income_focused: 1,
          present_oriented: 1
        }
      },
      {
        id: "future_20",
        text: "How do you visualize success in your future?",
        type: "open",
        traits: {
          success_vision: 1,
          values_alignment: 1
        }
      }
    ]
  }
];

// Ikigai test data from the provided JSON structure
export const ikigaiTestBlocks = [
  {
    id: 1,
    titulo: "Lo que te encanta hacer",
    description: "Descubre tus gustos y conexiones con tus pasiones",
    preguntas: [
      {
        id: "1.1",
        pregunta: "¿Con qué actividades disfrutas tanto que sientes que el tiempo vuela?",
        tipo: "multiple",
        maxOpciones: 3,
        opciones: [
          "Dibujar; imaginar; crear tus propias cosas nuevas",
          "Exponer ante el público; contar historias; hablar en voz alta; escribir tus ideas y pensamientos",
          "Resolver acertijos, retos o problemas; intentar entender cómo funcionan las cosas",
          "Escuchar y ayudar o apoyar a otras personas",
          "Moverte al aire libre; hacer deporte",
          "Investigar, intentar aprender y comprender cosas nuevas",
          "Conectar en calma contigo mismo, pensar, observar y reflexionar. Estar a solas",
          "Organizar y ordenar cosas. Planificar tareas y organizar planes y actividades",
          "Otro"
        ],
        traits: {
          creativo: 3,
          comunicador: 3,
          analitico: 3,
          social: 3,
          activo: 3,
          investigador: 3,
          reflexivo: 3,
          organizador: 3
        }
      },
      {
        id: "1.2",
        pregunta: "Piensa en lo que estás haciendo cuando te lo estás pasando bien, ¿qué es?",
        tipo: "multiple",
        maxOpciones: 3,
        opciones: [
          "Charlando con alguien con quien me lo paso bien",
          "Leyendo, escuchando música, viendo una peli",
          "Estando tranquilamente pensando; estando a solas",
          "Creando algo mío; dibujando o escribiendo",
          "Haciendo deporte, paseando al aire libre o bailando",
          "Aprendiendo cosas nuevas que me daban curiosidad",
          "Haciendo planes, cuadrando cosas o ayudando a que algo pueda organizarse",
          "Ayudando o apoyando a algún amigo, compañero, o alguien que lo necesita",
          "Riéndome con las bromas, contando chistes o historias graciosas, haciendo el tonto",
          "Otro"
        ],
        traits: {
          social: 3,
          receptor: 3,
          reflexivo: 3,
          creativo: 3, 
          activo: 3,
          investigador: 3,
          organizador: 3,
          empático: 3,
          divertido: 3
        }
      },
      {
        id: "1.3",
        pregunta: "Completa la frase, una de las cosas que me encantaría poder hacer algún día es:",
        tipo: "abierta",
        traits: {
          aspiraciones: 5
        }
      },
      {
        id: "1.4",
        pregunta: "¿Qué recuerdas que te encantaba hacer cuando eras pequeño?",
        tipo: "abierta",
        traits: {
          vocacion_innata: 5
        }
      },
      {
        id: "1.5",
        pregunta: "¿Qué cosas sientes que te mueven por dentro?",
        tipo: "multiple",
        maxOpciones: 3,
        opciones: [
          "Imaginar e inventar algo nuevo",
          "Descubrir el por qué de las cosas y aprender por mi cuenta",
          "Expresar y comunicar mis ideas o lo que pienso y siento",
          "Mejorarme a mí mismo y lograr nuevos retos",
          "Sentir que puedo conectar con otras personas y ayudarlas",
          "Que el mundo sea más justo y que haya menos desigualdades",
          "Entender lo que pasa, pensar con más profundidad",
          "Reirme, disfrutar y pasarlo bien sin presión",
          "Sentirme inspirado por historias, personas o ideas",
          "Otro"
        ],
        traits: {
          creativo: 3,
          investigador: 3,
          comunicador: 3,
          autosuperacion: 3,
          empático: 3,
          justicia: 3,
          analitico: 3,
          alegre: 3,
          inspirador: 3
        }
      },
      {
        id: "1.6",
        pregunta: "¿Qué color crees que te representa más?",
        tipo: "unica",
        opciones: [
          {valor: "Amarillo", descripcion: "Energía y alegría interior"},
          {valor: "Azul", descripcion: "Calma, profundidad y sensibilidad"},
          {valor: "Rojo", descripcion: "Pasión, acción y valentía"},
          {valor: "Verde", descripcion: "Naturaleza, equilibrio y armonía"},
          {valor: "Naranja", descripcion: "Creatividad, entusiasmo y movimiento"},
          {valor: "Violeta", descripcion: "Intuición, imaginación y conexión emocional"}
        ],
        traits: {
          personalidad_color: 5
        }
      }
    ]
  },
  {
    id: 2,
    titulo: "Lo que se te da bien",
    description: "Explora tus habilidades y aptitudes naturales",
    preguntas: [
      {
        id: "2.1",
        pregunta: "¿Qué cosas se te suelen dar bien con facilidad?",
        tipo: "multiple",
        maxOpciones: 3,
        opciones: [
          "Hacer resúmenes o esquemas útiles",
          "Explicar algo o resolver una duda a los demás",
          "Montar, configurar o arreglar cosas",
          "Detectar cosas que no están bien, revisar errores",
          "Usar métodos y procedimientos para resolver ejercicios y problemas",
          "Escuchar atentamente, comprender y recordar lo importante",
          "Organizarme bien por mi cuenta cuando tengo muchas tareas, deberes o exámenes",
          "Hacer varias cosas bien a la vez",
          "Saber seguir bien el camino cuando todo el mundo se lía",
          "Otro"
        ],
        traits: {
          sintetizador: 3,
          formador: 3,
          practico: 3,
          detallista: 3,
          metodico: 3,
          atento: 3,
          organizado: 3,
          multitarea: 3,
          enfocado: 3
        }
      },
      {
        id: "2.2",
        pregunta: "¿Para qué tipo de cosas suelen pedirte ayuda los demás?",
        tipo: "abierta",
        subPregunta: "¿Cómo te hace sentir que la gente te pida ayuda?",
        traits: {
          habilidades_reconocidas: 3,
          sentimiento_utilidad: 3
        }
      },
      {
        id: "2.3",
        pregunta: "Del 1 al 5, ¿cómo de fácil se te hace entender estas ramas de conocimiento?",
        tipo: "escala",
        valorMinimo: 1,
        valorMaximo: 5,
        items: [
          "Resolver ejercicios, entender fórmulas, razonar problemas",
          "Leer, escribir textos y expresar ideas con claridad",
          "Entender cómo funcionan las cosas, hacer experimentos y analizar datos",
          "Comprender el pasado y las diferentes culturas y sociedades",
          "Reflexionar, debatir o pensar sobre temas profundos",
          "Aprender nuevas formas de expresión, hablar y entender otros idiomas",
          "Crear nuevas obras, pintando, dibujando, escribiendo, actuando",
          "Coordinarte, moverte, participar y divertirte en actividades físicas",
          "Trabajar, proponer ideas y colaborar en equipo"
        ],
        traits: {
          cientifico_matematico: 1,
          lingüistico: 1,
          cientifico_tecnico: 1,
          humanistico: 1,
          filosofico: 1,
          comunicativo: 1,
          artistico: 1,
          fisico: 1,
          colaborativo: 1
        }
      },
      {
        id: "2.4",
        pregunta: "Cuando trabajas en grupo, ¿qué sueles hacer sin que nadie te lo pida?",
        tipo: "multiple",
        maxOpciones: 2,
        opciones: [
          "Suelo organizar el trabajo y a mis compañeros",
          "Intento pensar ideas para hacerlo más creativo",
          "Soy el que más escribe y completa el proyecto",
          "Presento el trabajo en público, expongo lo que hemos hecho",
          "Intento generar buen clima entre los compañeros para que todos se sientan bien y participen",
          "Ayudo a que el trabajo no se retrase, que se haga sin perder tiempo",
          "Otro"
        ],
        traits: {
          lider: 3,
          creativo: 3,
          ejecutor: 3,
          comunicador: 3,
          facilitador: 3,
          eficiente: 3
        }
      },
      {
        id: "2.5",
        pregunta: "¿Cómo crees que aprendes o entiendes las cosas nuevas más fácilmente?",
        tipo: "multiple",
        maxOpciones: 2,
        opciones: [
          "Viendo ejemplos o vídeos resueltos",
          "Escuchando a alguien que explica bien",
          "Practicando por tu cuenta",
          "Repitiendo muchas veces, memorizando",
          "Explicándoselo a otra persona",
          "Escribiendo varias veces, subrayando",
          "Estudiando entre varios, hablando en grupo",
          "Otro"
        ],
        traits: {
          visual: 3,
          auditivo: 3,
          kinestesico: 3,
          repetitivo: 3,
          formador: 3,
          escritor: 3,
          colaborativo: 3
        }
      },
      {
        id: "2.6",
        pregunta: "Me siento con confianza cuando...",
        tipo: "abierta",
        subPregunta: "Recuerdo que me sentí muy orgulloso y muy contento conmigo mismo cuando...",
        traits: {
          confianza: 3,
          orgullo: 3
        }
      }
    ]
  },
  {
    id: 3,
    titulo: "Lo que el mundo necesita",
    description: "Descubre cómo puedes contribuir a mejorar el mundo",
    preguntas: [
      {
        id: "3.1",
        pregunta: "¿Qué tipo de cosas te remueven más por dentro?",
        tipo: "multiple",
        maxOpciones: 3,
        opciones: [
          "La contaminación",
          "Cuando no se entiende a las personas que sufren en silencio",
          "Cuando alguien tiene menos oportunidades para desarrollarse",
          "Cuando alguien es rechazado por cómo es",
          "Cuando se maltrata a los animales",
          "Cuando las redes sociales hacen daño a las personas",
          "Cuando se desestima la salud mental",
          "Otro"
        ],
        traits: {
          ecologista: 3,
          empatico: 3,
          justicia_social: 3,
          inclusion: 3,
          protector_animales: 3,
          bienestar_digital: 3,
          salud_mental: 3
        }
      },
      {
        id: "3.2",
        pregunta: "¿Te imaginas ayudando a los demás, a los animales o al planeta en un futuro?",
        tipo: "escala",
        valorMinimo: 1,
        valorMaximo: 5,
        subPregunta: "¿Cómo te gustaría ayudar si pudieses?",
        traits: {
          vocacion_ayuda: 3,
          forma_ayuda: 3
        }
      },
      {
        id: "3.3",
        pregunta: "¿Qué tipos de personas te inspiran más?",
        tipo: "multiple",
        maxOpciones: 2,
        opciones: [
          "Quienes enseñan, acompañan y ayudan a crecer a otros",
          "Quienes luchan por superarse a sí mismos cada día",
          "Quienes cuidan de los demás sin esperar nada a cambio",
          "Quienes son capaces de transformar un problema en una solución",
          "Quienes crean belleza y arte, que emocionan y conectan con los demás",
          "Quienes logran unir a personas diferentes con diversos puntos de vista",
          "Quienes nunca se rinden y aprenden siempre",
          "Otro"
        ],
        traits: {
          docente: 3,
          superacion: 3,
          cuidador: 3,
          solucionador: 3,
          artista: 3,
          integrador: 3,
          perseverante: 3
        }
      },
      {
        id: "3.4",
        pregunta: "Si muchas personas fueran como yo, el mundo tendría más...",
        tipo: "abierta",
        traits: {
          aportacion_mundo: 5
        }
      }
    ]
  },
  {
    id: 4,
    titulo: "Por lo que me pueden pagar",
    description: "Explora las posibilidades profesionales y económicas",
    preguntas: [
      {
        id: "4.1",
        pregunta: "¿Qué tipo de cosas te gustaría hacer en un futuro si además pudieses ganarte la vida con ello?",
        tipo: "multiple",
        maxOpciones: 3,
        opciones: [
          "Diseñar, crear o inventar cosas que aún no existen",
          "Transmitir sensaciones e ideas inspiradoras, grabando, escribiendo o hablando",
          "Ayudar a otros a entender, aprender y mejorar",
          "Estar presente para aquellos que necesiten ayuda",
          "Resolver problemas, detectando errores y proponiendo soluciones",
          "Planificar, coordinar y hacer que todo pueda funcionar",
          "Cuidar del entorno y todo lo que lo rodea",
          "Otro"
        ],
        traits: {
          creador: 3,
          comunicador: 3,
          educador: 3,
          cuidador: 3,
          solucionador: 3,
          organizador: 3,
          protector: 3
        }
      },
      {
        id: "4.2",
        pregunta: "¿Cómo te gustaría que te reconocieran en un futuro?",
        tipo: "abierta",
        traits: {
          reconocimiento: 5
        }
      },
      {
        id: "4.3",
        pregunta: "¿Qué características crees que valorarías más cuando piensas en el trabajo en un futuro?",
        tipo: "escala",
        valorMinimo: 1,
        valorMaximo: 5,
        items: [
          "Hacer las cosas a mi manera o con autonomía",
          "Sentir que ayudo y aporto algo útil a otros",
          "Aprender siempre cosas nuevas y poder resolver retos",
          "Tener tranquilidad y estabilidad económica",
          "Poder hacer cosas diferentes, imaginando y creando",
          "Estar con otras personas y no trabajar en soledad"
        ],
        traits: {
          autonomia: 1,
          servicio: 1,
          aprendizaje: 1,
          seguridad: 1,
          creatividad: 1,
          sociabilidad: 1
        }
      },
      {
        id: "4.4",
        pregunta: "¿Alguna vez te has imaginado creando tu propia idea, marca o proyecto?",
        tipo: "escala",
        valorMinimo: 1,
        valorMaximo: 5,
        subPregunta: "¿Cómo crees que podría ser?",
        traits: {
          emprendimiento: 3,
          vision_negocio: 3
        }
      }
    ]
  }
];
