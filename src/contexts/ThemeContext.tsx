import { createTheme, Theme } from '@mui/material'
import React, { createContext, ReactNode, useEffect, useState } from 'react'

interface ThemeContextProps {
  children: ReactNode
}

interface ThemeContextValue {
  isDark: boolean
  toggleTheme: () => void
  lightTheme: Theme
  darkTheme: Theme
}

export const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  toggleTheme: () => {},
  lightTheme: createTheme(),
  darkTheme: createTheme()
})

const ThemeContextProvider: React.FC<ThemeContextProps> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(
    localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
  )
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: {
        paper: '#fefefe',
        default: '#fefefe'
      },
      text: {
        primary: '#222222'
      },
      primary: {
        main: '#a94c79'
      }
    }
  })

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        paper: '#222222',
        default: '#222222'
      },
      text: {
        primary: '#fefefe'
      },
      primary: {
        main: '#64c3a6'
      }
    }
  })
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })

  const toggleTheme = () => {
    setIsDark(prev => !prev)
    localStorage.theme = document.documentElement.classList.toggle('dark')
      ? 'dark'
      : 'light'
  }

  const value = {
    isDark: isDark,
    toggleTheme: toggleTheme,
    lightTheme: lightTheme,
    darkTheme: darkTheme
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeContextProvider
