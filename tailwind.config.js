/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#fafafa',
          100: '#eeeeee',
          200: '#dddddd',
          300: '#cccccc',
          400: '#bbbbbb',
          500: '#9a9a9a',
          600: '#888888',
          700: '#666666',
          800: '#444444',
          900: '#222222',
        },
        primary: {
          50: '#f8f9fa',
          100: '#eeeeee',
          200: '#dddddd',
          300: '#cccccc',
          400: '#bbbbbb',
          500: '#9a9a9a',
          600: '#888888',
          700: '#666666',
          800: '#444444',
          900: '#222222',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};