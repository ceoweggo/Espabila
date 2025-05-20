from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class SessionResponse(BaseModel):
    """Test session response model updated for frontend compatibility"""
    id: str = Field(alias="_id")
    user_id: str
    test_type: str
    start_time: datetime
    end_time: Optional[datetime] = None
    questions: List = []
    answers: Optional[dict] = []
    completed_questions: Optional[int] = None
    completion_percentage: Optional[float] = None
    status: str  # 'in_progress', 'completed', 'canceled'
    
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True
        
        json_encoders = {
            ObjectId: str
        }
        
        @classmethod
        def from_mongo(cls, data):
            """Convert MongoDB document to this model"""
            if data.get("_id"):
                data["id"] = str(data.pop("_id"))
            if not data.get("updated_at"):
                data["updated_at"] = data.get("created_at")
            return cls(**data)