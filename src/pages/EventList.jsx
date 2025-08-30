import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EventCard from '../components/EventCard';

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EventCard from '../components/EventCard';
import api from '../api/api';

function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [ticketStatus, setTicketStatus] = useState({});
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await api.get("/events/");
            const eventsWithTickets = await Promise.all(response.data.map(async (event) => {
                const ticketsResponse = await api.get(`/tickets/available/${event.id}`);
                return {
                    ...event,
                    availableTickets: ticketsResponse.data.available_tickets
                };
            }));
            setEvents(eventsWithTickets);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        setDeleteError(null);
        try {
            await api.delete(`/events/${eventId}`);
            setEvents(events.filter(event => event.id !== eventId));
        } catch (err) {
            setDeleteError(err.response?.data?.error || "Failed to delete event");
        }
    };

    const handleBuyTicket = async (eventId) => {
        try {
            await api.post(`/tickets/purchase/${eventId}`);
            setTicketStatus({
                ...ticketStatus,
                [eventId]: { success: true, message: "Ticket purchased successfully!" }
            });
            setEvents(events.map(event => 
                event.id === eventId 
                    ? { ...event, availableTickets: event.availableTickets - 1 }
                    : event
            ));
        } catch (err) {
            setTicketStatus({
                ...ticketStatus,
                [eventId]: { success: false, message: err.response?.data?.error || "Failed to purchase ticket" }
            });
        }
    };

    if (loading) {
        return (
            <div >
                <div ></div>
            </div>
        );
    }

    if (error) {
        return (
            <div >
                <div >
                    <h2 >Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div >
            <h1 >
                Upcoming Events
            </h1>
            
            {/* Search and Filter Section */}
            <div >
                <input
                    type="text"
                    placeholder="Search events..."
                    
                />
                <select >
                    <option value="">All Categories</option>
                    <option value="music">Music</option>
                    <option value="sports">Sports</option>
                    <option value="theater">Theater</option>
                </select>
            </div>

            {/* Responsive Grid */}
            <div >
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
                            </div>

            {/* Empty State */}
            {events.length === 0 && (
                <div >
                    <h3 >
                        No events found
                    </h3>
                </div>
            )}
        </div>
    );
};

export default EventList;