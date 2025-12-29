import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from ..models import User
from ..extensions import db

users_bp = Blueprint("users", __name__)

def get_current_user():
    return User.query.get(int(get_jwt_identity()))

@users_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200


@users_bp.route("/users/<int:id>", methods=["GET"])
@jwt_required()
def get_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200


@users_bp.route("/users/<int:id>", methods=["PUT"])
@jwt_required()
def replace_user(id):
    data = request.json
    current = get_current_user()

    if not data:
        return jsonify({"error": "Request body required"}), 400

    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if current.role != "admin" and current.id != id:
        return jsonify({"error": "Access denied"}), 403

    if "email" in data:
        existing = User.query.filter_by(email=data["email"]).first()
        if existing and existing.id != id:
            return jsonify({"error": "Email already exists"}), 409

    for field in ["name", "email", "phone", "address"]:
        if field in data:
            setattr(user, field, data[field])

    db.session.commit()
    return jsonify(user.to_dict()), 200


@users_bp.route("/users/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):
    current = get_current_user()
    user = User.query.get(id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if current.role == "admin" and current.id == id:
        return jsonify({"error": "Admin cannot delete himself"}), 403

    if current.role != "admin" and current.id != id:
        return jsonify({"error": "Access denied"}), 403

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200


@users_bp.route("/users/<int:id>/upload", methods=["POST"])
@jwt_required()
def upload_files(id):
    user = User.query.get(id)
    current = get_current_user()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if current.id != id and current.role != "admin":
        return jsonify({"error": "Access denied"}), 403

    profile = request.files.get("profile_pic")
    document = request.files.get("document")

    if profile:
        filename = secure_filename(profile.filename)
        path = os.path.join(current_app.config["UPLOAD_FOLDER"], "profiles", filename)
        profile.save(path)
        user.profile_pic = filename

    if document:
        filename = secure_filename(document.filename)
        path = os.path.join(current_app.config["UPLOAD_FOLDER"], "documents", filename)
        document.save(path)
        user.document = filename

    db.session.commit()
    return jsonify({"message": "Files uploaded successfully"}), 200
