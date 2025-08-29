import os
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from datetime import timedelta
from models import db, Event, User
from auth import auth_bp
from events import events_bp
from tickets import tickets_bp
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configure logging
if not app.debug:
    log_handler = logging.FileHandler('error.log')
    log_handler.setLevel(logging.ERROR)
    app.logger.addHandler(log_handler)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://elisha:karanja@host.docker.internal/ticketi')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT configuration
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(events_bp, url_prefix='/events')
app.register_blueprint(tickets_bp, url_prefix='/tickets')

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    app.logger.error(f'Internal server error: {error}')
    return jsonify({'error': 'Internal server error'}), 500

# Remove duplicate routes since they are handled in blueprints
if __name__ == '__main__':
    app.run(debug=True)






