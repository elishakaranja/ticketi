
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

import { Container, Box, Typography, CircularProgress, Alert, Pagination, TextField, Button } from '@mui/material';

function MyTickets() {
    const { token } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resalePrice, setResalePrice] = useState({});
    const [resaleStatus, setResaleStatus] = useState({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchTickets(page);
    }, [token, page]);

    const fetchTickets = async (pageNum) => {
        try {
            const response = await api.get(`/tickets/my-tickets?page=${pageNum}`);
            setTickets(response.data.tickets);
            setTotalPages(response.data.total_pages);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
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

    if (loading) return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Container>;
    if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
    if (!tickets.length) return <Container sx={{ mt: 4 }}><Typography>You don't have any tickets yet.</Typography></Container>;

    return (
        <Container sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                My Tickets
            </Typography>
            <Box>
                {tickets.map(ticket => (
                    <Box key={ticket.ticket_id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                        <Typography variant="h6">{ticket.event.name}</Typography>
                        <Typography>Date: {ticket.event.date}</Typography>
                        <Typography>Location: {ticket.event.location}</Typography>
                        <Typography>Purchase Price: KSH {ticket.price.toLocaleString()}</Typography>
                        <Typography>Status: {ticket.status}</Typography>
                        {ticket.status === "sold" && (
                            <Box mt={2}>
                                <TextField
                                    type="number"
                                    label="Resale Price"
                                    size="small"
                                    value={resalePrice[ticket.ticket_id] || ''}
                                    onChange={(e) => setResalePrice({
                                        ...resalePrice,
                                        [ticket.ticket_id]: e.target.value
                                    })}
                                />
                                <Button onClick={() => handleResell(ticket.ticket_id)} variant="contained" sx={{ ml: 1 }}>
                                    List for Resale
                                </Button>
                            </Box>
                        )}
                        {ticket.status === "resale" && (
                            <Box mt={2}>
                                <Typography>Resale Price: KSH {ticket.resale_price.toLocaleString()}</Typography>
                                <Button onClick={() => handleCancelResale(ticket.ticket_id)} variant="outlined" sx={{ ml: 1 }}>
                                    Cancel Resale
                                </Button>
                            </Box>
                        )}
                        {resaleStatus[ticket.ticket_id] && (
                            <Typography sx={{ mt: 1 }}>
                                {resaleStatus[ticket.ticket_id]}
                            </Typography>
                        )}
                    </Box>
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} />
            </Box>
        </Container>
    );
}

export default MyTickets;