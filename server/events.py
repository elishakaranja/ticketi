from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from models import db, Event, Ticket, User
from sqlalchemy import or_

events_bp = Blueprint('events', __name__)

def is_valid_date(date_str): #helper function to check if the date is after now
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
        return date > datetime.utcnow()
    except ValueError:
        return False

@events_bp.route('/', methods=['GET'])
def get_events():
    # Get query parameters for filtering
    #allows users to filter/search by keyword or status
    search = request.args.get('search', '') #get the value of search or return '' if not present 
    status = request.args.get('status', 'upcoming')# get the value of status or use "upcoming if not present"
    
    # Base query
    query = Event.query
    
    # Apply filters
    if search:
        query = query.filter(
            or_(
                Event.name.ilike(f'%{search}%'),
                Event.description.ilike(f'%{search}%'),
                Event.location.ilike(f'%{search}%')
            )
        )
    
    if status:
        query = query.filter(Event.status == status)
    
    # Execute query and return results
    events = query.all()
    return jsonify([event.to_dict() for event in events]), 200

@events_bp.route('/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.get_or_404(event_id)
    return jsonify(event.to_dict()), 200


# Create a New Event
@events_bp.route('/', methods=['POST'])
@jwt_required()
def create_event():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        # Validate required fields
        required_fields = ['name', 'location', 'description', 'date', 'price', 'capacity']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400

        # Validate date format
        try:
            event_date = datetime.strptime(data['date'], '%Y-%m-%d %H:%M:%S')
            if event_date <= datetime.utcnow():
                return jsonify({'error': 'Event date must be in the future'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD HH:MM:SS'}), 400

        # Validate price and capacity
        try:
            price = float(data['price'])
            capacity = int(data['capacity'])
            if price < 0:
                return jsonify({'error': 'Price cannot be negative'}), 400
            if capacity <= 0:
                return jsonify({'error': 'Capacity must be greater than 0'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid price or capacity value'}), 400

        # Create new event
        new_event = Event(
            name=data['name'],
            location=data['location'],
            location_lat=data.get('location_lat'),
            location_lng=data.get('location_lng'),
            description=data['description'],
            date=event_date,
            price=price,
            capacity=capacity,
            image=data.get('image'),
            user_id=current_user_id,
            status='upcoming'
        )
        
        db.session.add(new_event)
        db.session.commit()

        # Generate tickets for the event
        tickets = []
        for _ in range(capacity):
            ticket = Ticket(
                event_id=new_event.id,
                price=price,
                status='available'
            )
            tickets.append(ticket)
        
        db.session.bulk_save_objects(tickets)
        db.session.commit()

        return jsonify(new_event.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error creating event: {str(e)}")  # Add server-side logging
        return jsonify({'error': f'Failed to create event: {str(e)}'}), 500

# Update event 
@events_bp.route('/<int:event_id>', methods=['PUT'])
@jwt_required()
def update_event(event_id):
    current_user_id = get_jwt_identity()
    event = Event.query.get_or_404(event_id)

    # Check if user owns the event
    if event.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()

    # Update fields if provided
    if 'name' in data:
        event.name = data['name']
    if 'location' in data:
        event.location = data['location']
    if 'location_lat' in data:
        event.location_lat = data['location_lat']
    if 'location_lng' in data:
        event.location_lng = data['location_lng']
    if 'description' in data:
        event.description = data['description']

        
    if 'date' in data:
        if not is_valid_date(data['date']):
            return jsonify({'error': 'Invalid date'}), 400
        event.date = datetime.strptime(data['date'], '%Y-%m-%d %H:%M:%S')
    if 'price' in data:
        if not isinstance(data['price'], (int, float)) or data['price'] < 0:
            return jsonify({'error': 'Invalid price'}), 400
        event.price = data['price']
    if 'image' in data:
        event.image = data['image']
    if 'status' in data:
        if data['status'] not in ['upcoming', 'ongoing', 'completed']:
            return jsonify({'error': 'Invalid status'}), 400
        event.status = data['status']

    try:
        db.session.commit()
        return jsonify(event.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update event'}), 500

@events_bp.route('/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    current_user_id = get_jwt_identity()
    event = Event.query.get_or_404(event_id)

    # Check if user owns the event
    if event.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    try:
        db.session.delete(event)
        db.session.commit()
        return jsonify({'message': 'Event deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete event'}), 500

@events_bp.route('/my-events', methods=['GET'])
@jwt_required()
def get_my_events():
    current_user_id = get_jwt_identity()
    events = Event.query.filter_by(user_id=current_user_id).all()
    return jsonify([event.to_dict() for event in events]), 200 