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
    },
  },
  plugins: [
    // Plugins can be added here to extend Tailwind's core functionality.
    // For example, to add forms support:
    // require('@tailwindcss/forms'),
  ],
};