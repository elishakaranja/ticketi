import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
    const navigate = useNavigate(); // Add navigation hook

    // Load saved events from localStorage (or use an empty array if none exist)
    const [events, setEvents] = useState(() => {
        const savedEvents = localStorage.getItem("events");
        return savedEvents ? JSON.parse(savedEvents) : []; //if savedEvents convert from JSON to an array 
    });

    const [formData, setFormData] = useState({
        name: "", description: "", location: "", date: "", price: "", image: ""
    });

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    function handleSubmit(event) {
        event.preventDefault();
        
        const newEvent = {
            id: Date.now(),  // Unique ID 
            name: formData.name,
            description: formData.description,
            location: formData.location,
            date: formData.date,
            price: formData.price,
            image: formData.image,
        };
    
        const updatedEvents = [...events, newEvent];  
        setEvents(updatedEvents);  
        localStorage.setItem("events", JSON.stringify(updatedEvents));  
    
        setFormData({ name: "", description: "", location: "", date: "", price: "", image: "" });
    }
    function handleDelete(eventId){
        const updatedEvents = events.filter(event => event.id != eventId);
        setEvents(updatedEvents);
        localStorage.setItem("events",JSON.stringify(updatedEvents))
    }
    return (
        <div className="container">
            <h1>Create Event</h1>
            <button onClick={() => navigate("/event-list")}>Back to Event List</button> {/* Add navigation button */}
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Event Name" value={formData.name} onChange={handleChange} required />
                <textarea name="description" placeholder="Event Description" value={formData.description} onChange={handleChange} required></textarea>
                <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                <input type="number" name="price" placeholder="Ticket Price" value={formData.price} onChange={handleChange} required />
                <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
                <button type="submit">Create Event</button>
                
            </form>

            <h2>Event Preview</h2>
            {events.length === 0 ? <p>No events created yet.</p> : (
                <ul>
                    {events.map((event, index) => (
                        <li key={index}>
                            <h3>{event.name}</h3>
                            <p>{event.description}</p>
                            <p>📍 {event.location}</p>
                            <p>📅 {event.date}</p>
                            <p>💰 ${event.price}</p>
                            {event.image && <img src={event.image} alt={event.name} width="100" />}
                            <button onClick={() => handleDelete(event.id)}> Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CreateEvent;
