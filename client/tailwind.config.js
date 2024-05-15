/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // The `theme` section is where you define your custom styling.
    // This can include colors, fonts, breakpoints, and more.
    // For example, to customize the color palette:
    extend: {
      colors: {
        ...colors,
        'lightpurple': {
          DEFAULT: '#f8f0fe',
          login: '#DCB6FA',
          body: '#f3eff6',
          selected: '#f3e6fd',
        },
        darkpurple: "#63276A",
        resetpurple: "#B08DCC",
      },
      // You can also customize other theme values like fonts, spacing, etc.
      fontFamily: {
        'sans': ['Graphik', 'sans-serif'], // Add a custom font family
        // Define other font families as needed
      },
      // Example for customizing breakpoints
      screens: {
        'tablet': '640px',
        'laptop': '1024px',
        'desktop': '1280px',
        // Add more breakpoints as needed
      },
      container: {
        center: true,
        padding: '2rem',
        screens: {
          sm: '100%',
          md: '100%',
          lg: '100%',
          xl: '100%',
        },
      },
    },
    plugins: [
      function ({ addUtilities }) {
        const newUtilities = {
          ".no-scrollbar::-webkit-scrollbar": {
            display: "none",
          },
          ".no-scrollbar": {
            "-ms-overflow-style": "none",
            "scrollbar-width": "none"
          },
          /* width */
          ".lilac-scrollbar::-webkit-scrollbar": {
            "width": "10px",
          },

          /* Track */
          ".lilac-scrollbar::-webkit-scrollbar-track": {
            "background": "rgb(209 213 219)",
          },

          /* Handle */
          ".lilac-scrollbar::-webkit-scrollbar-thumb": {
            "background": "#DCB6FA",
            "border-radius": "5px",
          },

          /* Handle on hover */
          ".lilac-scrollbar::-webkit-scrollbar-thumb:hover": {
            "background": "#B08DCC",
          },
        }

        addUtilities(newUtilities)
      }
      // Plugins can be added here to extend Tailwind's core functionality.
      // For example, to add forms support:
      // require('@tailwindcss/forms'),
    ],
  },
};