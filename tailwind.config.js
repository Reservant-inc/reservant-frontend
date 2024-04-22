/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode:'class',
  theme: {
    fontFamily: {
      'roboto': ['Roboto'],
      'mont': ['Montserrat']
    },
    extend: {
    },
    colors: {
      'primary'     : '#592836',
      'primary-2'   : '#a94c79',
      'primary-3'   : '#e38fb6',
      'primary-4'   : '#f1c7da',
      'secondary'   : '#64c3a6',
      'secondary-2' : '#b1e1d2',
      'white'       : '#fefefe',
      'grey'        : '#333333',
      'black'       : '#222222',
    },
  },
  plugins: [],
}

