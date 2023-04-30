import os


class Settings:
    """
    Main settings for MLOps library
    """
    url: str = "http://127.0.0.1:8000"
    active_project: str = None
    username: str = os.getlogin()

    def change_active_project(self, project_id: str):
        self.active_project = project_id

    def change_username(self, username: str):
        self.username = username


settings = Settings()
