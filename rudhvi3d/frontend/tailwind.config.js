const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf8e8',
          100: '#f9edc4',
          200: '#f3dc8b',
          300: '#ecc94b',
          400: '#d4a853',
          500: '#c9a041',
          600: '#a67c28',
          700: '#7f5d1e',
          800: '#5c4316',
          900: '#3d2d0f',
        },
        rudhvi: {
          dark: '#0a0a0a',
          darker: '#050505',
          card: '#1a1a1a',
          border: '#2a2a2a',
          cream: '#fdf8f0',
          light: '#f9f5ef',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'Playfair Display', ...defaultTheme.fontFamily.serif],
        sans: ['Poppins', 'Inter', 'system-ui', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #c9a041 0%, #d4a853 50%, #ecc94b 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
      },
    },
  },
  plugins: [],
};
