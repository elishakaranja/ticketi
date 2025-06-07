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
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600 text-center">
                    <h2 className="text-2xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Upcoming Events
            </h1>
            
            {/* Search and Filter Section */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search events..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent"
                />
                <select className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500">
                    <option value="">All Categories</option>
                    <option value="music">Music</option>
                    <option value="sports">Sports</option>
                    <option value="theater">Theater</option>
                </select>
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
                            </div>

            {/* Empty State */}
            {events.length === 0 && (
                <div className="text-center py-12">
                    <h3 className="text-xl text-gray-600 dark:text-gray-400">
                        No events found
                    </h3>
                </div>
            )}
        </div>
    );
};

export default EventList;
