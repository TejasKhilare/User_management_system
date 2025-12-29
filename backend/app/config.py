from datetime import timedelta
import os

class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:102030@localhost:5432/flask_crud_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = "8f3c9b7e2d4a6c1b9e5f0d7a3c2e8b4f6a9d1c7e5b2a0f4d8c9e3a6b1"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=5)

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "..", "uploads")
