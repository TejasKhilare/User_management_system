from marshmallow import Schema, fields, validate


class UpdateUserSchema(Schema):
    name = fields.Str(validate=validate.Length(min=2))
    email = fields.Email()
    phone = fields.Str()
    address = fields.Str()
    age = fields.Int(
        validate=validate.Range(min=18, max=60)
    )
