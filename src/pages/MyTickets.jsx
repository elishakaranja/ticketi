import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

function MyTickets() {
    const { token } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resalePrice, setResalePrice] = useState({});
    const [resaleStatus, setResaleStatus] = useState({});

    useEffect(() => {
        fetchTickets();
    }, [token]);

    const fetchTickets = async () => {
        try {
            const response = await api.get("/tickets/my-tickets");
            setTickets(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleResell = async (ticketId) => {
        if (!resalePrice[ticketId]) {
            setResaleStatus({ ...resaleStatus, [ticketId]: "Please set a price" });
            return;
        }

        try {
            await api.post(`/tickets/resell/${ticketId}`, { price: parseFloat(resalePrice[ticketId]) });
            setResaleStatus({ ...resaleStatus, [ticketId]: "Listed for resale successfully!" });
            fetchTickets(); // Refresh tickets list
        } catch (err) {
            setResaleStatus({ ...resaleStatus, [ticketId]: `Error: ${err.response?.data?.error}` });
        }
    };

    const handleCancelResale = async (ticketId) => {
        try {
            await api.post(`/tickets/cancel-resale/${ticketId}`);
            setResaleStatus({ ...resaleStatus, [ticketId]: "Resale cancelled successfully!" });
            fetchTickets(); // Refresh tickets list
        } catch (err) {
            setResaleStatus({ ...resaleStatus, [ticketId]: `Error: ${err.response?.data?.error}` });
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!tickets.length) return <div>You don't have any tickets yet.</div>;

    return (
        <div >
            <h1>My Tickets</h1>
            <div >
                {tickets.map(ticket => (
                    <div key={ticket.ticket_id} >
                        <h3>{ticket.event.name}</h3>
                        <p>Date: {ticket.event.date}</p>
                        <p>Location: {ticket.event.location}</p>
                        <p>Purchase Price: ${ticket.price}</p>
                        <p>Status: {ticket.status}</p>
                        {ticket.status === "sold" && (
                            <div>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Resale Price"
                                    value={resalePrice[ticket.ticket_id] || ""}
                                    onChange={(e) => setResalePrice({
                                        ...resalePrice,
                                        [ticket.ticket_id]: e.target.value
                                    })}
                                />
                                <button onClick={() => handleResell(ticket.ticket_id)}>
                                    List for Resale
                                </button>
                            </div>
                        )}
                        {ticket.status === "resale" && (
                            <div>
                                <p>Resale Price: ${ticket.resale_price}</p>
                                <button onClick={() => handleCancelResale(ticket.ticket_id)}>
                                    Cancel Resale
                                </button>
                            </div>
                        )}
                        {resaleStatus[ticket.ticket_id] && (
                            <p >
                                {resaleStatus[ticket.ticket_id]}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyTickets;