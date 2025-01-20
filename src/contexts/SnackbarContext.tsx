import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SnackbarContextType {
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning'
  open: boolean
  setSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void
  closeSnackbar: () => void
}

interface SnackbarProviderProps {
  children: ReactNode;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [snackbar, setSnackbarState] = useState({
    message: '',
    severity: 'info' as 'success' | 'error' | 'info' | 'warning',
    open: false,
  });

  const setSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarState({ message, severity, open: true })
  }

  const closeSnackbar = () => {
    setSnackbarState({ ...snackbar, open: false })
  }

  return (
    <SnackbarContext.Provider value={{ ...snackbar, setSnackbar, closeSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  )
}

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return context;
}
