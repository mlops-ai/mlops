from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.config import settings
from app.database.init_mongo_db import init_mongo_db
from app.routers.project import router as project_router
from app.routers.experiment import experiment_router as experiment_router
from app.routers.iteration import iteration_router as iteration_router
from app.routers.dataset import dataset_router as dataset_router
from app.routers.monitored_model import monitored_model_router as monitored_model_router

app = FastAPI(title=settings.PROJECT_NAME)

# front-end communication purpose
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(project_router, tags=["Project"], prefix="/projects")
app.include_router(experiment_router, tags=["Experiment"], prefix="/projects/{project_id}/experiments")
app.include_router(iteration_router, tags=['Iteration'], prefix="/projects/{project_id}/experiments/{experiment_id}/iterations")
app.include_router(dataset_router, tags=["Dataset"], prefix="/datasets")
app.include_router(monitored_model_router, tags=["Monitored model"], prefix="/monitored-models")




@app.on_event("startup")
async def app_init():
    """
    Initialize the crucial app components on startup
    """
    await init_mongo_db()


@app.get("/", tags=["Root"])
def root():
    return {"message": "Hello mlops"}
