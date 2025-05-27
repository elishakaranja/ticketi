from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy_serializer import SerializerMixin


db = SQLAlchemy()

class User(db.Model,SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(20), nullable = False )
    email = db.Column(db.String(100), unique = True , nullable = False)

class Event(db.Model,SerializerMixin):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100),nullable = False )#name of event 
    location = db.Column(db.String, nullable = False)#name of the location 
    location_lat = db.Column(db.Float)#for adding map location on event details 
    location_lng = db.Column(db.Float)
    description = db.Column(db.String, nullable = False)  # Add description field
    date = db.Column(db.String, nullable = False)         # Add date field
    price = db.Column(db.Float, nullable = False)         # Add price field
    image = db.Column(db.String)                          # Add image field
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))


class Ticket(db.Model, SerializerMixin):
       __tablename__ = 'tickets'
       
       id = db.Column(db.Integer, primary_key=True)
       event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
       user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
       price = db.Column(db.Float)
       status = db.Column(db.String)  # 'available', 'sold', 'resale'
       created_at = db.Column(db.DateTime)

class Transaction(db.Model, SerializerMixin):
       __tablename__ = 'transactions'
       
       id = db.Column(db.Integer, primary_key=True)
       ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.id'))
       seller_id = db.Column(db.Integer, db.ForeignKey('users.id'))
       buyer_id = db.Column(db.Integer, db.ForeignKey('users.id'))
       price = db.Column(db.Float)
       timestamp = db.Column(db.DateTime)



