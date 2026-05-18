import React, { useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

export function useAdminSnackbar() {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSuccess = useCallback((message: string) => {
    setSnackbar({ open: true, message, severity: 'success' });
  }, []);

  const showError = useCallback((message: string) => {
    setSnackbar({ open: true, message, severity: 'error' });
  }, []);

  const handleClose = () => setSnackbar((s) => ({ ...s, open: false }));

  const SnackbarElement = (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={snackbar.severity}
        variant="filled"
        sx={{ fontWeight: 600, borderRadius: 1, minWidth: 280 }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );

  return { showSuccess, showError, SnackbarElement };
}
