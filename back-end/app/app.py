from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.config import settings
from app.database.init_mongo_db import init_mongo_db
from app.routers.project import router as project_router


app = FastAPI(title=settings.PROJECT_NAME)
app.include_router(project_router, tags=["Project"], prefix="/projects")


# front-end communication purpose
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def app_init():
    """
    Initialize the crucial app components on startup
    """
    await init_mongo_db()


@app.get("/", tags=["Root"])
def root():
    return {"message": "Hello mlops"}
