import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
} from '@mui/material';
import {
    ConfirmationNumber,
    Person,
    Menu as MenuIcon,
    Logout,
    AddCircle,
    EventAvailable,
} from '@mui/icons-material';
import { useState } from 'react';

function NavBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
        navigate('/');
    };

    return (
        <AppBar
            position="sticky"
            sx={{
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    {/* Logo */}
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            mr: 4,
                        }}
                    >
                        <ConfirmationNumber sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: '1.5rem',
                            }}
                        >
                            Ticketi
                        </Typography>
                    </Box>

                    {/* Desktop Navigation */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        <Button
                            component={Link}
                            to="/"
                            sx={{ color: 'white', fontWeight: 500 }}
                        >
                            Home
                        </Button>
                        <Button
                            component={Link}
                            to="/event-list"
                            sx={{ color: 'white', fontWeight: 500 }}
                        >
                            Events
                        </Button>
                        <Button
                            component={Link}
                            to="/events-near-me"
                            sx={{ color: 'white', fontWeight: 500 }}
                        >
                            Near Me
                        </Button>
                        {user && (
                            <>
                                <Button
                                    component={Link}
                                    to="/create-event"
                                    startIcon={<AddCircle />}
                                    sx={{ color: 'white', fontWeight: 500 }}
                                >
                                    Create Event
                                </Button>
                                <Button
                                    component={Link}
                                    to="/my-tickets"
                                    startIcon={<EventAvailable />}
                                    sx={{ color: 'white', fontWeight: 500 }}
                                >
                                    My Tickets
                                </Button>
                            </>
                        )}
                    </Box>

                    {/* User Menu */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {user ? (
                            <>
                                <IconButton
                                    size="large"
                                    aria-label="account menu"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    sx={{ p: 0 }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: 'primary.main',
                                            width: 40,
                                            height: 40,
                                        }}
                                    >
                                        {user.username?.charAt(0).toUpperCase() || 'U'}
                                    </Avatar>
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    sx={{
                                        mt: 1,
                                        '& .MuiPaper-root': {
                                            bgcolor: 'background.paper',
                                            minWidth: 200,
                                        },
                                    }}
                                >
                                    <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                                        <Person sx={{ mr: 1 }} /> Profile
                                    </MenuItem>
                                    <MenuItem onClick={() => { navigate('/my-tickets'); handleClose(); }}>
                                        <EventAvailable sx={{ mr: 1 }} /> My Tickets
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                        <Logout sx={{ mr: 1 }} /> Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="outlined"
                                    sx={{
                                        color: 'white',
                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                        '&:hover': {
                                            borderColor: 'white',
                                        },
                                    }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    component={Link}
                                    to="/register"
                                    variant="contained"
                                    color="primary"
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;