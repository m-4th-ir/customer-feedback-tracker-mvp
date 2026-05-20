from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class FeedbackCategory(str, Enum):
    bug = "bug"
    feature_request = "feature_request"
    praise = "praise"


class FeedbackPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class FeedbackBase(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    category: FeedbackCategory
    priority: FeedbackPriority
    reviewed: Optional[bool] = False
    customer_ref: Optional[str] = None
    source: Optional[str] = None


class FeedbackCreate(FeedbackBase):
    reviewed: Optional[bool] = False


class FeedbackUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = None
    category: Optional[FeedbackCategory] = None
    priority: Optional[FeedbackPriority] = None
    reviewed: Optional[bool] = None
    customer_ref: Optional[str] = None
    source: Optional[str] = None


class FeedbackRead(FeedbackBase):
    id: str
    created_at: str
    updated_at: Optional[str] = None


class DashboardSummaryItem(BaseModel):
    category: FeedbackCategory
    priority: FeedbackPriority
    count: int


class DashboardSummaryResponse(BaseModel):
    items: list[DashboardSummaryItem]


class ErrorResponse(BaseModel):
    error: str
    message: str
    detail: Optional[object] = None
