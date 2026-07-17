/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5d9e2',
          300: '#b0b8c8',
          400: '#848fa6',
          500: '#65718c',
          600: '#505a73',
          700: '#41495d',
          800: '#3a4150',
          900: '#0b0d12',
          950: '#06070a',
        },
        brand: {
          50: '#fff1f0',
          100: '#ffe0de',
          200: '#ffc5c1',
          300: '#ff9d96',
          400: '#ff6b61',
          500: '#f43f37',
          600: '#e22a23',
          700: '#bd1f1c',
          800: '#9c1f1d',
          900: '#81211f',
          950: '#460c0b',
        },
        accent: {
          50: '#fff8eb',
          100: '#feebc6',
          200: '#fcd789',
          300: '#fbbb4b',
          400: '#faa020',
          500: '#e9840f',
          600: '#c26508',
          700: '#9a490c',
          800: '#7e3b10',
          900: '#683111',
          950: '#3c1705',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(11,13,18,0.04), 0 8px 24px -12px rgba(11,13,18,0.12)',
        lift: '0 2px 4px rgba(11,13,18,0.06), 0 24px 48px -16px rgba(11,13,18,0.18)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
};
