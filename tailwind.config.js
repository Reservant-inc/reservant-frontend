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
      'white'   : '#fefefe',
      'cream'   : '#fffbf8',
      'blue'    : '#3ab2c1',
      'd-purple': '#382674',
      'l-purple': '#5c4a9b',
      'pink'    : '#c13a70',
      'l-grey'  : '#f2f2f2',
      'grey'    : '#333333',
      'black'   : '#222222',
    },
  },
  plugins: [],
}

