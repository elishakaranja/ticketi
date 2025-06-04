import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const navigate = useNavigate();
    const { user, token } = useAuth();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:5000/events/");
                if (!response.ok) {
                    throw new Error("Failed to fetch events");
                }
                const data = await response.json();
                setEvents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    async function handleDelete(eventId) {
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
    }

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
                            <h3>{event.name}</h3>
                            <p>{event.description}</p>
                            <p>📍 {event.location}</p>
                            <p>📅 {event.date}</p>
                            <p>💰 ${event.price}</p>
                            {event.image && <img src={event.image} alt={event.name} width="100" />}
                            {user && event.user_id === user.id && (
                                <button onClick={() => handleDelete(event.id)} style={{ marginTop: "0.5rem", background: "var(--error-color)" }}>
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
