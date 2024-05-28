/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  important: true,
  darkMode:'class',
  theme: {
    fontFamily: {
      'roboto': ['Roboto'],
      'mont-l': ['Montserrat-l'],
      'mont-md': ['Montserrat-md'],
      'mont-bd': ['Montserrat-bold'],
    },
    extend: {
    },
    colors: {
      'primary'     : '#a94c79',
      'primary-2'   : '#e38fb6',
      'primary-3'   : '#f1c7da',
      'secondary'   : '#64c3a6',
      'secondary-2' : '#b1e1d2',
      'white'       : '#fefefe',
      'grey-0'      : '#f5f5f5',
      'grey-1'      : '#eeeeee',
      'grey-2'      : '#a6a6a6',
      'grey-3'      : '#2b2b2b',
      'grey-4'      : '#333333',
      'black'       : '#222222',
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

