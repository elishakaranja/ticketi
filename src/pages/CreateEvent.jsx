import { useState, useEffect } from "react";

function CreateEvent() {
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
        const newEvents = [...events, formData]; // new array with the new event,,,taking all events and adding the new event(formData)


        // Saves the updated events list to `localStorage` 
        localStorage.setItem("events", JSON.stringify(newEvents));//converts new array to a string ans dtores it in local storage

        setEvents(newEvents); // Update state to show updated list of events 
        setFormData({ name: "", description: "", location: "", date: "", price: "", image: "" });
    }

    return (
        <div className="container">
            <h1>Create Event</h1>
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
                            <button onClick={() => handleDelete(index)}> Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CreateEvent;
