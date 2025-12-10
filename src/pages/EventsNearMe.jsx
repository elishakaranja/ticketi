import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Grid,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    MyLocation,
    Explore,
    FilterList,
} from '@mui/icons-material';
import EventCard from '../components/EventCard';
import api from '../api/api';

function EventsNearMe() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);
    const [category, setCategory] = useState('');
    const [radius, setRadius] = useState(25);

    // Default location: Nairobi city center
    const DEFAULT_LOCATION = {
        lat: -1.2921,
        lng: 36.8219,
        name: 'Nairobi, Kenya'
    };

    const categories = [
        'Music', 'Tech', 'Food', 'Art', 'Culture',
        'Fashion', 'Sports', 'Comedy', 'Film', 'Literature', 'Wellness'
    ];

    useEffect(() => {
        // Try to get user's location
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        name: 'Your Location'
                    });
                },
                (error) => {
                    // If geolocation fails, use default (Nairobi)
                    console.log('Geolocation failed, using default location');
                    setLocation(DEFAULT_LOCATION);
                }
            );
        } else {
            setLocation(DEFAULT_LOCATION);
        }
    }, []);

    useEffect(() => {
        if (location) {
            fetchNearbyEvents();
        }
    }, [location, category, radius]);

    const fetchNearbyEvents = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get('/eventbrite/events/near-me', {
                params: {
                    lat: location.lat,
                    lng: location.lng,
                    radius: radius,
                    category: category || undefined,
                    limit: 20
                }
            });

            setEvents(response.data.events || []);
            setLoading(false);
        } catch (err) {
            setError('Failed to load nearby events. Please try again.');
            setLoading(false);
        }
    };

    const handleUseMyLocation = () => {
        if ('geolocation' in navigator) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        name: 'Your Location'
                    });
                    setLoading(false);
                },
                (error) => {
                    setError('Could not get your location. Using Nairobi as default.');
                    setLocation(DEFAULT_LOCATION);
                    setLoading(false);
                }
            );
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Header */}
            <Box mb={6} textAlign="center">
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                    <Explore sx={{ fontSize: '3rem', verticalAlign: 'middle', mr: 2, color: 'primary.main' }} />
                    Events Near You
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Discover amazing events happening around {location?.name || 'you'}
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={<MyLocation />}
                    onClick={handleUseMyLocation}
                    disabled={loading}
                >
                    Use My Current Location
                </Button>
            </Box>

            {/* Filters */}
            <Card sx={{ mb: 4, bgcolor: 'background.paper' }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={3}>
                        <FilterList color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Filter Events
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
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
                            <FormControl fullWidth>
                                <InputLabel>Search Radius</InputLabel>
                                <Select
                                    value={radius}
                                    onChange={(e) => setRadius(e.target.value)}
                                    label="Search Radius"
                                >
                                    <MenuItem value={10}>10 km</MenuItem>
                                    <MenuItem value={25}>25 km</MenuItem>
                                    <MenuItem value={50}>50 km</MenuItem>
                                    <MenuItem value={100}>100 km</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {location && (
                        <Box mt={2}>
                            <Chip
                                label={`📍 ${location.name} • ${radius}km radius`}
                                color="primary"
                                variant="outlined"
                            />
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Events Grid */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                    <CircularProgress size={60} />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
            ) : events.length === 0 ? (
                <Box textAlign="center" py={10}>
                    <Typography variant="h5" gutterBottom>
                        No events found nearby
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Try adjusting your filters or increasing the search radius
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/event-list')}>
                        Browse All Events
                    </Button>
                </Box>
            ) : (
                <>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                        Found {events.length} events near you
                    </Typography>

                    <Grid container spacing={3}>
                        {events.map((event, index) => (
                            <Grid item xs={12} sm={6} md={4} key={event.id || index}>
                                <EventCard event={event} />
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Container>
    );
}

export default EventsNearMe;
