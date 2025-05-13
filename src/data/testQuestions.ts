import { QuestionBlock } from "@/types";

export const quickTestBlocks: QuestionBlock[] = [
  {
    id: "mindscape",
    title: "Mindscape Explorers",
    titleEs: "Exploradores del Panorama Mental",
    description: "Discover how you process information and make decisions",
    descriptionEs: "Descubre cómo procesas información y tomas decisiones",
    questions: [
      {
        id: "mindscape_1",
        text: "When solving a complex problem, I prefer to:",
        textEs: "Al resolver un problema complejo, prefiero:",
        type: "multiple-choice",
        options: [
          "Break it down into logical steps",
          "Find creative, unconventional solutions",
          "Discuss it with others to get different perspectives",
          "Trust my instincts and see what feels right"
        ],
        optionsEs: [
          "Dividirlo en pasos lógicos",
          "Encontrar soluciones creativas y no convencionales",
          "Discutirlo con otros para obtener diferentes perspectivas",
          "Confiar en mis instintos y ver qué me parece correcto"
        ],
        traits: {
          analytical: 3,
          creative: 1,
          collaborative: 0,
          intuitive: 0
        },
        mbti_dimension: 'T',
        ikigai_area: 'vocation'
      },
      {
        id: "mindscape_2",
        text: "How do you feel about unexpected changes to your plans?",
        textEs: "¿Cómo te sientes con los cambios inesperados en tus planes?",
        type: "scale",
        minLabel: "I get anxious",
        maxLabel: "I find it exciting",
        minLabelEs: "Me pongo ansioso",
        maxLabelEs: "Me parece emocionante",
        traits: {
          adaptability: 1
        },
        mbti_dimension: 'P',
        ikigai_area: 'passion'
      },
      {
        id: "mindscape_3",
        text: "Describe a time when you came up with a unique solution to a problem:",
        textEs: "Describe un momento en el que se te ocurrió una solución única a un problema:",
        type: "open",
        traits: {
          creative: 1,
          analytical: 1
        },
        mbti_dimension: 'N',
        ikigai_area: 'passion'
      },
      {
        id: "mindscape_4",
        text: "Which statement resonates with you most?",
        textEs: "¿Qué afirmación resuena más contigo?",
        type: "multiple-choice",
        options: [
          "I prefer concrete facts over theoretical concepts",
          "I enjoy exploring abstract ideas and possibilities",
          "I value practical applications over theoretical discussions",
          "I like to understand underlying principles before details"
        ],
        optionsEs: [
          "Prefiero hechos concretos sobre conceptos teóricos",
          "Disfruto explorando ideas y posibilidades abstractas",
          "Valoro las aplicaciones prácticas más que las discusiones teóricas",
          "Me gusta entender los principios subyacentes antes que los detalles"
        ],
        traits: {
          practical: 2,
          conceptual: 2
        },
        mbti_dimension: 'S',
        ikigai_area: 'profession'
      },
      {
        id: "mindscape_5",
        text: "How important is it for you to understand the 'why' behind tasks you're asked to do?",
        textEs: "¿Qué tan importante es para ti entender el 'porqué' detrás de las tareas que se te pide hacer?",
        type: "scale",
        minLabel: "Not important",
        maxLabel: "Very important",
        minLabelEs: "No es importante",
        maxLabelEs: "Muy importante",
        traits: {
          curiosity: 1,
          compliance: 1
        },
        mbti_dimension: 'N',
        ikigai_area: 'mission'
      }
    ]
  },
  {
    id: "social_dynamics",
    title: "Social Compass",
    titleEs: "Brújula Social",
    description: "Understand how you relate to others and navigate social situations",
    descriptionEs: "Comprende cómo te relacionas con los demás y navegas en situaciones sociales",
    questions: [
      {
        id: "social_1",
        text: "After spending time in a large social gathering, I typically feel:",
        textEs: "Después de pasar tiempo en una gran reunión social, normalmente me siento:",
        type: "multiple-choice",
        options: [
          "Energized and excited",
          "Drained and need alone time",
          "It depends on the people involved",
          "Neither particularly energized nor drained"
        ],
        optionsEs: [
          "Energizado y emocionado",
          "Agotado y necesito tiempo a solas",
          "Depende de las personas involucradas",
          "Ni particularmente energizado ni agotado"
        ],
        traits: {
          extroversion: 2,
          introversion: 2
        }
      },
      {
        id: "social_2",
        text: "How comfortable are you taking charge in group situations?",
        textEs: "¿Qué tan cómodo te sientes tomando el mando en situaciones de grupo?",
        type: "scale",
        minLabel: "Very uncomfortable",
        maxLabel: "Very comfortable",
        traits: {
          leadership: 1
        }
      },
      {
        id: "social_3",
        text: "Describe your approach when there's conflict within a group:",
        textEs: "Describe tu enfoque cuando hay conflicto dentro de un grupo:",
        type: "open",
        traits: {
          diplomatic: 1,
          assertive: 1
        }
      },
      {
        id: "social_4",
        text: "In conversations, I tend to:",
        textEs: "En conversaciones, tiendo a:",
        type: "multiple-choice",
        options: [
          "Listen more than I speak",
          "Share my thoughts and opinions freely",
          "Ask lots of questions",
          "Keep the focus on practical matters"
        ],
        optionsEs: [
          "Escuchar más de lo que hablo",
          "Compartir mis pensamientos y opiniones libremente",
          "Hacer muchas preguntas",
          "Mantener el enfoque en asuntos prácticos"
        ],
        traits: {
          listening: 1,
          expressive: 1,
          curious: 1,
          practical: 1
        }
      },
      {
        id: "social_5",
        text: "How important is maintaining harmony in your relationships?",
        textEs: "¿Qué tan importante es mantener la armonía en tus relaciones?",
        type: "scale",
        minLabel: "I prioritize honesty over harmony",
        maxLabel: "Harmony is essential",
        minLabelEs: "Priorizo la honestidad sobre la armonía",
        maxLabelEs: "La armonía es esencial",
        traits: {
          diplomatic: 1,
          direct: 1
        }
      }
    ]
  },
  {
    id: "passion_purpose",
    title: "Passion Pathfinders",
    titleEs: "Exploradores de Pasión",
    description: "Explore what drives you and gives your life meaning",
    descriptionEs: "Explora qué te impulsa y da sentido a tu vida",
    questions: [
      {
        id: "passion_1",
        text: "What activities make you lose track of time?",
        textEs: "¿Qué actividades te hacen perder la noción del tiempo?",
        type: "open",
        traits: {
          flow_state: 1
        }
      },
      {
        id: "passion_2",
        text: "When considering career options, how important is it that your work aligns with your personal values?",
        textEs: "Al considerar opciones de carrera, ¿qué tan importante es que tu trabajo se alinee con tus valores personales?",
        type: "scale",
        minLabel: "Not important",
        maxLabel: "Essential",
        minLabelEs: "No es importante",
        maxLabelEs: "Esencial",
        traits: {
          value_driven: 1,
          pragmatic: 1
        }
      },
      {
        id: "passion_3",
        text: "I feel most fulfilled when:",
        textEs: "Me siento más realizado cuando:",
        type: "multiple-choice",
        options: [
          "I've mastered a difficult skill",
          "I've helped others achieve their goals",
          "I've created something new",
          "I've solved a complex problem"
        ],
        optionsEs: [
          "He dominado una habilidad difícil",
          "He ayudado a otros a lograr sus objetivos",
          "He creado algo nuevo",
          "He resuelto un problema complejo"
        ],
        traits: {
          achievement: 1,
          altruistic: 1,
          creative: 1,
          analytical: 1
        }
      },
      {
        id: "passion_4",
        text: "How important is recognition from others for your work?",
        textEs: "¿Qué tan importante es el reconocimiento de los demás por tu trabajo?",
        type: "scale",
        minLabel: "Not important",
        maxLabel: "Very important",
        minLabelEs: "No es importante",
        maxLabelEs: "Muy importante",
        traits: {
          internal_motivation: 1,
          external_validation: 1
        }
      },
      {
        id: "passion_5",
        text: "Describe something you're passionate about and why it matters to you:",
        textEs: "Describe algo que te apasiona y por qué es importante para ti:",
        type: "open",
        traits: {
          passion_clarity: 1
        }
      }
    ]
  },
  {
    id: "future_vision",
    title: "Future Visionaries",
    description: "Uncover your approach to planning and visualizing your future",
    questions: [
      {
        id: "future_1",
        text: "How far ahead do you typically plan your life?",
        type: "multiple-choice",
        options: [
          "I live mostly in the present",
          "I have rough plans for the next few months",
          "I have clear goals for the next few years",
          "I have a detailed life plan spanning many years"
        ],
        traits: {
          present_focused: 1,
          short_term_planner: 1,
          medium_term_planner: 1,
          long_term_planner: 1
        }
      },
      {
        id: "future_2",
        text: "When facing uncertainty about your future, you typically:",
        type: "multiple-choice",
        options: [
          "Feel anxious and try to establish control",
          "Get excited about the possibilities",
          "Focus on what you can control right now",
          "Seek advice from others who've been there"
        ],
        traits: {
          certainty_seeking: 1,
          possibility_oriented: 1,
          pragmatic: 1,
          guidance_seeking: 1
        }
      },
      {
        id: "future_3",
        text: "How comfortable are you with taking risks?",
        type: "scale",
        minLabel: "Very uncomfortable",
        maxLabel: "Very comfortable",
        traits: {
          risk_averse: 1,
          risk_taking: 1
        }
      },
      {
        id: "future_4",
        text: "Describe your ideal life five years from now:",
        type: "open",
        traits: {
          vision_clarity: 1
        }
      },
      {
        id: "future_5",
        text: "When making important decisions about your future, what factors matter most to you?",
        type: "open",
        traits: {
          decision_making: 1
        }
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
