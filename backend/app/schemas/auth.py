from marshmallow import Schema,fields,validate

class RegisterSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=2))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    role = fields.Str(required=True, validate=validate.OneOf(["admin", "user"]))
    phone = fields.Str(required=False)
    address = fields.Str(required=False)


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)