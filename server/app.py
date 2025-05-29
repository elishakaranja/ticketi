import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from datetime import timedelta
from models import db, Event, User
from auth import auth_bp

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://elisha:karanja@localhost/ticketi'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT configuration
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')  # Change this in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Routes
@app.route("/events", methods=["GET"])
def get_events():
    events = Event.query.all()
    return jsonify([event.to_dict() for event in events])

@app.route("/create", methods=["POST"])
def create_event():
    data = request.get_json()
    new_event = Event(
        name=data['name'],
        location=data['location'],
        location_lat=data.get('location_lat'),
        location_lng=data.get('location_lng'),
        description=data['description'],
        date=data['date'],
        price=data['price'],
        image=data.get('image')
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify(new_event.to_dict()), 201

@app.route("/register", methods = ["POST"])
def register_user():
   data = request.get_json()
     #get username and email from the request data
   username = data.get("username")#.get() returns None while data["email"] returns a key error which may break the app so this enables us to handle the error gracefully
   email = data.get("email")
   #validations
   if not username or not email:
      return jsonify({"error": "username and emil are required"}, 400)
   # Check if email is already taken
   existing_user = User.query.filter_by(email=email).first()
   if existing_user:
      return jsonify({"error": "User with this email already exists."}, 409)#409 the client was not able to successfully create or update a resource due to a conflict with the current state of the resource
   new_user = User(username = username, email = email)

   db.session.add(new_user)
   db.session.commit()

   return jsonify(new_user.to_dict()),201
   
@app.route("/login", methods =["POST"])
def login_user():
   data = request.get_json()
   #get email&username
   username = data.get("username")
   email = data.get("email")
   if not username or not email:
      return jsonify({"error": "username and emil are required"}, 400)
   existing_user = User.query.filter_by(email = email).first()
   if not existing_user:
      return jsonify({"error": "No user with this email found."}, 401)#401 unauthorozed

if __name__ == '__main__':
    app.run(debug=True)






