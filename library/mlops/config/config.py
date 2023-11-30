import os


class Settings:
    """
    Main settings for MLOps library
    """
    def __init__(self):
        self.url: str = "http://127.0.0.1:8000"
        self.active_project_id = None
        self.active_experiment_id = None
        self.active_model: str = None
        self.user_name: str = self.get_username()

        # mailgun variables
        self.mailgun_domain = None
        self.mailgun_api_key = None
        self.user_email = None
        self.send_emails = False

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

    def change_active_model(self, model_name: str):
        self.active_model = model_name

    def set_mailgun_domain(self, mailgun_domain: str):
        self.mailgun_domain = mailgun_domain

    def set_mailgun_api_key(self, mailgun_api_key: str):
        self.mailgun_api_key = mailgun_api_key

    def set_user_email(self, user_email: str):
        self.user_email = user_email

    def set_send_emails_flag(self, send_emails: bool):
        self.send_emails = send_emails


settings = Settings()
