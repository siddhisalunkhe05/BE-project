/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
        indigo: {
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        gray: {
          50: '#f9fafb',
          200: '#e5e7eb',
          600: '#4b5563',
          800: '#1f2937',
        },
      },
      backgroundColor: {
        'dark': '#1a202c', // Dark background color
      },
      textColor: {
        'dark': '#ffffff', // Dark mode text color
      },
    },
  },
  plugins: [],
}