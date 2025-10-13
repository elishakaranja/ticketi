import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/event-list', label: 'Events' },
    { path: '/my-tickets', label: 'My Tickets', protected: true },
    { path: '/create-event', label: 'Host Event', protected: true },
  ];

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'white', textDecoration: 'none' }}>
          Ticketi
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {navLinks.map((link) => (
            (!link.protected || (link.protected && user)) && (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                color="inherit"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {link.label}
              </Button>
            )
          ))}
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: 2 }}>{user.username.charAt(0).toUpperCase()}</Avatar>
              <Typography sx={{ mr: 2 }}>{user.username}</Typography>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </Box>
          ) : (
            <Box>
              <Button component={Link} to="/login" color="inherit">Sign In</Button>
              <Button component={Link} to="/register" variant="contained" color="secondary">Sign Up</Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;