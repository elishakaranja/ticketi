import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
      fetch(`http://localhost:5000/events/${id}`).then(res => res.json()),
      fetch(`http://localhost:5000/tickets/available/${id}`).then(res => res.json()),
      fetch(`http://localhost:5000/tickets/resale/${id}`).then(res => res.json())
    ])
      .then(([eventData, ticketData, resaleData]) => {
        setEvent(eventData);
        setAvailable(ticketData.available_tickets);
        setResaleTickets(resaleData);
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
    fetch(`http://localhost:5000/tickets/purchase/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setSuccess("Ticket purchased successfully!");
        setAvailable(a => a - 1);
      })
      .catch(err => setError(err.message))
      .finally(() => setBuying(false));
  }

  const handleBuyResale = async (ticketId) => {
    setBuying(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`http://localhost:5000/tickets/purchase-resale/${ticketId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setSuccess("Resale ticket purchased successfully!");
      // Remove the purchased ticket from resale list
      setResaleTickets(tickets => tickets.filter(t => t.ticket_id !== ticketId));
    } catch (err) {
      setError(err.message);
    } finally {
      setBuying(false);
    }
  };

  console.log('token:', token, 'available:', available, 'event:', event);
  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div className="container">
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

      <div className="tickets-section">
        <h2>Available Tickets</h2>
        <div className="original-tickets">
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
          <div className="resale-tickets">
            <h3>Resale Tickets</h3>
            <div className="resale-list">
              {resaleTickets.map(ticket => (
                <div key={ticket.ticket_id} className="resale-ticket-card">
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
