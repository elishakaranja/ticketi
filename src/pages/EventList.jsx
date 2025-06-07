import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

    return (
        <div className="container">
            <h1>Event List</h1>
            <button onClick={() => navigate("/create-event")}>Create New Event</button>
            {loading ? (
                <p>Loading events...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : events.length === 0 ? (
                <p>No events found.</p>
            ) : (
                <ul>
                    {events.map(event => (
                        <li key={event.id} className="card mb-2">
                            <h3><Link to={`/events/${event.id}`}>{event.name}</Link></h3>
                            <p>{event.description}</p>
                            <p>📍 {event.location}</p>
                            <p>📅 {event.date}</p>
                            <p>💰 ${event.price}</p>
                            <p>🎟️ Available Tickets: {event.availableTickets}</p>
                            {event.image && <img src={event.image} alt={event.name} width="100" />}
                            
                            <div className="button-group">
                                <button onClick={() => navigate(`/events/${event.id}`)}>
                                    View Details
                                </button>
                                
                                {token && event.availableTickets > 0 && (
                                    <button 
                                        onClick={() => handleBuyTicket(event.id)}
                                        disabled={ticketStatus[event.id]?.success}
                                    >
                                        Buy Ticket
                                    </button>
                                )}
                                
                                {token && event.availableTickets === 0 && (
                                    <span className="sold-out">Sold Out</span>
                                )}
                                
                                {!token && (
                                    <span className="login-prompt">Login to buy tickets</span>
                                )}
                            </div>

                            {ticketStatus[event.id] && (
                                <p className={ticketStatus[event.id].success ? "success" : "error"}>
                                    {ticketStatus[event.id].message}
                                </p>
                            )}

                            {user && event.user_id === user.id && (
                                <button 
                                    onClick={() => handleDelete(event.id)} 
                                    style={{ marginTop: "0.5rem", background: "var(--error-color)" }}
                                >
                                    Delete
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
        </div>
    );
}

export default EventList;
