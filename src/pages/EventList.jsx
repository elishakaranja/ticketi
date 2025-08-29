import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EventCard from '../components/EventCard';

function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [ticketStatus, setTicketStatus] = useState({});
    const navigate = useNavigate();
    const { user, token } = useAuth();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch("http://localhost:5000/events/");
            if (!response.ok) throw new Error("Failed to fetch events");
            const data = await response.json();

            // Fetch available tickets for each event
            const eventsWithTickets = await Promise.all(data.map(async (event) => {
                const ticketsResponse = await fetch(`http://localhost:5000/tickets/available/${event.id}`);
                const ticketsData = await ticketsResponse.json();
                return {
                    ...event,
                    availableTickets: ticketsData.available_tickets
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
            const response = await fetch(`http://localhost:5000/events/${eventId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to delete event");
            }
            setEvents(events.filter(event => event.id !== eventId));
        } catch (err) {
            setDeleteError(err.message);
        }
    };

    const handleBuyTicket = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:5000/tickets/purchase/${eventId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.error || "Failed to purchase ticket");
            
            setTicketStatus({
                ...ticketStatus,
                [eventId]: { success: true, message: "Ticket purchased successfully!" }
            });
            
            // Update available tickets count
            setEvents(events.map(event => 
                event.id === eventId 
                    ? { ...event, availableTickets: event.availableTickets - 1 }
                    : event
            ));
        } catch (err) {
            setTicketStatus({
                ...ticketStatus,
                [eventId]: { success: false, message: err.message }
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