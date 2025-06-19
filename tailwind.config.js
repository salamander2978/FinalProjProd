/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'primary': ['Poppins', 'sans-serif'],
        'secondary': ['Rubik', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
        },
        secondary: '#64748b',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
      },
    },
  },
  plugins: [],
} 