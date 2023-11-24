# server

[FastAPI](https://fastapi.tiangolo.com/) server for MLOps project. 

## Installation

1. Python 3.9 or higher is required.
2. Create `\venv` inside the `server` folder run `pip install -r requirements.txt` to install all required packages.
3. Run `uvicorn app.app:app --reload` to start the server.

## Usage

Follow to http://localhost:8000/ to see the API Swagger documentation.

## Testing

Change .env file `TESTING` to True. Then follow to `server/app/tests` folder and run `pytest` to run all tests.
Alternatively run tests from your IDE.

## Notes
