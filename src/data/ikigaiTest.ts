import { QuestionBlock } from "@/types";

// Ikigai test data with translations
export const ikigaiTestBlocks: QuestionBlock[] = [
  {
    id: 1,
    titulo: "Lo que te encanta hacer",
    title: "What you love to do",
    description: "Descubre tus gustos y conexiones con tus pasiones",
    descriptionEn: "Discover your tastes and connections with your passions",
    preguntas: [
      {
        id: "1.1",
        pregunta: "¿Con qué actividades disfrutas tanto que sientes que el tiempo vuela?",
        text: "What activities do you enjoy so much that you feel time flies by?",
        tipo: "multiple",
        type: "multiple-choice",
        maxOpciones: 3,
        maxOptions: 3,
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
        options: [
          "Drawing; imagining; creating your own new things",
          "Presenting to an audience; storytelling; speaking out loud; writing your ideas and thoughts",
          "Solving puzzles, challenges or problems; trying to understand how things work",
          "Listening and helping or supporting other people",
          "Moving outdoors; doing sports",
          "Researching, trying to learn and understand new things",
          "Connecting calmly with yourself, thinking, observing and reflecting. Being alone",
          "Organizing and ordering things. Planning tasks and organizing plans and activities",
          "Other"
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
        text: "Think about what you're doing when you're having a good time, what is it?",
        tipo: "multiple",
        type: "multiple-choice",
        maxOpciones: 3,
        maxOptions: 3,
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
        options: [
          "Chatting with someone I have a good time with",
          "Reading, listening to music, watching a movie",
          "Being quietly thinking; being alone",
          "Creating something of my own; drawing or writing",
          "Playing sports, walking outdoors or dancing",
          "Learning new things that made me curious",
          "Making plans, arranging things or helping something get organized",
          "Helping or supporting a friend, colleague, or someone who needs it",
          "Laughing at jokes, telling jokes or funny stories, acting silly",
          "Other"
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
        text: "Complete the sentence, one of the things I would love to be able to do someday is:",
        tipo: "abierta",
        type: "open",
        traits: {
          aspiraciones: 5
        }
      },
      {
        id: "1.4",
        pregunta: "¿Qué recuerdas que te encantaba hacer cuando eras pequeño?",
        text: "What do you remember loving to do when you were little?",
        tipo: "abierta",
        type: "open",
        traits: {
          vocacion_innata: 5
        }
      },
      {
        id: "1.5",
        pregunta: "¿Qué cosas sientes que te mueven por dentro?",
        text: "What things do you feel move you inside?",
        tipo: "multiple",
        type: "multiple-choice",
        maxOpciones: 3,
        maxOptions: 3,
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
        options: [
          "Imagining and inventing something new",
          "Discovering the why of things and learning on my own",
          "Expressing and communicating my ideas or what I think and feel",
          "Improving myself and achieving new challenges",
          "Feeling that I can connect with others and help them",
          "Making the world more fair and having less inequality",
          "Understanding what happens, thinking more deeply",
          "Laughing, enjoying and having a good time without pressure",
          "Feeling inspired by stories, people or ideas",
          "Other"
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
        text: "What color do you think represents you the most?",
        tipo: "unica",
        type: "multiple-choice",
        opciones: [
          {valor: "Amarillo", descripcion: "Energía y alegría interior"},
          {valor: "Azul", descripcion: "Calma, profundidad y sensibilidad"},
          {valor: "Rojo", descripcion: "Pasión, acción y valentía"},
          {valor: "Verde", descripcion: "Naturaleza, equilibrio y armonía"},
          {valor: "Naranja", descripcion: "Creatividad, entusiasmo y movimiento"},
          {valor: "Violeta", descripcion: "Intuición, imaginación y conexión emocional"}
        ],
        options: [
          {valor: "Yellow", descripcion: "Energy and inner joy"},
          {valor: "Blue", descripcion: "Calm, depth and sensitivity"},
          {valor: "Red", descripcion: "Passion, action and courage"},
          {valor: "Green", descripcion: "Nature, balance and harmony"},
          {valor: "Orange", descripcion: "Creativity, enthusiasm and movement"},
          {valor: "Purple", descripcion: "Intuition, imagination and emotional connection"}
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
    title: "What you're good at",
    description: "Explora tus habilidades y aptitudes naturales",
    descriptionEn: "Explore your skills and natural aptitudes",
    preguntas: [
      {
        id: "2.1",
        pregunta: "¿Qué cosas se te suelen dar bien con facilidad?",
        text: "What things do you tend to be good at easily?",
        tipo: "multiple",
        type: "multiple-choice",
        maxOpciones: 3,
        maxOptions: 3,
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
        options: [
          "Making useful summaries or schemes",
          "Explaining something or resolving doubts for others",
          "Assembling, configuring or fixing things",
          "Detecting things that aren't right, reviewing errors",
          "Using methods and procedures to solve exercises and problems",
          "Listening attentively, understanding and remembering what's important",
          "Organizing well on my own when I have many tasks, homework or exams",
          "Doing several things well at once",
          "Knowing how to stay on track when everyone else gets confused",
          "Other"
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
        text: "What kind of things do others usually ask you for help with?",
        tipo: "abierta",
        type: "open",
        subPregunta: "¿Cómo te hace sentir que la gente te pida ayuda?",
        subQuestion: "How does it make you feel when people ask you for help?",
        traits: {
          habilidades_reconocidas: 3,
          sentimiento_utilidad: 3
        }
      },
      {
        id: "2.3",
        pregunta: "Del 1 al 5, ¿cómo de fácil se te hace entender estas ramas de conocimiento?",
        text: "From 1 to 5, how easy is it for you to understand these branches of knowledge?",
        tipo: "escala",
        type: "scale",
        valorMinimo: 1,
        minValue: 1,
        valorMaximo: 5,
        maxValue: 5,
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
        itemsEn: [
          "Solving exercises, understanding formulas, reasoning through problems",
          "Reading, writing texts and expressing ideas clearly",
          "Understanding how things work, doing experiments and analyzing data",
          "Understanding the past and different cultures and societies",
          "Reflecting, debating or thinking about deep topics",
          "Learning new forms of expression, speaking and understanding other languages",
          "Creating new works, painting, drawing, writing, acting",
          "Coordinating, moving, participating and having fun in physical activities",
          "Working, proposing ideas and collaborating in a team"
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
        text: "When working in a group, what do you tend to do without anyone asking you?",
        tipo: "multiple",
        type: "multiple-choice",
        maxOpciones: 2,
        maxOptions: 2,
        opciones: [
          "Suelo organizar el trabajo y a mis compañeros",
          "Intento pensar ideas para hacerlo más creativo",
          "Soy el que más escribe y completa el proyecto",
          "Presento el trabajo en público, expongo lo que hemos hecho",
          "Intento generar buen clima entre los compañeros para que todos se sientan bien y participen",
          "Ayudo a que el trabajo no se retrase, que se haga sin perder tiempo",
          "Otro"
        ],
        options: [
          "I tend to organize the work and my colleagues",
          "I try to think of ideas to make it more creative",
          "I'm the one who writes the most and completes the project",
          "I present the work in public, I present what we have done",
          "I try to generate a good atmosphere among colleagues so that everyone feels good and participates",
          "I help ensure the work doesn't get delayed, that it gets done without wasting time",
          "Other"
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
        text: "How do you think you learn or understand new things more easily?",
        tipo: "multiple",
        type: "multiple-choice",
        maxOpciones: 2,
        maxOptions: 2,
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
        options: [
          "Watching examples or solved videos",
          "Listening to someone who explains well",
          "Practicing on your own",
          "Repeating many times, memorizing",
          "Explaining it to another person",
          "Writing several times, underlining",
          "Studying with several people, talking in a group",
          "Other"
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
        text: "I feel confident when...",
        tipo: "abierta",
        type: "open",
        subPregunta: "Recuerdo que me sentí muy orgulloso y muy contento conmigo mismo cuando...",
        subQuestion: "I remember feeling very proud and very happy with myself when...",
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
    title: "What the world needs",
    description: "Descubre cómo puedes contribuir a mejorar el mundo",
    descriptionEn: "Discover how you can contribute to making the world better",
    preguntas: [
      {
        id: "3.1",
        pregunta: "¿Qué tipo de cosas te remueven más por dentro?",
        text: "What kind of things move you the most inside?",
        tipo: "multiple",
        type: "multiple-choice",
        maxOpciones: 3,
        maxOptions: 3,
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
        options: [
          "Pollution",
          "When people who suffer in silence are not understood",
          "When someone has fewer opportunities to develop",
          "When someone is rejected for who they are",
          "When animals are mistreated",
          "When social media harms people",
          "When mental health is dismissed",
          "Other"
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
        text: "Can you imagine helping others, animals or the planet in the future?",
        tipo: "escala",
        type: "scale",
        valorMinimo: 1,
        minValue: 1,
        valorMaximo: 5,
        maxValue: 5,
        subPregunta: "¿Cómo te gustaría ayudar si pudieses?",
        subQuestion: "How would you like to help if you could?",
        traits: {
          vocacion_ayuda: 3,
          forma_ayuda: 3
        }
      },
      {
        id: "3.3",
        pregunta: "¿Qué tipos de personas te inspiran más?",
        text: "What types of people inspire you the most?",
        tipo: "multiple",
        type: "multiple-choice",
        maxOpciones: 2,
        maxOptions: 2,
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
        options: [
          "Those who teach, accompany and help others grow",
          "Those who strive to surpass themselves each day",
          "Those who care for others without expecting anything in return",
          "Those who are able to transform a problem into a solution",
          "Those who create beauty and art that move and connect with others",
          "Those who manage to unite different people with diverse points of view",
          "Those who never give up and are always learning",
          "Other"
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
        text: "If many people were like me, the world would have more...",
        tipo: "abierta",
        type: "open",
        traits: {
          aportacion_mundo: 5
        }
      }
    ]
  },
  {
    id: 4,
    titulo: "Por lo que me pueden pagar",
    title: "What you can be paid for",
    description: "Explora las posibilidades profesionales y económicas",
    descriptionEn: "Explore professional and economic possibilities",
    preguntas: [
      {
        id: "4.1",
        pregunta: "¿Qué tipo de cosas te gustaría hacer en un futuro si además pudieses ganarte la vida con ello?",
        text: "What kind of things would you like to do in the future if you could also make a living from it?",
        tipo: "multiple",
        type: "multiple-choice",
        maxOpciones: 3,
        maxOptions: 3,
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
        options: [
          "Design, create or invent things that don't yet exist",
          "Transmit inspiring feelings and ideas, by recording, writing or speaking",
          "Help others understand, learn and improve",
          "Be present for those who need help",
          "Solve problems, detecting errors and proposing solutions",
          "Plan, coordinate and make everything work",
          "Take care of the environment and everything that surrounds it",
          "Other"
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
        text: "How would you like to be recognized in the future?",
        tipo: "abierta",
        type: "open",
        traits: {
          reconocimiento: 5
        }
      },
      {
        id: "4.3",
        pregunta: "¿Qué características crees que valorarías más cuando piensas en el trabajo en un futuro?",
        text: "What characteristics do you think you would value most when thinking about work in the future?",
        tipo: "escala",
        type: "scale",
        valorMinimo: 1,
        minValue: 1,
        valorMaximo: 5,
        maxValue: 5,
        items: [
          "Hacer las cosas a mi manera o con autonomía",
          "Sentir que ayudo y aporto algo útil a otros",
          "Aprender siempre cosas nuevas y poder resolver retos",
          "Tener tranquilidad y estabilidad económica",
          "Poder hacer cosas diferentes, imaginando y creando",
          "Estar con otras personas y no trabajar en soledad"
        ],
        itemsEn: [
          "Doing things my way or with autonomy",
          "Feeling that I help and contribute something useful to others",
          "Always learning new things and being able to solve challenges",
          "Having peace of mind and economic stability",
          "Being able to do different things, imagining and creating",
          "Being with other people and not working in solitude"
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
        text: "Have you ever imagined creating your own idea, brand or project?",
        tipo: "escala",
        type: "scale",
        valorMinimo: 1,
        minValue: 1,
        valorMaximo: 5,
        maxValue: 5,
        subPregunta: "¿Cómo crees que podría ser?",
        subQuestion: "What do you think it could be like?",
        traits: {
          emprendimiento: 3,
          vision_negocio: 3
        }
      }
    ]
  }
]; 