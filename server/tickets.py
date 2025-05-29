from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from models import db, Event, Ticket, Transaction, User
from sqlalchemy import and_

tickets_bp = Blueprint('tickets', __name__)

@tickets_bp.route('/available/<int:event_id>', methods=['GET'])
def get_available_tickets(event_id):
    """Get available tickets for an event"""
    event = Event.query.get_or_404(event_id)
    available_tickets = Ticket.query.filter_by(
        event_id=event_id,
        status='available'
    ).count()

    return jsonify({
        'event': event.to_dict(),
        'available_tickets': available_tickets
    }), 200

@tickets_bp.route('/purchase/<int:event_id>', methods=['POST'])
@jwt_required()
def purchase_ticket(event_id):
    """Purchase a ticket for an event"""
    current_user_id = get_jwt_identity()
    
    # Get the event
    event = Event.query.get_or_404(event_id)
    
    # Check if event is in the past
    if event.date < datetime.utcnow():
        return jsonify({'error': 'Event has already taken place'}), 400
    
    # Find an available ticket
    ticket = Ticket.query.filter_by(
        event_id=event_id,
        status='available'
    ).first()
    
    if not ticket:
        return jsonify({'error': 'No tickets available'}), 400
    
    try:
        # Update ticket status and ownership
        ticket.status = 'sold'
        ticket.user_id = current_user_id
        ticket.purchase_date = datetime.utcnow()
        
        # Create transaction record
        transaction = Transaction(
            ticket_id=ticket.id,
            seller_id=event.user_id,  # Event creator is the seller
            buyer_id=current_user_id,
            price=ticket.price,
            transaction_type='primary',  # Primary sale
            status='completed'
        )
        
        # Update event's tickets_sold count
        event.tickets_sold += 1
        
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'message': 'Ticket purchased successfully',
            'ticket_id': ticket.id,
            'transaction_id': transaction.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to purchase ticket'}), 500

@tickets_bp.route('/my-tickets', methods=['GET'])
@jwt_required()
def get_my_tickets():
    """Get all tickets owned by the current user"""
    current_user_id = get_jwt_identity()
    
    tickets = Ticket.query.filter_by(user_id=current_user_id).all()
    return jsonify([{
        'ticket_id': ticket.id,
        'event': ticket.event.to_dict(),
        'status': ticket.status,
        'purchase_date': ticket.purchase_date.isoformat() if ticket.purchase_date else None,
        'price': ticket.price,
        'resale_price': ticket.resale_price
    } for ticket in tickets]), 200

@tickets_bp.route('/resell/<int:ticket_id>', methods=['POST'])
@jwt_required()
def resell_ticket(ticket_id):
    """Put a ticket up for resale"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate resale price
    if 'price' not in data or not isinstance(data['price'], (int, float)) or data['price'] < 0:
        return jsonify({'error': 'Invalid resale price'}), 400
    
    # Get the ticket
    ticket = Ticket.query.get_or_404(ticket_id)
    
    # Check ownership
    if ticket.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Check if ticket can be resold
    if ticket.status != 'sold':
        return jsonify({'error': 'Ticket cannot be resold'}), 400
    
    # Check if event hasn't happened yet
    if ticket.event.date < datetime.utcnow():
        return jsonify({'error': 'Event has already taken place'}), 400
    
    try:
        ticket.status = 'resale'
        ticket.resale_price = data['price']
        db.session.commit()
        
        return jsonify({
            'message': 'Ticket listed for resale',
            'ticket_id': ticket.id,
            'resale_price': ticket.resale_price
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to list ticket for resale'}), 500

@tickets_bp.route('/resale/<int:event_id>', methods=['GET'])
def get_resale_tickets(event_id):
    """Get all tickets available for resale for an event"""
    resale_tickets = Ticket.query.filter_by(
        event_id=event_id,
        status='resale'
    ).all()
    
    return jsonify([{
        'ticket_id': ticket.id,
        'original_price': ticket.price,
        'resale_price': ticket.resale_price,
        'seller': ticket.owner.username
    } for ticket in resale_tickets]), 200

@tickets_bp.route('/purchase-resale/<int:ticket_id>', methods=['POST'])
@jwt_required()
def purchase_resale_ticket(ticket_id):
    """Purchase a resale ticket"""
    current_user_id = get_jwt_identity()
    
    # Get the ticket
    ticket = Ticket.query.get_or_404(ticket_id)
    
    # Validate ticket is available for resale
    if ticket.status != 'resale':
        return jsonify({'error': 'Ticket is not available for resale'}), 400
    
    # Check if buyer is not the seller
    if ticket.user_id == current_user_id:
        return jsonify({'error': 'Cannot purchase your own ticket'}), 400
    
    # Check if event hasn't happened yet
    if ticket.event.date < datetime.utcnow():
        return jsonify({'error': 'Event has already taken place'}), 400
    
    try:
        # Create transaction record
        transaction = Transaction(
            ticket_id=ticket.id,
            seller_id=ticket.user_id,
            buyer_id=current_user_id,
            price=ticket.resale_price,
            transaction_type='resale',
            status='completed'
        )
        
        # Update ticket
        ticket.status = 'sold'
        ticket.user_id = current_user_id
        ticket.purchase_date = datetime.utcnow()
        ticket.resale_price = None
        
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'message': 'Resale ticket purchased successfully',
            'ticket_id': ticket.id,
            'transaction_id': transaction.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to purchase resale ticket'}), 500

@tickets_bp.route('/cancel-resale/<int:ticket_id>', methods=['POST'])
@jwt_required()
def cancel_resale(ticket_id):
    """Cancel a ticket's resale listing"""
    current_user_id = get_jwt_identity()
    
    # Get the ticket
    ticket = Ticket.query.get_or_404(ticket_id)
    
    # Check ownership
    if ticket.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Check if ticket is actually on resale
    if ticket.status != 'resale':
        return jsonify({'error': 'Ticket is not listed for resale'}), 400
    
    try:
        ticket.status = 'sold'
        ticket.resale_price = None
        db.session.commit()
        
        return jsonify({
            'message': 'Resale listing cancelled successfully',
            'ticket_id': ticket.id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to cancel resale listing'}), 500 