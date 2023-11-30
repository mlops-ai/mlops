from mlops.config.config import settings
from mlops.exceptions.mailgun import mail_request_failed_exception

from json2html import json2html
import requests
import json


class MailGun:
    """
    Class for sending emails using MailGun API.
    """
    def __init__(
            self
    ):
        self.api_key = settings.mailgun_api_key
        self.domain = settings.mailgun_domain
        self.user_email = settings.user_email

    def _validate_variables(self):
        """
        Utility function for validating variables.
        """
        if self.api_key is None:
            raise ValueError("MailGun API key is not set.")
        if self.domain is None:
            raise ValueError("MailGun domain is not set.")
        if self.user_email is None:
            raise ValueError("User email is not set.")

    def send_tracking_success(self, iteration_response: dict) -> requests.Response:
        """
        Function for sending success tracking (iteration) email.

        Args:
            iteration_response: response from iteration request

        Returns:
            response: response from MailGun API
        """
        self._validate_variables()

        # TODO: substitute with a proper html template later
        html_content = f"""
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <style>
                            body {{
                                font-family: 'Arial', sans-serif;
                                background-color: #f4f4f4;
                                text-align: center;
                                padding: 20px;
                            }}
                            h1 {{
                                color: #2ecc71; /* Green color for success */
                            }}
                            p {{
                                color: #555;
                                font-size: 16px;
                                margin-top: 10px;
                            }}
                            .success-icon {{
                                color: #2ecc71; /* Green color for success */
                                font-size: 50px;
                            }}
                        </style>
                    </head>
                    <body>
                        <div class="success-icon">&#10003;</div>
                        <h1>Iteration Created Successfully!</h1>
                        <p>Your iteration has been successfully created. Here are some details:</p>
                        <div>{json2html.convert(json=json.dumps(iteration_response))}</div>
                    </body>
                    </html>
                    """

        response = requests.post(
            f"https://api.mailgun.net/v3/{self.domain}/messages",
            auth=("api", f"{self.api_key}"),
            data={"from": f"MLOps mailgun <mailgun@{self.domain}>",
                  "to": [f"{self.user_email}"],
                  "subject": "MLOps iteration created successfully",
                  "html": html_content}
        )

        if response.status_code == 200:
            return response
        else:
            raise mail_request_failed_exception(response)

    def send_tracking_failure(self, iteration_exception_response: str) -> requests.Response:
        """
        Function for sending failure tracking (iteration) email.

        Args:
            iteration_exception_response: exception response from iteration request

        Returns:
            response: response from MailGun API
        """
        self._validate_variables()

        # TODO: substitute with a proper html template later
        html_content = f"""
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <style>
                            body {{
                                font-family: 'Arial', sans-serif;
                                background-color: #f4f4f4;
                                text-align: center;
                                padding: 20px;
                            }}
                            h1 {{
                                color: #e74c3c; /* Red color for failure */
                            }}
                            p {{
                                color: #555;
                                font-size: 16px;
                                margin-top: 10px;
                            }}
                            .failure-icon {{
                                color: #e74c3c; /* Red color for failure */
                                font-size: 50px;
                            }}
                            .exception-details {{
                                text-align: left;
                                margin: 10px;
                                padding: 10px;
                                border: 1px solid #ddd;
                                background-color: #fff;
                                overflow: auto;
                            }}
                        </style>
                    </head>
                    <body>
                        <div class="failure-icon">&#10008;</div>
                        <h1>Iteration Failed!</h1>
                        <p>An exception occurred during the iteration. Here are the details:</p>
                        <div class="exception-details">{iteration_exception_response}</div>
                    </body>
                    </html>
                    """

        response = requests.post(
            f"https://api.mailgun.net/v3/{self.domain}/messages",
            auth=("api", f"{self.api_key}"),
            data={"from": f"MLOps mailgun <mailgun@{self.domain}>",
                  "to": [f"{self.user_email}"],
                  "subject": "MLOps iteration failed",
                  "html": html_content}
        )

        if response.status_code == 200:
            return response
        else:
            raise mail_request_failed_exception(response)

    def send_prediction_success(self, prediction_data: dict) -> requests.Response:
        """
        Function for sending prediction success email.

        Args:
            prediction_data: response from send_prediction request

        Returns:
            response: response from MailGun API
        """
        self._validate_variables()

        # TODO: substitute with a proper html template later
        html_content = f"""
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <style>
                            body {{
                                font-family: 'Arial', sans-serif;
                                background-color: #f4f4f4;
                                text-align: center;
                                padding: 20px;
                            }}
                            h1 {{
                                color: #2ecc71; /* Green color for success */
                            }}
                            p {{
                                color: #555;
                                font-size: 16px;
                                margin-top: 10px;
                            }}
                            .success-icon {{
                                color: #2ecc71; /* Green color for success */
                                font-size: 50px;
                            }}
                        </style>
                    </head>
                    <body>
                        <div class="success-icon">&#10003;</div>
                        <h1>Prediction Sent Successfully!</h1>
                        <p>Your prediction has been sent successfully. Here are some details:</p>
                        <div>{json2html.convert(json=json.dumps(prediction_data))}</div>
                    </body>
                    </html>
                    """

        response = requests.post(
            f"https://api.mailgun.net/v3/{self.domain}/messages",
            auth=("api", f"{self.api_key}"),
            data={"from": f"MLOps mailgun <mailgun@{self.domain}>",
                  "to": [f"{self.user_email}"],
                  "subject": "MLOps prediction sent successfully",
                  "html": html_content}
        )

        if response.status_code == 200:
            return response
        else:
            raise mail_request_failed_exception(response)

    def send_prediction_failure(self, prediction_exception_response: str) -> requests.Response:
        """
        Function for sending prediction failure email.

        Args:
            prediction_exception_response: exception response from iteration request

        Returns:
            response: response from MailGun API
        """
        self._validate_variables()

        # TODO: substitute with a proper html template later
        html_content = f"""
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <style>
                            body {{
                                font-family: 'Arial', sans-serif;
                                background-color: #f4f4f4;
                                text-align: center;
                                padding: 20px;
                            }}
                            h1 {{
                                color: #e74c3c; /* Red color for failure */
                            }}
                            p {{
                                color: #555;
                                font-size: 16px;
                                margin-top: 10px;
                            }}
                            .failure-icon {{
                                color: #e74c3c; /* Red color for failure */
                                font-size: 50px;
                            }}
                            .exception-details {{
                                text-align: left;
                                margin: 10px;
                                padding: 10px;
                                border: 1px solid #ddd;
                                background-color: #fff;
                                overflow: auto;
                            }}
                        </style>
                    </head>
                    <body>
                        <div class="failure-icon">&#10008;</div>
                        <h1>Prediction Failed!</h1>
                        <p>An exception occurred during the prediction. Here are the details:</p>
                        <div class="exception-details">{prediction_exception_response}</div>
                    </body>
                    </html>
                    """

        response = requests.post(
            f"https://api.mailgun.net/v3/{self.domain}/messages",
            auth=("api", f"{self.api_key}"),
            data={"from": f"MLOps mailgun <mailgun@{self.domain}>",
                  "to": [f"{self.user_email}"],
                  "subject": "MLOps prediction failed",
                  "html": html_content}
        )

        if response.status_code == 200:
            return response
        else:
            raise mail_request_failed_exception(response)

