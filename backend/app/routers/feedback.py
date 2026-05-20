from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query, status

from app import store
from app.models import (
    DashboardSummaryItem,
    DashboardSummaryResponse,
    ErrorResponse,
    FeedbackCategory,
    FeedbackCreate,
    FeedbackPriority,
    FeedbackRead,
    FeedbackUpdate,
)

router = APIRouter(prefix="/feedback", tags=["feedback"])


@router.post("/", response_model=FeedbackRead, status_code=status.HTTP_201_CREATED, responses={
    400: {"model": ErrorResponse},
})
async def create_feedback(feedback_in: FeedbackCreate) -> FeedbackRead:
    data = feedback_in.model_dump()
    record = store.create_feedback(data)
    return FeedbackRead(**record)


@router.get("/", response_model=List[FeedbackRead])
async def list_feedback(
    category: Optional[FeedbackCategory] = Query(None),
    priority: Optional[FeedbackPriority] = Query(None),
    reviewed: Optional[bool] = Query(None),
) -> List[FeedbackRead]:
    items = store.list_feedback(
        category=category.value if category else None,
        priority=priority.value if priority else None,
        reviewed=reviewed,
    )
    return [FeedbackRead(**item) for item in items]


@router.get("/{feedback_id}", response_model=FeedbackRead, responses={
    404: {"model": ErrorResponse},
})
async def get_feedback(feedback_id: str) -> FeedbackRead:
    record = store.get_feedback(feedback_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": "not_found",
                "message": f"Feedback with id {feedback_id} does not exist",
                "detail": None,
            },
        )
    return FeedbackRead(**record)


@router.put("/{feedback_id}", response_model=FeedbackRead, responses={
    404: {"model": ErrorResponse},
})
async def update_feedback(feedback_id: str, feedback_in: FeedbackUpdate) -> FeedbackRead:
    data = {k: v for k, v in feedback_in.model_dump(exclude_unset=True).items()}
    record = store.update_feedback(feedback_id, data)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": "not_found",
                "message": f"Feedback with id {feedback_id} does not exist",
                "detail": None,
            },
        )
    return FeedbackRead(**record)


@router.delete("/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT, responses={
    404: {"model": ErrorResponse},
})
async def delete_feedback(feedback_id: str) -> None:
    deleted = store.delete_feedback(feedback_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": "not_found",
                "message": f"Feedback with id {feedback_id} does not exist",
                "detail": None,
            },
        )


@router.get("/dashboard/summary", response_model=DashboardSummaryResponse)
async def get_dashboard_summary() -> DashboardSummaryResponse:
    raw = store.dashboard_summary()
    items: list[DashboardSummaryItem] = []
    for category, priorities in raw.items():
        for priority, count in priorities.items():
            items.append(
                DashboardSummaryItem(
                    category=FeedbackCategory(category),
                    priority=FeedbackPriority(priority),
                    count=count,
                )
            )
    return DashboardSummaryResponse(items=items)
