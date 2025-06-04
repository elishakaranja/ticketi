import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function CreateEvent() {
    const navigate = useNavigate();
    const { user, token } = useAuth();
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
        try {
            const response = await fetch("http://localhost:5000/events/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    location: formData.location,
                    date: formData.date + " 00:00:00", // backend expects full datetime
                    price: parseFloat(formData.price),
                    capacity: parseInt(formData.capacity),
                    image: formData.image
                })
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create event");
            }
            setSuccess("Event created successfully!");
            setTimeout(() => navigate("/event-list"), 1000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container">
            <h1>Create Event</h1>
            <button onClick={() => navigate("/event-list")}>Back to Event List</button>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Event Name" value={formData.name} onChange={handleChange} required />
                <textarea name="description" placeholder="Event Description" value={formData.description} onChange={handleChange} required></textarea>
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
