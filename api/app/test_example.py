def example_test_result():
    """
    Ejemplo de un resultado de test para un usuario con perfil INTJ
    """
    return {
        'user_id': 'user_123456',
        'name': 'Juan Pérez',
        'created_at': '2025-05-16T10:30:00Z',
        
        'personality_summary': {
            'mbti_type': 'INTJ',
            'mbti_description': 'The Architect - Imaginative and strategic thinkers, with a plan for everything',
            'top_traits': [
                {
                    'name': 'Analytical',
                    'score': 85,
                    'description': 'Methodically examines information and breaks it down into components'
                },
                {
                    'name': 'Detail Oriented',
                    'score': 92,
                    'description': 'Pays close attention to small details and specifics'
                },
                {
                    'name': 'Organized',
                    'score': 90,
                    'description': 'Methodical approach to tasks and environment with good structure'
                }
            ]
        },
        
        'mbti_analysis': {
            'type': 'INTJ',
            'description': 'The Architect - Imaginative and strategic thinkers, with a plan for everything',
            'scores': {
                'E': 35, 'I': 65,
                'S': 55, 'N': 45,
                'T': 80, 'F': 20,
                'J': 85, 'P': 15
            },
            'dimensions': [
                {
                    'name': 'Extraversion vs. Introversion',
                    'e_score': 35,
                    'i_score': 65,
                    'dominant': 'I',
                    'strength': 30
                },
                {
                    'name': 'Sensing vs. Intuition',
                    's_score': 55,
                    'n_score': 45,
                    'dominant': 'S',
                    'strength': 10
                },
                {
                    'name': 'Thinking vs. Feeling',
                    't_score': 80,
                    'f_score': 20,
                    'dominant': 'T',
                    'strength': 60
                },
                {
                    'name': 'Judging vs. Perceiving',
                    'j_score': 85,
                    'p_score': 15,
                    'dominant': 'J',
                    'strength': 70
                }
            ],
            'famous_people': [
                'Nikola Tesla',
                'Elon Musk',
                'Stephen Hawking',
                'Isaac Newton',
                'Ada Lovelace'
            ],
            'strengths': [
                'Strategic thinking',
                'Independent',
                'Analytical',
                'Determined'
            ],
            'weaknesses': [
                'Overly critical',
                'Perfectionist',
                'Dismissive of emotions',
                'Difficulty connecting'
            ]
        },
        
        'ikigai_analysis': {
            'areas': {
                'passion': {
                    'score': 65,
                    'description': 'What you love - Activities and interests that bring you joy and fulfillment'
                },
                'mission': {
                    'score': 40,
                    'description': 'What the world needs - How your skills and interests can help others and make a positive impact'
                },
                'profession': {
                    'score': 85,
                    'description': 'What you can be paid for - Skills and activities that have economic value in the job market'
                },
                'vocation': {
                    'score': 70,
                    'description': 'What you\'re good at - Your natural talents and abilities that you can develop into expertise'
                }
            },
            'balance': {
                'percentage': 65.0,
                'interpretation': 'Your Ikigai profile shows good balance, with some areas stronger than others. Focus on developing your weaker areas to find greater fulfillment.'
            },
            'strongest_area': 'profession',
            'weakest_area': 'mission',
            'intersections': {
                'passion_mission': {
                    'name': 'Delight & Fulfillment',
                    'score': 52.5,
                    'description': 'What you love and what the world needs - Activities that bring you joy while helping others'
                },
                'mission_profession': {
                    'name': 'Impact & Value',
                    'score': 62.5,
                    'description': 'What the world needs and what you can be paid for - Addressing needs while earning income'
                },
                'profession_vocation': {
                    'name': 'Competence & Security',
                    'score': 77.5,
                    'description': 'What you can be paid for and what you\'re good at - Using your talents to earn a living'
                },
                'vocation_passion': {
                    'name': 'Joyful Mastery',
                    'score': 67.5,
                    'description': 'What you\'re good at and what you love - Activities you enjoy and excel at'
                }
            },
            'ikigai_center': 65.0
        },
        
        'recommendations': {
            'personalities': [
                {
                    'id': 'ada_lovelace',
                    'name': 'Ada Lovelace',
                    'profession': 'Mathematician and Computer Pioneer',
                    'description': 'First computer programmer who worked on Charles Babbage\'s Analytical Engine',
                    'mbti_type': 'INTJ',
                    'image_url': 'https://example.com/ada_lovelace.jpg',
                    'quote': 'The Analytical Engine weaves algebraic patterns, just as the Jacquard loom weaves flowers and leaves.'
                },
                {
                    'id': 'nikola_tesla',
                    'name': 'Nikola Tesla',
                    'profession': 'Inventor and Electrical Engineer',
                    'description': 'Pioneer in electrical engineering and inventor of AC electrical systems',
                    'mbti_type': 'INTJ',
                    'image_url': 'https://example.com/nikola_tesla.jpg',
                    'quote': 'The present is theirs; the future, for which I really worked, is mine.'
                },
                {
                    'id': 'alan_turing',
                    'name': 'Alan Turing',
                    'profession': 'Mathematician and Computer Scientist',
                    'description': 'Father of theoretical computer science and artificial intelligence',
                    'mbti_type': 'INTP',
                    'image_url': 'https://example.com/alan_turing.jpg',
                    'quote': 'Sometimes it is the people no one can imagine anything of who do the things no one can imagine.'
                }
            ],
            'activities': [
                {
                    'id': 'coding_project',
                    'name': 'Personal Coding Project',
                    'description': 'Develop your own software application to solve a problem that interests you',
                    'category': 'Technical',
                    'difficulty': 4,
                    'time_requirement': 'long',
                    'benefits': ['Logical thinking', 'Problem-solving skills', 'Technical expertise'],
                    'ikigai_area': 'profession'
                },
                {
                    'id': 'chess',
                    'name': 'Chess',
                    'description': 'Learn and practice the ancient game of strategy and tactics',
                    'category': 'Intellectual',
                    'difficulty': 3,
                    'time_requirement': 'medium',
                    'benefits': ['Strategic thinking', 'Pattern recognition', 'Patience'],
                    'ikigai_area': 'vocation'
                },
                {
                    'id': 'strategic_planning',
                    'name': 'Strategic Planning',
                    'description': 'Develop long-term goals and plans for achieving them',
                    'category': 'Professional',
                    'difficulty': 3,
                    'time_requirement': 'medium',
                    'benefits': ['Foresight', 'Decision-making', 'Organizational skills'],
                    'ikigai_area': 'profession'
                },
                {
                    'id': 'mindfulness_meditation',
                    'name': 'Mindfulness Meditation',
                    'description': 'Practice focusing on the present moment with acceptance',
                    'category': 'Wellness',
                    'difficulty': 2,
                    'time_requirement': 'short',
                    'benefits': ['Stress reduction', 'Emotional awareness', 'Mental clarity'],
                    'ikigai_area': 'passion'
                },
                {
                    'id': 'volunteer_teaching',
                    'name': 'Volunteer Teaching',
                    'description': 'Share your knowledge and skills with others who need it',
                    'category': 'Community',
                    'difficulty': 3,
                    'time_requirement': 'medium',
                    'benefits': ['Communication skills', 'Empathy', 'Social impact'],
                    'ikigai_area': 'mission'
                }
            ],
            'professions': [
                {
                    'id': 'software_engineer',
                    'name': 'Software Engineer',
                    'description': 'Designs, develops, and maintains software systems',
                    'category': 'Technology',
                    'required_skills': ['Programming', 'Problem solving', 'Logical thinking'],
                    'education_levels': ['Bachelor\'s degree', 'Master\'s degree'],
                    'application_fields': ['Technology', 'Finance', 'Healthcare', 'Entertainment'],
                    'mbti_compatibility': 90
                },
                {
                    'id': 'data_scientist',
                    'name': 'Data Scientist',
                    'description': 'Analyzes complex data to identify patterns and insights that guide strategic decisions',
                    'category': 'Technology',
                    'required_skills': ['Statistical analysis', 'Programming', 'Critical thinking'],
                    'education_levels': ['Bachelor\'s degree', 'Master\'s degree', 'PhD'],
                    'application_fields': ['Technology', 'Healthcare', 'Finance', 'Retail'],
                    'mbti_compatibility': 95
                },
                {
                    'id': 'systems_architect',
                    'name': 'Systems Architect',
                    'description': 'Designs and oversees implementation of complex IT systems',
                    'category': 'Technology',
                    'required_skills': ['System design', 'Technical leadership', 'Problem solving'],
                    'education_levels': ['Bachelor\'s degree', 'Master\'s degree'],
                    'application_fields': ['Technology', 'Finance', 'Government', 'Telecommunications'],
                    'mbti_compatibility': 85
                },
                {
                    'id': 'research_scientist',
                    'name': 'Research Scientist',
                    'description': 'Conducts research to expand knowledge in a specific field',
                    'category': 'Research',
                    'required_skills': ['Analytical thinking', 'Attention to detail', 'Scientific methods'],
                    'education_levels': ['Master\'s degree', 'PhD'],
                    'application_fields': ['Academia', 'Pharmaceuticals', 'Technology', 'Government'],
                    'mbti_compatibility': 80
                }
            ]
        },
        
        'development_areas': [
            {
                'name': 'Emotional Intelligence',
                'current_score': 20,
                'target_score': 60,
                'description': 'Developing emotional intelligence can help balance your analytical strengths.',
                'recommended_activities': [
                    'Mindfulness Meditation',
                    'Social Volunteering',
                    'Art Therapy'
                ]
            },
            {
                'name': 'Mission (What the World Needs)',
                'current_score': 40,
                'target_score': 70,
                'description': 'Developing your Mission area can help you achieve greater life balance and fulfillment.',
                'recommended_activities': [
                    'Volunteer Teaching',
                    'Community Project',
                    'Mentoring'
                ]
            }
        ],
        
        'trait_scores': {
            'curious': 78,
            'analytical': 85,
            'creative': 65,
            'organized': 90,
            'empathetic': 45,
            'nature_oriented': 30,
            'detail_oriented': 92,
            'social': 40,
            'leadership': 75,
            'adaptable': 60,
            'resilient': 80,
            'patient': 55,
            'risk_taking': 35,
            'visionary': 70,
            'innovative': 68,
            'artistic': 40,
            'practical': 85,
            'logical': 90,
            'mathematical': 82,
            'linguistic': 65,
            'musical': 30,
            'kinesthetic': 45,
            'reflective': 75
        },
        
        'mbti_scores': {
            'E': 35, 'I': 65,
            'S': 55, 'N': 45,
            'T': 80, 'F': 20,
            'J': 85, 'P': 15
        },
        
        'ikigai_scores': {
            'passion': 65,
            'mission': 40,
            'profession': 85,
            'vocation': 70
        }
    }