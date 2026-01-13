from datetime import timedelta
import os

class BaseConfig:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    if not SQLALCHEMY_DATABASE_URI:
        raise RuntimeError("Database URL is not set")

    
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    if not JWT_SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY is not set")
    
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(os.getenv("JWT_ACCESS_EXPIRES_HOURS",3)))


    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "..", "uploads")

class DevelopmentConfig(BaseConfig):
    DEBUG=True
    ENV="development"

class ProductionConfig(BaseConfig):
    DEBUG=False
    ENV="production"
    JWT_ACCESS_TOKEN_EXPIRES=timedelta(minutes=15)

class TestingConfig(BaseConfig):
    TESTING=True
    ENV="testing"
    # Different database for testing
    SQLALCHEMY_DATABASE_URI=os.getenv("TEST_DATABASE_URI","sqlite:///:memory:")
    JWT_ACCESS_TOKEN_EXPIRES=False