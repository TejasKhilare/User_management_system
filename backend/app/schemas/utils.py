from marshmallow import ValidationError
from app.errors import BadRequestError


def validate_schema(schema, data):
    try:
        return schema.load(data)
    except ValidationError as err:
        raise BadRequestError(err.messages)
