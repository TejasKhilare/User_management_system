import os
from dotenv import load_dotenv
load_dotenv()
from flask import Flask

from .config import DevelopmentConfig,ProductionConfig,TestingConfig
from .extensions import db, jwt, migrate
from flask_cors import CORS
from flask import send_from_directory
from .errors import register_error_handlers





def create_app():
    app = Flask(__name__)
    env=os.getenv("FLASK_ENV","development")
    if env=="production":
        app.config.from_object(ProductionConfig)
    elif env=="testing":
        app.config.from_object(TestingConfig)
    else:
        app.config.from_object(DevelopmentConfig)
    
    CORS(app)  

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    register_error_handlers(app)

    from .auth.routes import auth_bp
    from .users.routes import users_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)

    
    @app.route("/uploads/<path:filename>")
    def uploaded_files(filename):
        upload_dir = app.config["UPLOAD_FOLDER"]
        return send_from_directory(upload_dir, filename)


    return app
