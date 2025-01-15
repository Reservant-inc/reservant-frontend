/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  important: true,
  darkMode: 'class',
  theme: {
    fontFamily: {
      roboto: ['Roboto'],
      'mont-l': ['Montserrat-l'],
      'mont-md': ['Montserrat-md'],
      'mont-bd': ['Montserrat-bold']
    },
    extend: {},
    colors: {
      tbd: '#DE6C83',
      primary: '#a94c79',
      'primary-2': '#e38fb6',
      'primary-3': '#f1c7da',
      secondary: '#64c3a6',
      'secondary-2': '#b1e1d2',
      white: '#fefefe',
      'grey-0': '#f5f5f5',
      'grey-1': '#eeeeee',
      'grey-15': '#C6C6C6',
      'grey-2': '#a6a6a6',
      'grey-3': '#8A8A8A',
      'grey-4': '#6D6D6D',
      'grey-5': '#333333',
      'grey-6': '#2b2b2b',
      black: '#222222',
      trans: 'rgba(0,0,0,0)',
      'semi-trans': 'rgba(0,0,0,0.8)',
      red: '#ff0000',
      'l-red': '#ff7979',
      green: '#54de46',
      'l-green': '#71df66',
      error: '#ff4747'
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addBase, theme }) {
      const colors = theme('colors')
      const colorVariables = Object.keys(colors).reduce((acc, key) => {
        const colorValue = colors[key]
        if (typeof colorValue === 'string') {
          acc[`--tw-color-${key}`] = colorValue
        }
        return acc
      }, {})

      addBase({
        ':root': colorVariables
      })
    },
    function ({ addVariant }) {
      addVariant('child', '& > *')
      addVariant('child-hover', '& > *:hover')
    },
    function ({ addBase, theme }) {
      addBase({
        'input:active, select:active, textarea:active ': {
          borderColor: theme('colors.primary')
        },
        'input:focus, select:focus, textarea:focus': {
          borderColor: theme('colors.primary'),
          boxShadow: `0 0 0 1px ${theme('colors.primary')}`
        },
        '.dark input:active, .dark select:active, .dark textarea:active ': {
          borderColor: theme('colors.secondary')
        },
        '.dark input:focus, .dark select:focus, .dark textarea:focus': {
          borderColor: theme('colors.secondary'),
          boxShadow: `0 0 0 1px ${theme('colors.secondary')}`
        }
      })
    }
  ]
}
