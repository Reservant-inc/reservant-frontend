import React, { createContext, useState, useContext, ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface SnackbarContextType {
  setSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
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
    setSnackbarState({ message, severity, open: true });
  };

  const closeSnackbar = () => {
    setSnackbarState(prev => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ setSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={closeSnackbar} variant="filled" severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
