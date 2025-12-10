import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  LinearProgress,
  IconButton,
  alpha,
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  LocalActivity,
  Share,
  Bookmark,
  BookmarkBorder,
  Close,
  CheckCircle,
  Person,
  ConfirmationNumber,
} from '@mui/icons-material';

function EventDetails() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [available, setAvailable] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [buying, setBuying] = useState(false);
  const [resaleTickets, setResaleTickets] = useState([]);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [bookmarked, setBookmarked] = useState(false);

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

  const handleOpenBooking = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setBookingDialogOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingDialogOpen(false);
    setQuantity(1);
  };

  const handleConfirmBooking = async () => {
    setBuying(true);
    setError(null);

    try {
      // Purchase tickets based on quantity
      for (let i = 0; i < quantity; i++) {
        await api.post(`/tickets/purchase/${id}`);
      }

      setSuccess(`Successfully purchased ${quantity} ticket${quantity > 1 ? 's' : ''}!`);
      setAvailable(a => a - quantity);
      setBookingDialogOpen(false);
      setQuantity(1);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to purchase tickets");
    } finally {
      setBuying(false);
    }
  };

  const handleBuyResale = async (ticketId, price) => {
    if (!token) {
      navigate('/login');
      return;
    }

    setBuying(true);
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

  const totalPrice = event ? event.price * quantity : 0;
  const percentageSold = event ? (event.tickets_sold / event.capacity) * 100 : 0;

  if (loading) {
    return (
      <Container sx={{ py: 8 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>Loading event details...</Typography>
      </Container>
    );
  }

  if (!event) return (
    <Container sx={{ py: 8 }}>
      <Alert severity="error">Event not found</Alert>
    </Container>
  );

  return (
    <Box>
      {/* Hero Section with Event Image */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '300px', md: '400px' },
          width: '100%',
          backgroundImage: `url(${event.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(15,23,42,1) 100%)',
          },
        }}
      >
        <Container sx={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', pb: 4 }}>
          <Box>
            <Chip label={event.category} color="primary" sx={{ mb: 2 }} />
            <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
              {event.name}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Event Info Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ bgcolor: alpha('#6366F1', 0.1), border: '1px solid', borderColor: alpha('#6366F1', 0.3) }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <CalendarToday color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Date & Time
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ bgcolor: alpha('#EC4899', 0.1), border: '1px solid', borderColor: alpha('#EC4899', 0.3) }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <LocationOn color="secondary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {event.location}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Description */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  About This Event
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {event.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Resale Tickets */}
            {resaleTickets.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    Resale Tickets Available
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    {resaleTickets.map(ticket => (
                      <Grid item xs={12} key={ticket.ticket_id}>
                        <Box
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Seller: {ticket.seller}
                            </Typography>
                            <Typography variant="h6" fontWeight={700}>
                              KSH {ticket.resale_price.toLocaleString()}
                            </Typography>
                          </Box>
                          {token && (
                            <Button
                              variant="outlined"
                              onClick={() => handleBuyResale(ticket.ticket_id, ticket.resale_price)}
                              disabled={buying}
                            >
                              Buy Resale
                            </Button>
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Sticky Booking Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                position: 'sticky',
                top: 100,
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                border: '2px solid',
                borderColor: 'primary.main',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                  KSH {event.price.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  per ticket
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Ticket Availability */}
                <Box sx={{ mb: 3 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">
                      Tickets Sold
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {event.tickets_sold} / {event.capacity}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={percentageSold}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      bgcolor: alpha('#fff', 0.1),
                      '& .MuiLinearProgress-bar': {
                        background: percentageSold > 90
                          ? 'linear-gradient(90deg, #EF4444, #DC2626)'
                          : 'linear-gradient(90deg, #6366F1, #EC4899)',
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {available} tickets remaining
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleOpenBooking}
                  disabled={available === 0 || buying}
                  startIcon={<LocalActivity />}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    mb: 2,
                  }}
                >
                  {available === 0 ? 'Sold Out' : 'Book Tickets'}
                </Button>

                {!token && (
                  <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                    Please sign in to purchase tickets
                  </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Quick Info */}
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                    <ConfirmationNumber sx={{ fontSize: 20, color: 'primary.main' }} />
                    <Typography variant="body2">
                      Instant confirmation
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person sx={{ fontSize: 20, color: 'secondary.main' }} />
                    <Typography variant="body2">
                      Hosted by {event.organizer || 'Event Organizer'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Booking Dialog */}
      <Dialog
        open={bookingDialogOpen}
        onClose={handleCloseBooking}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight={600}>
              Book Tickets
            </Typography>
            <IconButton onClick={handleCloseBooking}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {event.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom fontWeight={600}>
              Number of Tickets
            </Typography>
            <TextField
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(available, parseInt(e.target.value) || 1)))}
              inputProps={{ min: 1, max: available }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Typography variant="caption" color="text.secondary">
              Maximum {available} tickets available
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              bgcolor: alpha('#6366F1', 0.1),
              borderRadius: 2,
              border: '1px solid',
              borderColor: alpha('#6366F1', 0.3),
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Price per ticket:</Typography>
              <Typography fontWeight={600}>KSH {event.price.toLocaleString()}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Quantity:</Typography>
              <Typography fontWeight={600}>{quantity}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" fontWeight={700}>Total:</Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                KSH {totalPrice.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseBooking} disabled={buying}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmBooking}
            disabled={buying || quantity < 1}
            startIcon={buying ? null : <CheckCircle />}
          >
            {buying ? 'Processing...' : 'Confirm Purchase'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EventDetails;