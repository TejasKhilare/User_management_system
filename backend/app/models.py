from .extensions import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(10), nullable=False)

    phone = db.Column(db.String(15))
    address = db.Column(db.String(200))
    profile_pic = db.Column(db.String(255))
    document = db.Column(db.String(255))
    age=db.Column(db.Integer,nullable=True)#new column added

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "phone": self.phone,
            "address": self.address,
            "profile_pic": self.profile_pic,
            "document": self.document,
            "age":self.age
        }
