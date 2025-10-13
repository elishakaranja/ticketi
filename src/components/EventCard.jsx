import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';

const EventCard = ({ event }) => {
  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="140"
        image={event.image || 'https://via.placeholder.com/300x140'}
        alt={event.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" sx={{ color: '#EEEEEE' }}>
          {event.name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#EEEEEE' }}>
          {event.description}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#EEEEEE' }}>
            {new Date(event.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Typography>
          <Typography variant="h6" sx={{ color: '#EEEEEE' }}>
            ${event.price}
          </Typography>
        </Box>
      </CardContent>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button component={Link} to={`/events/${event.id}`} size="small" variant="contained" color="primary">
          View Details
        </Button>
      </Box>
    </Card>
  );
};

export default EventCard;