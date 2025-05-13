import { TestResult, Profile } from "@/types";

// Map of 16 personality types based on 16Personalities.com
export const personalityTypes = {
  // Analysts
  'INTJ': { name: 'Architect', nameEs: 'Arquitecto', group: 'Analysts', groupEs: 'Analistas' },
  'INTP': { name: 'Logician', nameEs: 'Lógico', group: 'Analysts', groupEs: 'Analistas' },
  'ENTJ': { name: 'Commander', nameEs: 'Comandante', group: 'Analysts', groupEs: 'Analistas' },
  'ENTP': { name: 'Debater', nameEs: 'Polemista', group: 'Analysts', groupEs: 'Analistas' },
  
  // Diplomats
  'INFJ': { name: 'Advocate', nameEs: 'Defensor', group: 'Diplomats', groupEs: 'Diplomáticos' },
  'INFP': { name: 'Mediator', nameEs: 'Mediador', group: 'Diplomats', groupEs: 'Diplomáticos' },
  'ENFJ': { name: 'Protagonist', nameEs: 'Protagonista', group: 'Diplomats', groupEs: 'Diplomáticos' },
  'ENFP': { name: 'Campaigner', nameEs: 'Activista', group: 'Diplomats', groupEs: 'Diplomáticos' },
  
  // Sentinels
  'ISTJ': { name: 'Logistician', nameEs: 'Logista', group: 'Sentinels', groupEs: 'Centinelas' },
  'ISFJ': { name: 'Defender', nameEs: 'Defensor', group: 'Sentinels', groupEs: 'Centinelas' },
  'ESTJ': { name: 'Executive', nameEs: 'Ejecutivo', group: 'Sentinels', groupEs: 'Centinelas' },
  'ESFJ': { name: 'Consul', nameEs: 'Cónsul', group: 'Sentinels', groupEs: 'Centinelas' },
  
  // Explorers
  'ISTP': { name: 'Virtuoso', nameEs: 'Virtuoso', group: 'Explorers', groupEs: 'Exploradores' },
  'ISFP': { name: 'Adventurer', nameEs: 'Aventurero', group: 'Explorers', groupEs: 'Exploradores' },
  'ESTP': { name: 'Entrepreneur', nameEs: 'Emprendedor', group: 'Explorers', groupEs: 'Exploradores' },
  'ESFP': { name: 'Entertainer', nameEs: 'Animador', group: 'Explorers', groupEs: 'Exploradores' },
};

export const profileTypes = [
  "Innovative Trailblazer",
  "Analytical Problem-Solver",
  "Compassionate Guide",
  "Visionary Strategist",
  "Creative Storyteller",
  "Methodical Craftsperson",
  "Diplomatic Connector",
  "Intuitive Observer"
];

// Updated with MBTI types
export const mockResults: Record<string, TestResult> = {
  "Innovative Trailblazer": {
    profileType: "Innovative Trailblazer",
    mbtiType: "ENTP",
    mbtiGroup: "Analysts",
    skills: [
      "Creative problem-solving",
      "Adaptability",
      "Risk assessment",
      "Pattern recognition",
      "Initiative"
    ],
    interests: [
      "Pioneering new approaches",
      "Technology advancements",
      "Cross-disciplinary exploration",
      "Innovation systems",
      "Experimental processes"
    ],
    similiarPersonalities: [
      "Marie Curie",
      "Steve Jobs",
      "Amelia Earhart",
      "Elon Musk",
      "Ada Lovelace"
    ],
    recommendedProfessions: [
      "Entrepreneur",
      "Research Scientist",
      "Product Designer",
      "Innovation Consultant",
      "Software Developer"
    ],
    advice: "Your pioneering spirit thrives when pushing boundaries. Seek environments that embrace experimentation and provide resources for innovation. Build a network of diverse thinkers to challenge and inspire you.",
    recommendedActivities: [
      "Hackathons and innovation challenges",
      "Cross-disciplinary workshops",
      "Prototyping and testing new ideas",
      "Joining startup communities",
      "Learning emerging technologies"
    ]
  },
  "Analytical Problem-Solver": {
    profileType: "Analytical Problem-Solver",
    mbtiType: "INTJ",
    mbtiGroup: "Analysts",
    skills: [
      "Logical reasoning",
      "Data analysis",
      "Critical thinking",
      "Systematic approach",
      "Attention to detail"
    ],
    interests: [
      "Complex systems",
      "Puzzles and challenges",
      "Efficiency optimization",
      "Information architecture",
      "Process improvement"
    ],
    similiarPersonalities: [
      "Alan Turing",
      "Katherine Johnson",
      "Sherlock Holmes (fictional)",
      "Nikola Tesla",
      "Grace Hopper"
    ],
    recommendedProfessions: [
      "Data Scientist",
      "Systems Engineer",
      "Financial Analyst",
      "Research Methodologist",
      "Logistics Coordinator"
    ],
    advice: "Your analytical mind thrives on solving complex problems. Seek roles where you can dive deep into data and systems to uncover insights others might miss. Develop complementary communication skills to explain your findings clearly to others.",
    recommendedActivities: [
      "Logic puzzles and strategy games",
      "Data visualization projects",
      "System optimization challenges",
      "Debugging complex systems",
      "Analytical writing"
    ]
  },
  "Compassionate Guide": {
    profileType: "Compassionate Guide",
    mbtiType: "ENFJ",
    mbtiGroup: "Diplomats",
    skills: [
      "Empathetic listening",
      "Supportive communication",
      "Conflict resolution",
      "Community building",
      "Emotional intelligence"
    ],
    interests: [
      "Human development",
      "Wellbeing practices",
      "Group dynamics",
      "Supportive systems",
      "Ethical frameworks"
    ],
    similiarPersonalities: [
      "Mahatma Gandhi",
      "Florence Nightingale",
      "Fred Rogers",
      "Jane Goodall",
      "Mother Teresa"
    ],
    recommendedProfessions: [
      "Counselor or Therapist",
      "Human Resources Specialist",
      "Community Organizer",
      "Healthcare Practitioner",
      "Education Specialist"
    ],
    advice: "Your natural empathy makes you an exceptional guide for others. Focus on creating supportive environments while maintaining healthy boundaries. Your impact comes from helping others recognize and develop their own potential.",
    recommendedActivities: [
      "Peer support groups",
      "Mentoring programs",
      "Community service",
      "Conflict mediation",
      "Wellness workshops"
    ]
  },
  "Visionary Strategist": {
    profileType: "Visionary Strategist",
    mbtiType: "ENTJ",
    mbtiGroup: "Analysts",
    skills: [
      "Big-picture thinking",
      "Strategic planning",
      "Trend analysis",
      "Systems thinking",
      "Inspirational leadership"
    ],
    interests: [
      "Future scenarios",
      "Emerging trends",
      "Organizational development",
      "Global systems",
      "Transformational change"
    ],
    similiarPersonalities: [
      "Winston Churchill",
      "Jeff Bezos",
      "Angela Merkel",
      "Nelson Mandela",
      "Oprah Winfrey"
    ],
    recommendedProfessions: [
      "Strategic Consultant",
      "Executive Leadership",
      "Policy Advisor",
      "Futurist",
      "Organizational Developer"
    ],
    advice: "Your ability to see future possibilities is your greatest strength. Develop disciplined approaches to test and refine your visions. Surround yourself with practical implementers who can help bring your ideas to life.",
    recommendedActivities: [
      "Scenario planning workshops",
      "Leadership development programs",
      "Strategic reading and research",
      "Vision-building exercises",
      "Cross-industry networking"
    ]
  }
};

// Updated mock profiles with MBTI types
export const mockProfiles: Profile[] = [
  {
    profileType: "Innovative Trailblazer",
    profileTypeEs: "Pionero Innovador",
    mbtiType: "ENTP",
    mbtiGroup: "Analysts",
    mbtiGroupEs: "Analistas",
    skills: [
      "Creative problem-solving",
      "Design thinking",
      "Innovation mindset",
      "Conceptual thinking",
      "Pattern recognition"
    ],
    skillsEs: [
      "Resolución creativa de problemas",
      "Pensamiento de diseño",
      "Mentalidad innovadora",
      "Pensamiento conceptual",
      "Reconocimiento de patrones"
    ],
    interests: [
      "Designing new solutions",
      "Challenging conventional thinking",
      "Exploring emerging technologies",
      "Connecting seemingly unrelated ideas",
      "Creating original content"
    ],
    interestsEs: [
      "Diseñar nuevas soluciones",
      "Desafiar el pensamiento convencional",
      "Explorar tecnologías emergentes",
      "Conectar ideas aparentemente no relacionadas",
      "Crear contenido original"
    ],
    similarPersonalities: [
      "Leonardo da Vinci",
      "Steve Jobs",
      "Marie Curie",
      "Elon Musk",
      "Frida Kahlo"
    ],
    similarPersonalitiesEs: [
      "Leonardo da Vinci",
      "Steve Jobs",
      "Marie Curie",
      "Elon Musk",
      "Frida Kahlo"
    ],
    recommendedProfessions: [
      "Product Designer",
      "Entrepreneur",
      "Creative Director",
      "R&D Specialist",
      "Innovation Consultant"
    ],
    recommendedProfessionsEs: [
      "Diseñador de Productos",
      "Emprendedor",
      "Director Creativo",
      "Especialista en I+D",
      "Consultor de Innovación"
    ],
    advice: "Your natural ability to see possibilities where others see obstacles is your superpower. Focus on environments that value creativity and innovation. Seek mentors who can help you transform your ideas into tangible results. Consider pairing with detail-oriented people who can help implement your visionary ideas.",
    adviceEs: "Tu capacidad natural para ver posibilidades donde otros ven obstáculos es tu superpoder. Céntrate en entornos que valoren la creatividad y la innovación. Busca mentores que puedan ayudarte a transformar tus ideas en resultados tangibles. Considera asociarte con personas orientadas al detalle que puedan ayudar a implementar tus ideas visionarias.",
    recommendedActivities: [
      "Brainstorming sessions",
      "Design thinking workshops",
      "Innovation challenges",
      "Creative collaborations",
      "Prototyping and testing new ideas"
    ],
    recommendedActivitiesEs: [
      "Sesiones de lluvia de ideas",
      "Talleres de pensamiento de diseño",
      "Desafíos de innovación",
      "Colaboraciones creativas",
      "Creación de prototipos y prueba de nuevas ideas"
    ]
  },
  {
    profileType: "Analytical Problem-Solver",
    profileTypeEs: "Solucionador Analítico de Problemas",
    mbtiType: "INTJ",
    mbtiGroup: "Analysts",
    mbtiGroupEs: "Analistas",
    skills: [
      "Logical reasoning",
      "Data analysis",
      "Critical thinking",
      "System optimization",
      "Strategic planning"
    ],
    skillsEs: [
      "Razonamiento lógico",
      "Análisis de datos",
      "Pensamiento crítico",
      "Optimización de sistemas",
      "Planificación estratégica"
    ],
    interests: [
      "Solving complex problems",
      "Finding patterns in data",
      "Optimizing systems and processes",
      "Understanding how things work",
      "Developing effective strategies"
    ],
    interestsEs: [
      "Resolver problemas complejos",
      "Encontrar patrones en los datos",
      "Optimizar sistemas y procesos",
      "Entender cómo funcionan las cosas",
      "Desarrollar estrategias efectivas"
    ],
    similarPersonalities: [
      "Alan Turing",
      "Albert Einstein",
      "Ada Lovelace",
      "Sherlock Holmes",
      "Katherine Johnson"
    ],
    similarPersonalitiesEs: [
      "Alan Turing",
      "Albert Einstein",
      "Ada Lovelace",
      "Sherlock Holmes",
      "Katherine Johnson"
    ],
    recommendedProfessions: [
      "Data Scientist",
      "Systems Analyst",
      "Research Scientist",
      "Strategy Consultant",
      "Software Engineer"
    ],
    recommendedProfessionsEs: [
      "Científico de Datos",
      "Analista de Sistemas",
      "Investigador Científico",
      "Consultor de Estrategia",
      "Ingeniero de Software"
    ],
    advice: "Your analytical mind excels at finding solutions to complex problems. Look for roles that challenge you intellectually and allow you to dig deep into analysis. Develop your communication skills to effectively share your insights with others who may not process information the same way you do.",
    adviceEs: "Tu mente analítica sobresale en encontrar soluciones a problemas complejos. Busca roles que te desafíen intelectualmente y te permitan profundizar en el análisis. Desarrolla tus habilidades de comunicación para compartir eficazmente tus ideas con otros que pueden no procesar la información de la misma manera que tú.",
    recommendedActivities: [
      "Data analysis projects",
      "Logic puzzles and games",
      "Research and investigation",
      "System design and optimization",
      "Strategic problem-solving workshops"
    ],
    recommendedActivitiesEs: [
      "Proyectos de análisis de datos",
      "Rompecabezas lógicos y juegos",
      "Investigación e indagación",
      "Diseño y optimización de sistemas",
      "Talleres de resolución estratégica de problemas"
    ]
  },
  {
    profileType: "Compassionate Guide",
    profileTypeEs: "Guía Compasivo",
    mbtiType: "ENFJ",
    mbtiGroup: "Diplomats",
    mbtiGroupEs: "Diplomáticos",
    skills: [
      "Empathetic listening",
      "Emotional intelligence",
      "Supportive communication",
      "Community building",
      "Conflict resolution"
    ],
    skillsEs: [
      "Escucha empática",
      "Inteligencia emocional",
      "Comunicación de apoyo",
      "Construcción de comunidad",
      "Resolución de conflictos"
    ],
    interests: [
      "Supporting others' growth",
      "Building meaningful connections",
      "Understanding human behavior",
      "Creating inclusive environments",
      "Promoting emotional well-being"
    ],
    interestsEs: [
      "Apoyar el crecimiento de otros",
      "Construir conexiones significativas",
      "Entender el comportamiento humano",
      "Crear entornos inclusivos",
      "Promover el bienestar emocional"
    ],
    similarPersonalities: [
      "Mahatma Gandhi",
      "Mother Teresa",
      "Carl Rogers",
      "Malala Yousafzai",
      "Martin Luther King Jr."
    ],
    similarPersonalitiesEs: [
      "Mahatma Gandhi",
      "Madre Teresa",
      "Carl Rogers",
      "Malala Yousafzai",
      "Martin Luther King Jr."
    ],
    recommendedProfessions: [
      "Counselor or Therapist",
      "Social Worker",
      "Community Organizer",
      "Human Resources Specialist",
      "Teacher or Mentor"
    ],
    recommendedProfessionsEs: [
      "Consejero o Terapeuta",
      "Trabajador Social",
      "Organizador Comunitario",
      "Especialista en Recursos Humanos",
      "Profesor o Mentor"
    ],
    advice: "Your natural ability to connect with others and create supportive environments is increasingly valuable in our complex world. Seek roles where you can use your empathetic skills to help others thrive. Be mindful of maintaining boundaries to prevent compassion fatigue.",
    adviceEs: "Tu capacidad natural para conectar con otros y crear entornos de apoyo es cada vez más valiosa en nuestro mundo complejo. Busca roles donde puedas usar tus habilidades empáticas para ayudar a otros a prosperar. Ten cuidado de mantener límites para prevenir la fatiga por compasión.",
    recommendedActivities: [
      "Peer support programs",
      "Community service projects",
      "Emotional intelligence workshops",
      "Conflict resolution training",
      "Mentoring relationships"
    ],
    recommendedActivitiesEs: [
      "Programas de apoyo entre pares",
      "Proyectos de servicio comunitario",
      "Talleres de inteligencia emocional",
      "Formación en resolución de conflictos",
      "Relaciones de mentoría"
    ]
  },
  {
    profileType: "Strategic Organizer",
    profileTypeEs: "Organizador Estratégico",
    mbtiType: "ESTJ",
    mbtiGroup: "Sentinels",
    mbtiGroupEs: "Centinelas",
    skills: [
      "Project management",
      "Systematic planning",
      "Resource optimization",
      "Process improvement",
      "Operational excellence"
    ],
    skillsEs: [
      "Gestión de proyectos",
      "Planificación sistemática",
      "Optimización de recursos",
      "Mejora de procesos",
      "Excelencia operativa"
    ],
    interests: [
      "Creating efficient systems",
      "Implementing structured processes",
      "Managing complex projects",
      "Coordinating teams and resources",
      "Planning and executing strategies"
    ],
    interestsEs: [
      "Crear sistemas eficientes",
      "Implementar procesos estructurados",
      "Gestionar proyectos complejos",
      "Coordinar equipos y recursos",
      "Planificar y ejecutar estrategias"
    ],
    similarPersonalities: [
      "Henry Ford",
      "Angela Merkel",
      "Benjamin Franklin",
      "Indra Nooyi",
      "Dwight D. Eisenhower"
    ],
    similarPersonalitiesEs: [
      "Henry Ford",
      "Angela Merkel",
      "Benjamin Franklin",
      "Indra Nooyi",
      "Dwight D. Eisenhower"
    ],
    recommendedProfessions: [
      "Project Manager",
      "Operations Director",
      "Business Analyst",
      "Logistics Coordinator",
      "Process Improvement Specialist"
    ],
    recommendedProfessionsEs: [
      "Director de Proyectos",
      "Director de Operaciones",
      "Analista de Negocios",
      "Coordinador de Logística",
      "Especialista en Mejora de Procesos"
    ],
    advice: "Your ability to bring order to chaos and create effective systems is invaluable in any organization. Look for opportunities where you can apply your organizational talents to complex challenges. Consider developing more flexibility to adapt when plans need to change.",
    adviceEs: "Tu capacidad para traer orden al caos y crear sistemas efectivos es invaluable en cualquier organización. Busca oportunidades donde puedas aplicar tus talentos organizativos a desafíos complejos. Considera desarrollar más flexibilidad para adaptarte cuando los planes necesiten cambiar.",
    recommendedActivities: [
      "Project planning and management",
      "Process improvement initiatives",
      "Team coordination activities",
      "Resource allocation exercises",
      "Strategic planning sessions"
    ],
    recommendedActivitiesEs: [
      "Planificación y gestión de proyectos",
      "Iniciativas de mejora de procesos",
      "Actividades de coordinación de equipos",
      "Ejercicios de asignación de recursos",
      "Sesiones de planificación estratégica"
    ]
  },
  {
    profileType: "Inspiring Communicator",
    profileTypeEs: "Comunicador Inspirador",
    mbtiType: "ENFP",
    mbtiGroup: "Diplomats",
    mbtiGroupEs: "Diplomáticos",
    skills: [
      "Persuasive communication",
      "Storytelling",
      "Public speaking",
      "Content creation",
      "Audience engagement"
    ],
    skillsEs: [
      "Comunicación persuasiva",
      "Narración de historias",
      "Hablar en público",
      "Creación de contenido",
      "Participación de la audiencia"
    ],
    interests: [
      "Sharing compelling stories",
      "Influencing and inspiring others",
      "Creating engaging content",
      "Public speaking and presentation",
      "Building communities around ideas"
    ],
    interestsEs: [
      "Compartir historias convincentes",
      "Influir e inspirar a otros",
      "Crear contenido atractivo",
      "Hablar en público y presentar",
      "Construir comunidades alrededor de ideas"
    ],
    similarPersonalities: [
      "Maya Angelou",
      "Barack Obama",
      "J.K. Rowling",
      "Oprah Winfrey",
      "Nelson Mandela"
    ],
    similarPersonalitiesEs: [
      "Maya Angelou",
      "Barack Obama",
      "J.K. Rowling",
      "Oprah Winfrey",
      "Nelson Mandela"
    ],
    recommendedProfessions: [
      "Content Creator",
      "Marketing Specialist",
      "Public Relations Manager",
      "Teacher or Trainer",
      "Communications Director"
    ],
    recommendedProfessionsEs: [
      "Creador de Contenido",
      "Especialista en Marketing",
      "Gerente de Relaciones Públicas",
      "Profesor o Formador",
      "Director de Comunicaciones"
    ],
    advice: "Your ability to communicate ideas and inspire others is a powerful talent. Seek opportunities where you can use your voice to make a difference. Develop deep knowledge in areas you're passionate about to add substance to your compelling delivery style.",
    adviceEs: "Tu capacidad para comunicar ideas e inspirar a otros es un talento poderoso. Busca oportunidades donde puedas usar tu voz para marcar la diferencia. Desarrolla un conocimiento profundo en áreas que te apasionen para añadir sustancia a tu estilo de comunicación convincente.",
    recommendedActivities: [
      "Public speaking opportunities",
      "Content creation projects",
      "Storytelling workshops",
      "Community building initiatives",
      "Teaching and training sessions"
    ],
    recommendedActivitiesEs: [
      "Oportunidades para hablar en público",
      "Proyectos de creación de contenido",
      "Talleres de narración de historias",
      "Iniciativas de construcción de comunidad",
      "Sesiones de enseñanza y formación"
    ]
  },
  {
    profileType: "Creative Explorer",
    profileTypeEs: "Explorador Creativo",
    mbtiType: "ISFP",
    mbtiGroup: "Explorers",
    mbtiGroupEs: "Exploradores",
    skills: [
      "Artistic expression",
      "Aesthetic design",
      "Experiential learning",
      "Adaptation to new environments",
      "Sensory awareness"
    ],
    skillsEs: [
      "Expresión artística",
      "Diseño estético",
      "Aprendizaje experiencial",
      "Adaptación a nuevos entornos",
      "Conciencia sensorial"
    ],
    interests: [
      "Creative arts and expression",
      "Nature and outdoor experiences",
      "Hands-on craft and design",
      "Cultural exploration",
      "Sensory-rich environments"
    ],
    interestsEs: [
      "Artes creativas y expresión",
      "Naturaleza y experiencias al aire libre",
      "Artesanía y diseño práctico",
      "Exploración cultural",
      "Entornos ricos en experiencias sensoriales"
    ],
    similarPersonalities: [
      "Bob Ross",
      "Frida Kahlo",
      "David Bowie",
      "Paul McCartney",
      "Vincent van Gogh"
    ],
    similarPersonalitiesEs: [
      "Bob Ross",
      "Frida Kahlo",
      "David Bowie",
      "Paul McCartney",
      "Vincent van Gogh"
    ],
    recommendedProfessions: [
      "Artist or Designer",
      "Craftsperson",
      "Photographer",
      "Culinary Artist",
      "Environmental Designer"
    ],
    recommendedProfessionsEs: [
      "Artista o Diseñador",
      "Artesano",
      "Fotógrafo",
      "Artista Culinario",
      "Diseñador Ambiental"
    ],
    advice: "Your natural aesthetic sense and hands-on approach to life can translate into work that brings beauty and meaning to others. Seek environments that value individual expression and allow you to work at your own pace. Look for ways to combine your practical skills with your artistic vision.",
    adviceEs: "Tu sentido estético natural y enfoque práctico de la vida pueden traducirse en un trabajo que aporta belleza y significado a los demás. Busca entornos que valoren la expresión individual y te permitan trabajar a tu propio ritmo. Busca formas de combinar tus habilidades prácticas con tu visión artística.",
    recommendedActivities: [
      "Arts and crafts exploration",
      "Nature photography",
      "Cultural immersion experiences",
      "Hands-on workshops",
      "Sensory-rich activities"
    ],
    recommendedActivitiesEs: [
      "Exploración de artes y manualidades",
      "Fotografía de naturaleza",
      "Experiencias de inmersión cultural",
      "Talleres prácticos",
      "Actividades ricas en experiencias sensoriales"
    ]
  },
  {
    profileType: "Practical Supporter",
    profileTypeEs: "Apoyo Práctico",
    mbtiType: "ISFJ",
    mbtiGroup: "Sentinels",
    mbtiGroupEs: "Centinelas",
    skills: [
      "Attentive observation",
      "Reliable support",
      "Practical problem-solving",
      "Detail management",
      "Needs anticipation"
    ],
    skillsEs: [
      "Observación atenta",
      "Apoyo confiable",
      "Resolución práctica de problemas",
      "Gestión de detalles",
      "Anticipación de necesidades"
    ],
    interests: [
      "Creating comfortable environments",
      "Preserving valuable traditions",
      "Providing reliable support",
      "Nurturing others' wellbeing",
      "Building stability and security"
    ],
    interestsEs: [
      "Crear entornos confortables",
      "Preservar tradiciones valiosas",
      "Proporcionar apoyo confiable",
      "Fomentar el bienestar de los demás",
      "Construir estabilidad y seguridad"
    ],
    similarPersonalities: [
      "Mother Teresa",
      "Rosa Parks",
      "Queen Elizabeth II",
      "Dr. Fauci",
      "Kate Middleton"
    ],
    similarPersonalitiesEs: [
      "Madre Teresa",
      "Rosa Parks",
      "Reina Isabel II",
      "Dr. Fauci",
      "Kate Middleton"
    ],
    recommendedProfessions: [
      "Healthcare Provider",
      "Administrative Specialist",
      "Personal Support Worker",
      "Educational Assistant",
      "Office Manager"
    ],
    recommendedProfessionsEs: [
      "Proveedor de Atención Médica",
      "Especialista Administrativo",
      "Trabajador de Apoyo Personal",
      "Asistente Educativo",
      "Gerente de Oficina"
    ],
    advice: "Your attentiveness to others' needs and practical approach to solving problems create stability in any environment. Seek roles where your reliability and detail-oriented nature are valued. Remember to set boundaries to avoid taking on too much responsibility for others.",
    adviceEs: "Tu atención a las necesidades de los demás y enfoque práctico para resolver problemas crean estabilidad en cualquier entorno. Busca roles donde se valore tu confiabilidad y naturaleza orientada al detalle. Recuerda establecer límites para evitar asumir demasiada responsabilidad por los demás.",
    recommendedActivities: [
      "Community care initiatives",
      "Practical support volunteering",
      "Traditional crafts and skills",
      "Home or environment organization",
      "Wellness support programs"
    ],
    recommendedActivitiesEs: [
      "Iniciativas de cuidado comunitario",
      "Voluntariado de apoyo práctico",
      "Artesanías y habilidades tradicionales",
      "Organización del hogar o entorno",
      "Programas de apoyo al bienestar"
    ]
  }
];
