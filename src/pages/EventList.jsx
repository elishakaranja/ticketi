import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EventCard from '../components/EventCard';
import api from '../api/api';
import {
    Container,
    Grid,
    Typography,
    CircularProgress,
    Alert,
    Pagination,
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Stack,
    alpha,
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';

function EventList() {
    const [searchParams] = useSearchParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Input states (what user types)
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
    const [startDateInput, setStartDateInput] = useState('');
    const [endDateInput, setEndDateInput] = useState('');
    const [categoryInput, setCategoryInput] = useState(searchParams.get('category') || '');

    // Query states (what triggers API calls)
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [category, setCategory] = useState(searchParams.get('category') || '');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
            setPage(1); // Reset to page 1 on new search
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    // Update other filters immediately (no debounce needed)
    useEffect(() => {
        setCategory(categoryInput);
        setPage(1);
    }, [categoryInput]);

    useEffect(() => {
        setStartDate(startDateInput);
        setPage(1);
    }, [startDateInput]);

    useEffect(() => {
        setEndDate(endDateInput);
        setPage(1);
    }, [endDateInput]);

    // Fetch events when query states change
    useEffect(() => {
        fetchEvents(page);
    }, [page, searchQuery, startDate, endDate, category]);

    const fetchEvents = async (pageNum) => {
        setLoading(true);
        try {
            const response = await api.get(`/events/?page=${pageNum}&search=${searchQuery}&start_date=${startDate}&end_date=${endDate}&category=${category}`);
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const categories = ['Music', 'Tech', 'Food', 'Art', 'Culture', 'Fashion', 'Sports', 'Comedy', 'Film', 'Literature', 'Wellness'];

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} />
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
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Header */}
            <Box mb={6}>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
                    Discover Events
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Browse through {events.length} amazing events happening across Kenya
                </Typography>
            </Box>

            {/* Filters */}
            <Box
                sx={{
                    mb: 6,
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                    <FilterList color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Filter Events
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Search events"
                            variant="outlined"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Event name, venue, description..."
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={categoryInput}
                                onChange={(e) => setCategoryInput(e.target.value)}
                                label="Category"
                            >
                                <MenuItem value=""><em>All Categories</em></MenuItem>
                                {categories.map(cat => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Start Date"
                            type="date"
                            variant="outlined"
                            value={startDateInput}
                            onChange={(e) => setStartDateInput(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="End Date"
                            type="date"
                            variant="outlined"
                            value={endDateInput}
                            onChange={(e) => setEndDateInput(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>

                {/* Active Filters */}
                {(searchQuery || category || startDate || endDate) && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
                        {searchQuery && (
                            <Chip
                                label={`Search: ${searchQuery}`}
                                onDelete={() => {
                                    setSearchInput('');
                                    setSearchQuery('');
                                }}
                                color="primary"
                                variant="outlined"
                            />
                        )}
                        {category && (
                            <Chip
                                label={`Category: ${category}`}
                                onDelete={() => {
                                    setCategoryInput('');
                                    setCategory('');
                                }}
                                color="secondary"
                                variant="outlined"
                            />
                        )}
                        {startDate && (
                            <Chip
                                label={`From: ${startDate}`}
                                onDelete={() => {
                                    setStartDateInput('');
                                    setStartDate('');
                                }}
                                variant="outlined"
                            />
                        )}
                        {endDate && (
                            <Chip
                                label={`To: ${endDate}`}
                                onDelete={() => {
                                    setEndDateInput('');
                                    setEndDate('');
                                }}
                                variant="outlined"
                            />
                        )}
                    </Stack>
                )}
            </Box>

            {/* Events Grid */}
            {events.length === 0 ? (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 10,
                        bgcolor: alpha('#6366F1', 0.05),
                        borderRadius: 3,
                        border: '2px dashed',
                        borderColor: 'divider',
                    }}
                >
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                        No events found
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Try adjusting your filters or search query
                    </Typography>
                </Box>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {events.map((event) => (
                            <Grid item key={event.id} xs={12} sm={6} md={4}>
                                <EventCard event={event} />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                size="large"
                                color="primary"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        fontSize: '1rem',
                                    },
                                }}
                            />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
};

export default EventList;