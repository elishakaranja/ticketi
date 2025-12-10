import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  alpha,
} from '@mui/material';
import { Search, TrendingUp, CalendarMonth, LocalActivity } from '@mui/icons-material';
import EventCard from '../components/EventCard';
import api from '../api/api';

function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events/?page=1&per_page=6');
        const events = response.data.events || [];
        // First 3 are featured
        setFeaturedEvents(events.slice(0, 3));
        // Next 6 are upcoming
        setUpcomingEvents(events.slice(3, 9));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = [
    { name: 'Music', icon: '🎵', color: '#EC4899' },
    { name: 'Tech', icon: '💻', color: '#6366F1' },
    { name: 'Food', icon: '🍔', color: '#F59E0B' },
    { name: 'Art', icon: '🎨', color: '#8B5CF6' },
    { name: 'Culture', icon: '🎭', color: '#10B981' },
    { name: 'Sports', icon: '⚽', color: '#EF4444' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          pt: { xs: 8, md: 12 },
          pb: { xs: 12, md: 16 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.4,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                mb: 2,
                fontSize: { xs: '2.5rem', md: '4rem' },
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              Discover Amazing Events 🎉
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 4,
                fontWeight: 400,
                maxWidth: '700px',
                mx: 'auto',
              }}
            >
              From Afrobeat festivals to tech summits, find and book tickets to Kenya's most exciting events
            </Typography>

            {/* Search Bar */}
            <Box
              sx={{
                maxWidth: 600,
                mx: 'auto',
                mt: 4,
              }}
            >
              <TextField
                fullWidth
                placeholder="Search for events, venues, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  bgcolor: 'white',
                  borderRadius: 3,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <Button
                      component={Link}
                      to={`/event-list${searchQuery ? `?search=${searchQuery}` : ''}`}
                      variant="contained"
                      sx={{
                        borderRadius: 2,
                        px: 4,
                      }}
                    >
                      Search
                    </Button>
                  ),
                }}
              />
            </Box>

            {/* Stats */}
            <Grid container spacing={4} sx={{ mt: 6, maxWidth: 800, mx: 'auto' }}>
              <Grid item xs={4}>
                <Box>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                    18+
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Events
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                    10+
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Cities
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                    8K+
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Tickets Sold
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Categories */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
          Browse by Category
        </Typography>
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={6} sm={4} md={2} key={category.name}>
              <Card
                component={Link}
                to={`/event-list?category=${category.name}`}
                sx={{
                  textDecoration: 'none',
                  background: alpha(category.color, 0.1),
                  border: `2px solid ${alpha(category.color, 0.3)}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: alpha(category.color, 0.2),
                    border: `2px solid ${category.color}`,
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    {category.icon}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
          <Container maxWidth="lg">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUp color="primary" />
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  Featured Events
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/event-list"
                variant="outlined"
                endIcon={<LocalActivity />}
              >
                View All
              </Button>
            </Box>
            <Grid container spacing={3}>
              {featuredEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <EventCard event={event} featured />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarMonth color="secondary" />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Coming Soon
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/event-list"
              variant="outlined"
              color="secondary"
              endIcon={<LocalActivity />}
            >
              Explore More
            </Button>
          </Box>
          <Grid container spacing={3}>
            {upcomingEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
            Ready to Experience Something Amazing?
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4 }}>
            Join thousands of event-goers discovering and booking incredible experiences
          </Typography>
          <Button
            component={Link}
            to="/event-list"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            Explore All Events
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;