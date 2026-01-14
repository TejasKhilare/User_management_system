from flask import Blueprint, request, jsonify
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token

from ..models import User
from ..extensions import db
from app.errors import (
    BadRequestError,
    ConflictError,
    ForbiddenError,
    UnauthorizedError
)
from app.schemas.auth import RegisterSchema, LoginSchema
from app.schemas.utils import validate_schema



auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = validate_schema(RegisterSchema(),request.json)

    required = {"name", "email", "password", "role"}
    if not data or not required.issubset(data):
        raise BadRequestError("Request body required")

    if data["role"] not in ["admin", "user"]:
        raise BadRequestError("Invalid role")

    if User.query.filter_by(email=data["email"]).first():
        raise ConflictError("User already exists")

    admin_exists = User.query.filter_by(role="admin").first()
    if not admin_exists and data["role"] != "admin":
        raise ForbiddenError("First registration must be admin")

    if admin_exists and data["role"] == "admin":
        raise ForbiddenError("Only one admin allowed")

    hashed_password = pbkdf2_sha256.hash(data["password"])

    user = User(
        name=data["name"],
        email=data["email"],
        password=hashed_password,
        role=data["role"],
        phone=data.get("phone"),
        address=data.get("address")
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"success": True, "message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = validate_schema(LoginSchema(),request.json)

    if not data or not {"email", "password"}.issubset(data):
        raise BadRequestError("Email and password required")

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not pbkdf2_sha256.verify(data["password"], user.password):
        raise UnauthorizedError("Invalid credentials")

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "success": True,
        "message": "Login successful",
        "access_token": token
    }), 200
