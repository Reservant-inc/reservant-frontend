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
      'tbd'         : '#DE6C83',
      'primary'     : '#a94c79',
      'primary-2'   : '#e38fb6',
      'primary-3'   : '#f1c7da',
      'secondary'   : '#64c3a6',
      'secondary-2' : '#b1e1d2',
      'white'       : '#fefefe',
      'grey-0'      : '#f5f5f5',
      'grey-1'      : '#eeeeee',
      'grey-2'      : '#a6a6a6',
      'grey-3'      : '#8A8A8A',
      'grey-4'      : '#6D6D6D',
      'grey-5'      : '#333333',
      'grey-6'      : '#2b2b2b',
      'black'       : '#222222',
      'trans'       : 'rgba(0,0,0,0)',
      'red'         : '#ff0000',
      'l-red'       : '#ff7979',
      'green'       : '#54de46',
      'l-green'     : '#71df66',
      'error'       : '#ff4747',
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
  }
  ],
}