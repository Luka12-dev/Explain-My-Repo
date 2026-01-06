/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        liquid: {
          blue: {
            50: '#e6f0ff',
            100: '#b3d4ff',
            200: '#80b8ff',
            300: '#4d9cff',
            400: '#1a80ff',
            500: '#0066e6',
            600: '#0050b3',
            700: '#003a80',
            800: '#00244d',
            900: '#000e1a',
          },
          dark: {
            50: '#1a1a1a',
            100: '#0f0f0f',
            200: '#050505',
            300: '#000000',
            400: '#000000',
            500: '#000000',
            600: '#000000',
            700: '#000000',
            800: '#000000',
            900: '#000000',
          },
        },
      },
      animation: {
        'liquid-morph': 'liquidMorph 8s ease-in-out infinite',
        'liquid-flow': 'liquidFlow 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        liquidMorph: {
          '0%, 100%': {
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            transform: 'scale(1) rotate(0deg)',
          },
          '50%': {
            borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
            transform: 'scale(1.05) rotate(180deg)',
          },
        },
        liquidFlow: {
          '0%, 100%': {
            transform: 'translateY(0) translateX(0)',
          },
          '33%': {
            transform: 'translateY(-10px) translateX(10px)',
          },
          '66%': {
            transform: 'translateY(10px) translateX(-10px)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-1000px 0',
          },
          '100%': {
            backgroundPosition: '1000px 0',
          },
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(26, 128, 255, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(26, 128, 255, 0.8)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
};
