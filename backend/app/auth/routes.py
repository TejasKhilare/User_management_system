from flask import Blueprint, request, jsonify
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token

from ..models import User
from ..extensions import db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    required = {"name", "email", "password", "role"}
    if not data or not required.issubset(data):
        return jsonify({"error": "Request body required"}), 400

    if data["role"] not in ["admin", "user"]:
        return jsonify({"error": "Invalid role"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "User already exists"}), 409

    admin_exists = User.query.filter_by(role="admin").first()
    if not admin_exists and data["role"] != "admin":
        return jsonify({"error": "First registration must be admin"}), 403

    if admin_exists and data["role"] == "admin":
        return jsonify({"error": "Only one admin allowed"}), 403

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

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    if not data or not {"email", "password"}.issubset(data):
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not pbkdf2_sha256.verify(data["password"], user.password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful",
        "access_token": token
    }), 200
