import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

function EventDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [event, setEvent] = useState(null);
  const [available, setAvailable] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [buying, setBuying] = useState(false);
  const [resaleTickets, setResaleTickets] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      api.get(`/events/${id}`),
      api.get(`/tickets/available/${id}`),
      api.get(`/tickets/resale/${id}`)
    ])
      .then(([eventData, ticketData, resaleData]) => {
        setEvent(eventData.data);
        setAvailable(ticketData.data.available_tickets);
        setResaleTickets(resaleData.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load event details");
        setLoading(false);
      });
  }, [id]);

  function handleBuy() {
    setBuying(true);
    setError(null);
    setSuccess(null);
    api.post(`/tickets/purchase/${id}`)
      .then(res => {
        setSuccess("Ticket purchased successfully!");
        setAvailable(a => a - 1);
      })
      .catch(err => setError(err.response?.data?.error || "Failed to purchase ticket"))
      .finally(() => setBuying(false));
  }

  const handleBuyResale = async (ticketId) => {
    setBuying(true);
    setError(null);
    setSuccess(null);
    try {
      await api.post(`/tickets/purchase-resale/${ticketId}`);
      setSuccess("Resale ticket purchased successfully!");
      setResaleTickets(tickets => tickets.filter(t => t.ticket_id !== ticketId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to purchase resale ticket");
    } finally {
      setBuying(false);
    }
  };

  console.log('token:', token, 'available:', available, 'event:', event);
  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div >
      <h1>{event.name}</h1>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
      <p>Price: {event.price}</p>
      <p>Available Tickets: {available}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {token && available > 0 && (
        <button onClick={handleBuy} disabled={buying}>
          {buying ? "Processing..." : "Buy Ticket"}
        </button>
      )}
      {token && available === 0 && <p>Sold out!</p>}
      {!token && <p>Please log in to buy a ticket.</p>}

      <div >
        <h2>Available Tickets</h2>
        <div >
          <h3>Original Price Tickets</h3>
          <p>Available: {available}</p>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          {token && available > 0 && (
            <button onClick={handleBuy} disabled={buying}>
              {buying ? "Processing..." : `Buy Ticket ($${event.price})`}
            </button>
          )}
          {token && available === 0 && <p>Sold out!</p>}
          {!token && <p>Please log in to buy a ticket.</p>}
        </div>

        {resaleTickets.length > 0 && (
          <div >
            <h3>Resale Tickets</h3>
            <div >
              {resaleTickets.map(ticket => (
                <div key={ticket.ticket_id} >
                  <p>Resale Price: ${ticket.resale_price}</p>
                  <p>Seller: {ticket.seller}</p>
                  {token && (
                    <button 
                      onClick={() => handleBuyResale(ticket.ticket_id)}
                      disabled={buying}
                    >
                      {buying ? "Processing..." : "Buy Resale Ticket"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetails;