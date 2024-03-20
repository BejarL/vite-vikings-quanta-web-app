/** @type {import('tailwindcss').Config} */
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
        'primary': '#3490dc', // Define a primary color
        'secondary': '#ffed4a', // Define a secondary color
        // Add more custom colors as needed
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