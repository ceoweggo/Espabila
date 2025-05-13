from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime


class TestResult(BaseModel):
    """Test result model"""
    question_id: str
    answer_id: str
    is_correct: bool
    time_taken: Optional[float] = None
    score: Optional[float] = None


class TestCreate(BaseModel):
    """Test creation model"""
    title: str
    description: str
    test_type: str
    category: str
    difficulty: str
    questions: List[Dict[str, Any]]
    duration: Optional[int] = None
    passing_score: Optional[float] = None
    tags: Optional[List[str]] = None


class TestResponse(BaseModel):
    """Test response model"""
    id: str
    user_id: str
    test_id: str
    start_time: datetime
    end_time: Optional[datetime] = None
    total_questions: int
    completed_questions: int
    correct_answers: int
    incorrect_answers: int
    score: float
    status: str
    results: List[Dict[str, Any]] = []
    test_data: Dict[str, Any]
    created_at: datetime
    updated_at: datetime


class TestHistory(BaseModel):
    """Test history model"""
    id: str
    user_id: str
    test_id: str
    test_type: str
    score: float
    start_time: datetime
    end_time: Optional[datetime] = None
    duration: Optional[float] = None
    status: str
    created_at: datetime 