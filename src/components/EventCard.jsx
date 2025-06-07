import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden transition-all duration-300 hover:shadow-medium hover:translate-y-[-4px] border border-primary-200">
      <div className="relative">
        <img 
          src={event.image_url} 
          alt={event.title}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-4 right-4 bg-accent-300 text-neutral-800 px-4 py-1.5 rounded-full text-sm font-medium">
          ${event.price}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary-200 text-neutral-700">
            {event.category || 'Event'}
          </span>
          <span className="text-sm text-neutral-500">
            {new Date(event.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
        <h3 className="font-display text-xl font-semibold text-neutral-800 mb-3">
          {event.title}
        </h3>
        <p className="text-neutral-600 text-base mb-6 line-clamp-2">
          {event.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-neutral-600">
              {event.location}
            </span>
          </div>
          <Link 
            to={`/events/${event.id}`}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-primary-200 text-primary-600 hover:bg-primary-300 transition-colors duration-200 font-medium text-sm"
          >
            View Details
            <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 