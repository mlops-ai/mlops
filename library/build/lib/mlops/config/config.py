import os


class Settings:
    """
    Main settings for MLOps library
    """
    def __init__(self):
        self.url: str = "http://127.0.0.1:8000"
        self.active_project_id = None
        self.active_experiment_id = None
        self.user_name: str = os.getlogin()

    def change_active_project(self, project_id: str):
        self.active_project_id = project_id

    def change_active_experiment(self, experiment_id: str):
        self.active_experiment_id = experiment_id

    def change_username(self, username: str):
        self.user_name = username


settings = Settings()
