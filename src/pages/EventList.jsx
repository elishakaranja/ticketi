import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EventCard from '../components/EventCard';
import api from '../api/api';
import { Container, Grid, Typography, CircularProgress, Alert, Pagination, Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchEvents(page);
    }, [page, search, startDate, endDate, category]);

    const fetchEvents = async (pageNum) => {
        setLoading(true);
        try {
            const response = await api.get(`/events/?page=${pageNum}&search=${search}&start_date=${startDate}&end_date=${endDate}&category=${category}`);
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
            <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
                <TextField label="Search" variant="outlined" value={search} onChange={(e) => setSearch(e.target.value)} />
                <TextField label="Start Date" type="date" variant="outlined" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
                <TextField label="End Date" type="date" variant="outlined" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel>Category</InputLabel>
                    <Select value={category} onChange={(e) => setCategory(e.target.value)} label="Category">
                        <MenuItem value=""><em>All</em></MenuItem>
                        <MenuItem value="Music">Music</MenuItem>
                        <MenuItem value="Sports">Sports</MenuItem>
                        <MenuItem value="Theater">Theater</MenuItem>
                    </Select>
                </FormControl>
            </Box>
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