import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import api from '../api/api';

function CreateEvent() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: "", description: "", location: "", date: "", price: "", capacity: "", image: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    if (!user) {
        navigate("/login");
        return null;
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const price = parseFloat(formData.price);
        const capacity = parseInt(formData.capacity);
        
        if (isNaN(price) || price < 0) {
            setError("Please enter a valid price");
            setLoading(false);
            return;
        }

        if (isNaN(capacity) || capacity <= 0) {
            setError("Please enter a valid capacity");
            setLoading(false);
            return;
        }

        const eventDate = new Date(formData.date);
        if (isNaN(eventDate.getTime())) {
            setError("Please enter a valid date");
            setLoading(false);
            return;
        }

        const formattedDate = eventDate.getFullYear() + '-' +
            String(eventDate.getMonth() + 1).padStart(2, '0') + '-' +
            String(eventDate.getDate()).padStart(2, '0') + ' ' +
            '00:00:00';

        try {
            const response = await api.post("/events/", {
                name: formData.name.trim(),
                description: formData.description.trim(),
                location: formData.location.trim(),
                date: formattedDate,
                price: price,
                capacity: capacity,
                image: formData.image.trim() || null
            });

            setSuccess("Event created successfully!");
            setTimeout(() => navigate("/event-list"), 1000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create event");
            console.error("Error creating event:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div >
            <h1>Create Event</h1>
            <button onClick={() => navigate("/event-list")}>Back to Event List</button>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Event Name" value={formData.name} onChange={handleChange} required />
                <textarea name="description" placeholder="Event Description" value={formData.description} onChange={handleChange} required />
                <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                <input type="number" name="price" placeholder="Ticket Price" value={formData.price} onChange={handleChange} required />
                <input type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleChange} required />
                <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
                <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Event"}</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
        </div>
    );
}

export default CreateEvent;