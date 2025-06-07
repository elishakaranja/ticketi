/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    colors: {
      'primary': {
        50: '#F9F8F6',
        100: '#F2F2F2',
        200: '#EAE4D5',
        300: '#B6B09F',
        400: '#A39D8C',
        500: '#8C8575',
        600: '#000000',
      },
      'accent': {
        100: '#FFF8E7',
        200: '#FFE5B4',
        300: '#FFD27D',
        400: '#FFC145',
      },
      'neutral': {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#E5E5E5',
        300: '#D4D4D4',
        400: '#A3A3A3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
      }
    },
    fontFamily: {
      'sans': ['Poppins', 'system-ui', 'sans-serif'],
      'display': ['Playfair Display', 'serif'],
    },
    boxShadow: {
      'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
      'medium': '0 4px 20px rgba(0, 0, 0, 0.08)',
    },
    borderRadius: {
      'xl': '1rem',
      '2xl': '1.5rem',
    },
  },
  plugins: [],
} 