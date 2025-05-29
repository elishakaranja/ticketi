import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EventList() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate(); // Add navigation hook

    // Load events from localStorage when the page loads
    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
        setEvents(storedEvents);//adding the evnts in local storge to EventList's state
    }, []);

    // Delete event
    function handleDelete(eventId) {
        const updatedEvents = events.filter(event => event.id !== eventId);
        setEvents(updatedEvents);
        localStorage.setItem("events", JSON.stringify(updatedEvents));
    }

    return (
        <div className="container">
            <h1>Event List</h1>
            <button onClick={() => navigate("/create-event")}>Create New Event</button> {/* Add navigation button */}
            {events.length === 0 ? (
                <p>No events found.</p>
            ) : (
                <ul>
                    {events.map(event => (
                        <li key={event.id}>
                            <h3>{event.name}</h3>
                            <p>{event.description}</p>
                            <p>📍 {event.location}</p>
                            <p>📅 {event.date}</p>
                            <p>💰 ${event.price}</p>
                            {event.image && <img src={event.image} alt={event.name} width="100" />}
                            <button onClick={() => handleDelete(event.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default EventList;
