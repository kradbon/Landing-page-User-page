/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      borderRadius: {
        xl: '0.5rem',
        '2xl': '0.75rem',
        '3xl': '1rem',
      },
    },
  },
  plugins: [],
};
