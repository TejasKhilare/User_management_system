from flask import Flask
from .config import Config
from .extensions import db, jwt, migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    from .auth.routes import auth_bp
    from .users.routes import users_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)

    return app
