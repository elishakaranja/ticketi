import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  alpha,
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  LocalActivity,
  TrendingUp,
} from '@mui/icons-material';

const EventCard = ({ event, featured = false }) => {
  const navigate = useNavigate();
  const availableTickets = event.capacity - event.tickets_sold;
  const percentageSold = (event.tickets_sold / event.capacity) * 100;
  const isSellingFast = percentageSold > 90;

  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };

  const handleBookNow = (e) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    navigate(`/events/${event.id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        background: featured
          ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)'
          : 'background.paper',
        border: featured ? '2px solid' : 'none',
        borderColor: featured ? 'primary.main' : 'transparent',
        cursor: 'pointer', // Indicate that the card is clickable
      }}
    >
      {/* Featured Badge */}
      {featured && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 2,
          }}
        >
          <Chip
            icon={<TrendingUp />}
            label="Featured"
            color="primary"
            sx={{
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
            }}
          />
        </Box>
      )}

      {/* Selling Fast Badge */}
      {isSellingFast && !featured && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 2,
          }}
        >
          <Chip
            label="🔥 Selling Fast"
            color="error"
            sx={{
              fontWeight: 600,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 1,
                },
                '50%': {
                  opacity: 0.8,
                },
              },
            }}
          />
        </Box>
      )}

      {/* Category Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 2,
        }}
      >
        <Chip
          label={event.category}
          size="small"
          sx={{
            bgcolor: alpha('#fff', 0.9),
            color: 'text.primary',
            fontWeight: 600,
            backdropFilter: 'blur(10px)',
          }}
        />
      </Box>

      {/* Image */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="200"
          image={event.image || 'https://via.placeholder.com/400x200'}
          alt={event.name}
          sx={{
            transition: 'transform 0.5s ease',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        />
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        {/* Event Name */}
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '3.6em',
          }}
        >
          {event.name}
        </Typography>

        {/* Event Details */}
        <Box sx={{ mb: 2, flexGrow: 1 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <CalendarToday sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <LocationOn sx={{ fontSize: 16, color: 'secondary.main' }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {event.location}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <LocalActivity sx={{ fontSize: 16, color: 'success.main' }} />
            <Typography variant="body2" color="text.secondary">
              {availableTickets} tickets available
            </Typography>
          </Box>
        </Box>

        {/* Price and CTA */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              From
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              KSH {event.price.toLocaleString()}
            </Typography>
          </Box>
          <Button
            onClick={handleBookNow} // Use onClick to handle navigation and stop propagation
            variant="contained"
            color="primary"
            size="small"
            endIcon={<LocalActivity />}
            sx={{
              px: 3,
            }}
          >
            Book Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;