import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const EventCard = ({ event }) => {
  return (
    <div >
      <div >
        <img 
          src={event.image_url} 
          alt={event.title}
          
        />
        <div >
          ${event.price}
        </div>
      </div>
      <div >
        <div >
          <span >
            {event.category || 'Event'}
          </span>
          <span >
            {new Date(event.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
        <h3 >
          {event.title}
        </h3>
        <p >
          {event.description}
        </p>
        <div >
          <div >
            <svg  fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span >
              {event.location}
            </span>
          </div>
          <Link 
            to={`/events/${event.id}`}
            
          >
            View Details
            <svg  viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;