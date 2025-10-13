import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EventCard from '../components/EventCard';
import api from '../api/api';
import { Container, Grid, Typography, CircularProgress, Alert, Pagination } from '@mui/material';

function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchEvents(page);
    }, [page]);

    const fetchEvents = async (pageNum) => {
        setLoading(true);
        try {
            const response = await api.get(`/events/?page=${pageNum}`);
            setEvents(response.data.events);
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

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Upcoming Events
            </Typography>
            <Grid container spacing={4}>
                {events.map((event) => (
                    <Grid item key={event.id} xs={12} sm={6} md={4}>
                        <EventCard event={event} />
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} />
            </Box>
            {events.length === 0 && (
                <Typography variant="h6" component="p" sx={{ mt: 4 }}>
                    No events found
                </Typography>
            )}
        </Container>
    );
};

export default EventList;