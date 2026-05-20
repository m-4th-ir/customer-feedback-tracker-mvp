import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional


FeedbackRecord = Dict[str, Any]


store: Dict[str, Dict[str, FeedbackRecord]] = {
    "feedback": {}
}


def _utcnow_iso() -> str:
    return datetime.utcnow().isoformat() + "Z"


def seed_feedback() -> None:
    if store["feedback"]:
        return

    examples = [
        {
            "title": "Login button not responding",
            "description": "On Chrome 124, clicking the login button does nothing.",
            "category": "bug",
            "priority": "high",
            "reviewed": False,
            "customer_ref": "ACME-001",
            "source": "support_portal",
        },
        {
            "title": "Add dark mode",
            "description": "Our team works late and would love a dark theme.",
            "category": "feature_request",
            "priority": "medium",
            "reviewed": False,
            "customer_ref": "BETA-TEAM",
            "source": "email",
        },
        {
            "title": "Great onboarding experience",
            "description": "The guided tour made setup very easy.",
            "category": "praise",
            "priority": "low",
            "reviewed": True,
            "customer_ref": "GAMMA-ORG",
            "source": "nps_survey",
        },
    ]

    for item in examples:
        create_feedback(item)


def list_feedback(*, category: Optional[str] = None, priority: Optional[str] = None, reviewed: Optional[bool] = None) -> List[FeedbackRecord]:
    items = list(store["feedback"].values())

    if category is not None:
        items = [f for f in items if f["category"] == category]
    if priority is not None:
        items = [f for f in items if f["priority"] == priority]
    if reviewed is not None:
        items = [f for f in items if f["reviewed"] == reviewed]

    items.sort(key=lambda f: f["created_at"], reverse=True)
    return items


def get_feedback(feedback_id: str) -> Optional[FeedbackRecord]:
    return store["feedback"].get(feedback_id)


def create_feedback(data: Dict[str, Any]) -> FeedbackRecord:
    feedback_id = str(uuid.uuid4())
    now = _utcnow_iso()
    record: FeedbackRecord = {
        "id": feedback_id,
        "created_at": now,
        "reviewed": False,
        **data,
    }
    store["feedback"][feedback_id] = record
    return record


def update_feedback(feedback_id: str, data: Dict[str, Any]) -> Optional[FeedbackRecord]:
    existing = store["feedback"].get(feedback_id)
    if not existing:
        return None

    existing.update(data)
    existing["updated_at"] = _utcnow_iso()
    return existing


def delete_feedback(feedback_id: str) -> bool:
    if feedback_id not in store["feedback"]:
        return False
    del store["feedback"][feedback_id]
    return True


def dashboard_summary() -> Dict[str, Dict[str, int]]:
    summary: Dict[str, Dict[str, int]] = {}
    for item in store["feedback"].values():
        if item.get("reviewed"):
            continue
        category = item["category"]
        priority = item["priority"]
        if category not in summary:
            summary[category] = {}
        summary[category][priority] = summary[category].get(priority, 0) + 1
    return summary
