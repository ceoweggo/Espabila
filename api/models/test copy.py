from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from bson import ObjectId
from enum import Enum
from dataclasses import dataclass, field

import logging

from database import (
    test_blocks_collection, test_advices_collection, test_people_collection, 
    test_professions_collection, test_skills_collection, test_traits_collection, 
    test_recommended_activities_collection, test_interests_collection
)

# Logger
logger = logging.getLogger(__name__)


class TestResult(BaseModel):
    """Test result model for API responses"""
    question_id: str
    answer: Any = None  # Flexible field for different types of answers
    is_correct: Optional[bool] = True
    time_taken: Optional[float] = None
    
    # Additional fields for specific question types
    answer_id: Optional[str] = None
    score: Optional[float] = None
    traits: Optional[Dict[str, int]] = None  # For mapping with frontend trait system


class ProfileResponse(BaseModel):
    """Profile result model compatible with frontend structures"""
    profileType: str
    profileTypeEs: Optional[str] = None
    mbtiType: Optional[str] = None
    mbtiGroup: Optional[str] = None
    mbtiGroupEs: Optional[str] = None
    skills: List[str] = []
    skillsEs: Optional[List[str]] = []
    interests: List[str] = []
    interestsEs: Optional[List[str]] = []
    similarPersonalities: List[str] = []
    similarPersonalitiesEs: Optional[List[str]] = []
    recommendedProfessions: List[str] = []
    recommendedProfessionsEs: Optional[List[str]] = []
    advice: Optional[str] = None
    adviceEs: Optional[str] = None
    recommendedActivities: List[str] = []
    recommendedActivitiesEs: Optional[List[str]] = []
    ikigai_area: Optional[str] = None
    traits: Optional[Dict[str, int]] = None


class TestAnswerSubmit(BaseModel):
    """Model for submitting test answers"""
    test_id: str
    test_type: str  # 'quick', 'comprehensive', 'ikigai'
    answers: Dict[str, Any]
    language: Optional[str] = "EN"


# Classes for internal processing

class MBTIType(Enum):
    """Myers-Briggs Type Indicator personality types"""
    INTJ = "INTJ"
    INTP = "INTP"
    ENTJ = "ENTJ"
    ENTP = "ENTP"
    INFJ = "INFJ"
    INFP = "INFP"
    ENFJ = "ENFJ"
    ENFP = "ENFP"
    ISTJ = "ISTJ"
    ISFJ = "ISFJ"
    ESTJ = "ESTJ"
    ESFJ = "ESFJ"
    ISTP = "ISTP"
    ISFP = "ISFP"
    ESTP = "ESTP"
    ESFP = "ESFP"


class IkigaiArea(Enum):
    """Ikigai framework areas"""
    PASSION = "passion"
    MISSION = "mission"
    PROFESSION = "profession"
    VOCATION = "vocation"


class QuestionType(Enum):
    """Types of questions supported in the test"""
    MULTIPLE_CHOICE = "multiple-choice"
    MULTIPLE_SELECT = "multiple-select"
    OPEN = "open"
    SCALE = "scale"


class TraitCategory(Enum):
    """Categories for personality traits"""
    COGNITIVE = "Cognitive"
    BEHAVIORAL = "Behavioral"
    EMOTIONAL = "Emotional"
    INTERPERSONAL = "Interpersonal"
    INTEREST = "Interest"


@dataclass
class MBTIAffinity:
    """MBTI dimension affinities for traits"""
    E: int
    I: int
    S: int
    N: int
    T: int
    F: int
    J: int
    P: int


@dataclass
class IkigaiAffinity:
    """Ikigai area affinities for traits"""
    passion: int
    mission: int
    profession: int
    vocation: int


@dataclass
class Trait:
    """Personality trait with various affinities and metadata"""
    id: str
    name: str
    name_es: str
    description: str
    description_es: str
    category: TraitCategory
    category_es: str
    mbti_affinity: MBTIAffinity
    ikigai_affinity: IkigaiAffinity
    opposing_traits: List[str] = field(default_factory=list)


@dataclass
class OptionValue:
    """Values associated with question options"""
    min: Optional[int] = None
    max: Optional[int] = None
    trait_scores: Dict[str, int] = field(default_factory=dict)
    mbti_dimension: Optional[str] = None
    ikigai_area: Optional[str] = None


@dataclass
class Option:
    """Option for multiple choice or multiple select questions"""
    text: str
    text_es: str
    values: OptionValue


@dataclass
class Question:
    """Question model with all metadata"""
    id: str
    text: str
    text_es: str
    type: QuestionType
    options: List[Option] = field(default_factory=list)
    min_value: Optional[int] = None
    max_value: Optional[int] = None
    max_options: Optional[int] = None
    min_label: Optional[str] = None
    max_label: Optional[str] = None
    min_label_es: Optional[str] = None
    max_label_es: Optional[str] = None
    items: List[str] = field(default_factory=list)
    items_es: List[str] = field(default_factory=list)
    item_scale_values: List[List[OptionValue]] = field(default_factory=list)
    keyword_analysis: Optional[Dict[str, List[str]]] = None
    keyword_analysis_es: Optional[Dict[str, List[str]]] = None
    base_traits: Optional[Dict[str, int]] = None
    mbti_dimension: Optional[str] = None
    ikigai_area: Optional[IkigaiArea] = None
    sub_question: Optional[str] = None
    sub_question_es: Optional[str] = None


@dataclass
class QuestionBlock:
    """Block of related questions"""
    id: str
    title: str
    title_es: str
    description: str
    description_es: str
    questions: List[Question]


@dataclass
class TestResponse:
    """User response to a single question"""
    question_id: str
    response: Union[str, List[str], List[int], int, Dict[str, int]]


@dataclass
class UserProfile:
    """Complete user personality profile"""
    id: str
    name: str
    email: str
    created_at: datetime
    trait_scores: Dict[str, int]
    mbti_scores: Dict[str, int]
    mbti_type: MBTIType
    ikigai_scores: Dict[str, int]
    test_responses: List[TestResponse]
    recommendations: Dict[str, List[str]]


@dataclass
class CelebrityProfile:
    """Reference personality profile for famous people"""
    id: str
    name: str
    name_es: str
    description: str
    description_es: str
    profession: str
    profession_es: str
    image_url: str
    trait_scores: Dict[str, int]
    mbti_type: MBTIType
    quote: str
    quote_es: str


@dataclass
class Activity:
    """Recommended activity with relevance to personality traits"""
    id: str
    name: str
    name_es: str
    description: str
    description_es: str
    category: str
    category_es: str
    difficulty: int
    time_requirement: str
    trait_relevance: Dict[str, int]
    mbti_affinity: Dict[str, int]
    ikigai_relevance: Dict[str, int]
    benefits: List[str]
    benefits_es: List[str]

@dataclass
class Profession:
    """Recommended profession with relevance to personality traits"""
    id: str
    name: str
    name_es: str
    description: str
    description_es: str
    category: str
    category_es: str
    trait_relevance: Dict[str, int]
    mbti_affinity: Dict[str, int]
    ikigai_relevance: Dict[str, int]
    required_skills: List[str]
    required_skills_es: List[str]
    education_levels: List[str]
    education_levels_es: List[str]
    application_fields: List[str]
    application_fields_es: List[str]

@dataclass
class Skill:
    """Recommended skill with relevance to personality traits"""
    id: str
    name: str
    name_es: str
    description: str
    description_es: str
    category: str
    category_es: str
    trait_relevance: Dict[str, int]
    mbti_affinity: Dict[str, int]
    ikigai_relevance: Dict[str, int]
    development_activities: List[str]
    development_activities_es: List[str]

@dataclass
class Interest:
    """Recommended interest with relevance to personality traits"""
    id: str
    name: str
    name_es: str
    description: str
    description_es: str
    category: str
    category_es: str
    trait_relevance: Dict[str, int]
    mbti_affinity: Dict[str, int]
    ikigai_relevance: Dict[str, int]
    related_activities: List[str]
    related_activities_es: List[str]
    related_professions: List[str]
    related_professions_es: List[str]

@dataclass
class Advice:
    """Recommended advice with relevance to personality traits"""
    id: str
    title: str
    title_es: str
    description: str
    description_es: str
    target_traits: Dict[str, Any]
    mbti_targets: List[str]
    ikigai_targets: List[str]
    content: List[str]
    content_es: List[str]

@dataclass
class TestResult:
    """Complete test result with analysis and recommendations"""
    user_profile: UserProfile
    trait_summary: Dict[str, Any]
    mbti_analysis: Dict[str, Any]
    ikigai_analysis: Dict[str, Any]
    recommended_personalities: List[CelebrityProfile]
    recommended_activities: List[Activity]
    recommended_professions: List[Profession]
    recommended_skills: List[Skill]
    recommended_interests: List[Interest]
    recommended_advices: List[Advice]
    development_suggestions: Dict[str, Any]


@dataclass
class QuestionResponse:
    """Processed question response with correctness flag"""
    question_id: str
    answer: Any
    is_correct: bool = True


class DataRepository:
    """Data access layer for test-related resources"""
    
    @staticmethod
    def load_traits() -> List[Trait]:
        """Load all personality traits from the database"""
        try:
            traits_data = test_traits_collection.find()
            traits = []
            
            for trait_data in traits_data:
                mbti_affinity = MBTIAffinity(
                    E=trait_data.get('mbti_affinity', {}).get('E', 50),
                    I=trait_data.get('mbti_affinity', {}).get('I', 50),
                    S=trait_data.get('mbti_affinity', {}).get('S', 50),
                    N=trait_data.get('mbti_affinity', {}).get('N', 50),
                    T=trait_data.get('mbti_affinity', {}).get('T', 50),
                    F=trait_data.get('mbti_affinity', {}).get('F', 50),
                    J=trait_data.get('mbti_affinity', {}).get('J', 50),
                    P=trait_data.get('mbti_affinity', {}).get('P', 50)
                )
                
                ikigai_affinity = IkigaiAffinity(
                    passion=trait_data.get('ikigai_affinity', {}).get('passion', 50),
                    mission=trait_data.get('ikigai_affinity', {}).get('mission', 50),
                    profession=trait_data.get('ikigai_affinity', {}).get('profession', 50), 
                    vocation=trait_data.get('ikigai_affinity', {}).get('vocation', 50)
                )
                
                trait = Trait(
                    id=trait_data.get('id', ''),
                    name=trait_data.get('name', ''),
                    name_es=trait_data.get('name_es', ''),
                    description=trait_data.get('description', ''),
                    description_es=trait_data.get('description_es', ''),
                    category=TraitCategory(trait_data.get('category', 'Cognitive')),
                    category_es=trait_data.get('category_es', ''),
                    mbti_affinity=mbti_affinity,
                    ikigai_affinity=ikigai_affinity,
                    opposing_traits=trait_data.get('opposing_traits', [])
                )
                
                traits.append(trait)
                
            return traits
        except Exception as e:
            logger.error(f"Error loading traits: {e}")
            return []
        
    @staticmethod
    def load_question_blocks() -> List[QuestionBlock]:
        """Load question blocks from the database"""
        try:
            blocks_data = test_blocks_collection.find()
            blocks = []
            
            if test_blocks_collection.count_documents({}) == 0:
                return []
            
            for block_data in blocks_data:
                questions = []
                
                for question_data in block_data.get('questions', []):
                    options = []
                    
                    for i, (option_text, option_text_es) in enumerate(zip(
                        question_data.get('options', []),
                        question_data.get('optionsEs', [])
                    )):
                        option_value_data = question_data.get('optionValues', [])[i] if i < len(question_data.get('optionValues', [])) else {}
                        
                        option = Option(
                            text=option_text,
                            text_es=option_text_es,
                            values=OptionValue(
                                trait_scores={k: v for k, v in option_value_data.items() 
                                            if k not in ['mbti_dimension', 'ikigai_area']},
                                mbti_dimension=option_value_data.get('mbti_dimension'),
                                ikigai_area=option_value_data.get('ikigai_area')
                            )
                        )
                        options.append(option)
                    
                    item_scale_values = []
                    for scale_values in question_data.get('itemScaleValues', []):
                        scale_options = []
                        for value_data in scale_values:
                            scale_option = OptionValue(
                                min=value_data.get('min'),
                                max=value_data.get('max'),
                                trait_scores={k: v for k, v in value_data.items() 
                                            if k not in ['min', 'max', 'mbti_dimension', 'ikigai_area']},
                                mbti_dimension=value_data.get('mbti_dimension'),
                                ikigai_area=value_data.get('ikigai_area')
                            )
                            scale_options.append(scale_option)
                        item_scale_values.append(scale_options)
                    
                    question = Question(
                        id=question_data.get('id', ''),
                        text=question_data.get('text', ''),
                        text_es=question_data.get('textEs', ''),
                        type=QuestionType(question_data.get('type', 'multiple-choice')),
                        options=options,
                        min_value=question_data.get('minValue'),
                        max_value=question_data.get('maxValue'),
                        max_options=question_data.get('maxOptions'),
                        min_label=question_data.get('minLabel'),
                        max_label=question_data.get('maxLabel'),
                        min_label_es=question_data.get('minLabelEs'),
                        max_label_es=question_data.get('maxLabelEs'),
                        items=question_data.get('items', []),
                        items_es=question_data.get('itemsEs', []),
                        item_scale_values=item_scale_values,
                        keyword_analysis=question_data.get('keywordAnalysis'),
                        keyword_analysis_es=question_data.get('keywordAnalysisEs'),
                        base_traits=question_data.get('baseTraits'),
                        mbti_dimension=question_data.get('mbti_dimension'),
                        ikigai_area=IkigaiArea(question_data.get('ikigai_area')) if question_data.get('ikigai_area') else None,
                        sub_question=question_data.get('subQuestion'),
                        sub_question_es=question_data.get('subQuestionEs')
                    )
                    
                    questions.append(question)
                
                block = QuestionBlock(
                    id=block_data.get('id', ''),
                    title=block_data.get('title', ''),
                    title_es=block_data.get('titleEs', ''),
                    description=block_data.get('description', ''),
                    description_es=block_data.get('descriptionEs', ''),
                    questions=questions
                )
                
                blocks.append(block)
                
            return blocks
        except Exception as e:
            logger.error(f"Error loading question blocks: {e}")
            return []

    @staticmethod
    def load_celebrities() -> List[CelebrityProfile]:
        """Load celebrity profiles from the database"""
        try:
            celebrities_data = test_people_collection.find()
            celebrities = []
            
            for celeb_data in celebrities_data:
                celebrity = CelebrityProfile(
                    id=celeb_data.get('id', ''),
                    name=celeb_data.get('name', ''),
                    name_es=celeb_data.get('name_es', ''),
                    description=celeb_data.get('description', ''),
                    description_es=celeb_data.get('description_es', ''),
                    profession=celeb_data.get('profession', ''),
                    profession_es=celeb_data.get('profession_es', ''),
                    image_url=celeb_data.get('image_url', ''),
                    trait_scores=celeb_data.get('trait_scores', {}),
                    mbti_type=MBTIType(celeb_data.get('mbti_type', 'INFJ')),
                    quote=celeb_data.get('quote', ''),
                    quote_es=celeb_data.get('quote_es', '')
                )
                
                celebrities.append(celebrity)
                
            return celebrities
        except Exception as e:
            logger.error(f"Error loading celebrities: {e}")
            return []

    @staticmethod
    def load_activities() -> List[Activity]:
        """Load recommended activities from the database"""
        try:
            activities_data = test_recommended_activities_collection.find()
            activities = []
            
            for activity_data in activities_data:
                activity = Activity(
                    id=activity_data.get('id', ''),
                    name=activity_data.get('name', ''),
                    name_es=activity_data.get('name_es', ''),
                    description=activity_data.get('description', ''),
                    description_es=activity_data.get('description_es', ''),
                    category=activity_data.get('category', ''),
                    category_es=activity_data.get('category_es', ''),
                    difficulty=activity_data.get('difficulty', 3),
                    time_requirement=activity_data.get('time_requirement', ''),
                    trait_relevance=activity_data.get('trait_relevance', {}),
                    mbti_affinity=activity_data.get('mbti_affinity', {}),
                    ikigai_relevance=activity_data.get('ikigai_relevance', {}),
                    benefits=activity_data.get('benefits', []),
                    benefits_es=activity_data.get('benefits_es', [])
                )
                
                activities.append(activity)
                
            return activities
        except Exception as e:
            logger.error(f"Error loading activities: {e}")
            return []

    @staticmethod
    def load_professions() -> List[Profession]:
        """Load recommended professions from the database"""
        try:
            professions_data = test_professions_collection.find()
            professions = []
            
            for profession_data in professions_data:
                profession = Profession(
                    id=profession_data.get('id', ''),
                    name=profession_data.get('name', ''),
                    name_es=profession_data.get('name_es', ''),
                    description=profession_data.get('description', ''),
                    description_es=profession_data.get('description_es', ''),
                    category=profession_data.get('category', ''),
                    category_es=profession_data.get('category_es', ''),
                    trait_relevance=profession_data.get('trait_relevance', {}),
                    mbti_affinity=profession_data.get('mbti_affinity', {}),
                    ikigai_relevance=profession_data.get('ikigai_relevance', {}),
                    required_skills=profession_data.get('required_skills', []),
                    required_skills_es=profession_data.get('required_skills_es', []),
                    education_levels=profession_data.get('education_levels', []),
                    education_levels_es=profession_data.get('education_levels_es', []),
                    application_fields=profession_data.get('application_fields', []),
                    application_fields_es=profession_data.get('application_fields_es', [])
                )
                
                professions.append(profession)
                
            return professions
        except Exception as e:
            logger.error(f"Error loading professions: {e}")
            return []

    @staticmethod
    def load_skills() -> List[Dict[str, Any]]:
        """Load skills from the database"""
        try:
            skills_data = test_skills_collection.find()
            skills = []
            
            for skill_data in skills_data:
                skill = {
                    "id": skill_data.get('id', ''),
                    "name": skill_data.get('name', ''),
                    "name_es": skill_data.get('name_es', ''),
                    "description": skill_data.get('description', ''),
                    "description_es": skill_data.get('description_es', ''),
                    "category": skill_data.get('category', ''),
                    "category_es": skill_data.get('category_es', ''),
                    "trait_relevance": skill_data.get('trait_relevance', {}),
                    "mbti_affinity": skill_data.get('mbti_affinity', {}),
                    "ikigai_relevance": skill_data.get('ikigai_relevance', {}),
                    "development_activities": skill_data.get('development_activities', []),
                    "development_activities_es": skill_data.get('development_activities_es', [])
                }
                
                skills.append(skill)
                
            return skills
        except Exception as e:
            logger.error(f"Error loading skills: {e}")
            return []
    
    @staticmethod
    def load_interests() -> List[Dict[str, Any]]:
        """Load interests from the database"""
        try:
            interests_data = test_interests_collection.find()
            interests = []
            
            for interest_data in interests_data:
                interest = {
                    "id": interest_data.get('id', ''),
                    "name": interest_data.get('name', ''),
                    "name_es": interest_data.get('name_es', ''),
                    "description": interest_data.get('description', ''),
                    "description_es": interest_data.get('description_es', ''),
                    "category": interest_data.get('category', ''),
                    "category_es": interest_data.get('category_es', ''),
                    "trait_relevance": interest_data.get('trait_relevance', {}),
                    "mbti_affinity": interest_data.get('mbti_affinity', {}),
                    "ikigai_relevance": interest_data.get('ikigai_relevance', {}),
                    "related_activities": interest_data.get('related_activities', []),
                    "related_activities_es": interest_data.get('related_activities_es', []),
                    "related_professions": interest_data.get('related_professions', []),
                    "related_professions_es": interest_data.get('related_professions_es', [])
                }
                
                interests.append(interest)
                
            return interests
        except Exception as e:
            logger.error(f"Error loading interests: {e}")
            return []
    
    @staticmethod
    def load_advices() -> List[Dict[str, Any]]:
        """Load advice recommendations from the database"""
        try:
            advices_data = test_advices_collection.find()
            advices = []
            
            for advice_data in advices_data:
                advice = {
                    "id": advice_data.get('id', ''),
                    "title": advice_data.get('title', ''),
                    "title_es": advice_data.get('title_es', ''),
                    "description": advice_data.get('description', ''),
                    "description_es": advice_data.get('description_es', ''),
                    "target_traits": advice_data.get('target_traits', {}),
                    "mbti_targets": advice_data.get('mbti_targets', []),
                    "ikigai_targets": advice_data.get('ikigai_targets', []),
                    "content": advice_data.get('content', []),
                    "content_es": advice_data.get('content_es', [])
                }
                
                advices.append(advice)
                
            return advices
        except Exception as e:
            logger.error(f"Error loading advices: {e}")
            return []
    
    @staticmethod
    def save_user_profile(user_profile: UserProfile) -> str:
        """Save the user profile to the database"""
        return user_profile.id

    @staticmethod
    def save_test_result(test_result: TestResult) -> str:
        """Save the test result to the database"""
        return test_result.user_profile.id