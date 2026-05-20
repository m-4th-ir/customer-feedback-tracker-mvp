from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import feedback
from app.store import seed_feedback


def create_app() -> FastAPI:
    app = FastAPI(title="Customer Feedback Tracker API", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    async def startup_event() -> None:  # type: ignore[func-returns-value]
        seed_feedback()

    @app.get("/health")
    async def health() -> dict:  # type: ignore[func-returns-value]
        return {"status": "ok"}

    app.include_router(feedback.router, prefix="/api/v1")

    return app


app = create_app()
