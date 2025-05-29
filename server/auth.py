from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import timedelta
from models import db, User
import re

auth_bp = Blueprint('auth', __name__)

def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validate required fields
    required_fields = ['username', 'email', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    # Validate email format
    if not is_valid_email(data['email']):
        return jsonify({'error': 'Invalid email format'}), 400

    # Validate username length
    if len(data['username']) < 3:
        return jsonify({'error': 'Username must be at least 3 characters long'}), 400

    # Validate password strength
    if len(data['password']) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400

    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 409

    # Create new user
    new_user = User(
        username=data['username'],
        email=data['email']
    )
    new_user.password = data['password']  # This will hash the password

    try:
        db.session.add(new_user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(
            identity=new_user.id,
            expires_delta=timedelta(days=1)
        )
        
        return jsonify({
            'message': 'Registration successful',
            'user': new_user.to_dict(),
            'access_token': access_token
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Validate required fields
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400

    # Find user by email
    user = User.query.filter_by(email=data['email']).first()

    # Verify user and password
    if not user or not user.verify_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    # Create access token
    access_token = create_access_token(
        identity=user.id,
        expires_delta=timedelta(days=1)
    )

    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(),
        'access_token': access_token
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    return jsonify(user.to_dict()), 200

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    data = request.get_json()
    
    # Update username if provided
    if 'username' in data:
        if len(data['username']) < 3:
            return jsonify({'error': 'Username must be at least 3 characters long'}), 400
        if User.query.filter_by(username=data['username']).first() and data['username'] != user.username:
            return jsonify({'error': 'Username already taken'}), 409
        user.username = data['username']
    
    # Update password if provided
    if 'password' in data:
        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        user.password = data['password']
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Profile update failed'}), 500 