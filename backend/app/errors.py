from flask import jsonify
class APIError(Exception):
    status_code=400
    message="Bad request"

    def __init__(self,message=None,status_code=None):
        super().__init__()
        if message is not None:
            self.message=message
        if status_code:
            self.status_code=status_code
        
    def to_response(self):
        return jsonify({
            "success": False,
            "error": self.message
        }), self.status_code
    
class BadRequestError(APIError):
    status_code = 400
    message = "Bad request"


class UnauthorizedError(APIError):
    status_code = 401
    message = "Unauthorized"


class ForbiddenError(APIError):
    status_code = 403
    message = "Forbidden"


class NotFoundError(APIError):
    status_code = 404
    message = "Resource not found"


class ConflictError(APIError):
    status_code = 409
    message = "Conflict"


class InternalServerError(APIError):
    status_code = 500
    message = "Internal server error"


def register_error_handlers(app):
    @app.errorhandler(APIError)
    def handle_api_error(error):
        return error.to_response()

    @app.errorhandler(404)
    def handle_404_error(error):
        return jsonify({
            "success": False,
            "error": "Endpoint not found"
        }), 404

    @app.errorhandler(500)
    def handle_500_error(error):
        return jsonify({
            "success": False,
            "error": "Internal server error"
        }), 500
