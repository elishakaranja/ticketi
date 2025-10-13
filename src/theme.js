import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#541212', // Maroon
    },
    secondary: {
      main: '#468A9A', // Teal
    },
    background: {
      default: '#EEEEEE', // Light Gray
      paper: '#468A9A', // Teal for surfaces
    },
    text: {
      primary: '#0F0E0E', // Near-black on light background
      secondary: '#6B7280', // Mid Grey
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontFamily: 'Poppins, sans-serif',
    },
    h2: {
      fontFamily: 'Poppins, sans-serif',
    },
    h3: {
      fontFamily: 'Poppins, sans-serif',
    },
    h4: {
      fontFamily: 'Poppins, sans-serif',
    },
    h5: {
      fontFamily: 'Poppins, sans-serif',
    },
    h6: {
      fontFamily: 'Poppins, sans-serif',
    },
  },
});

export default theme;
