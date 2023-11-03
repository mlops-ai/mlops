import os


class Settings:
    """
    Main settings for MLOps library
    """
    def __init__(self):
        self.url: str = "http://127.0.0.1:8000"
        self.active_project_id = None
        self.active_experiment_id = None
        self.user_name: str = self.get_username()

    @staticmethod
    def get_username():
        # Check if the code is running in a GitHub Actions environment
        if os.getenv('GITHUB_ACTIONS') == 'true':
            return os.getenv('GITHUB_ACTOR')
        else:
            return os.getlogin()

    def change_username(self, username: str):
        self.user_name = username

    def change_active_project(self, project_id: str):
        self.active_project_id = project_id

    def change_active_experiment(self, experiment_id: str):
        self.active_experiment_id = experiment_id


settings = Settings()
