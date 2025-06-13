'use client';
import React from 'react';
import { Alert as MUIAlert, Snackbar, Box } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeAlert } from '../../store/slices/alertSlice';
import { Alert as AlertType } from '../../types';

const Alert = () => {
  const dispatch = useAppDispatch();
  const alerts = useAppSelector((state) => state.alert.alerts);

  const handleClose = (id: string) => {
    dispatch(removeAlert(id));
  };

  return (
    <Box sx={{ position: 'fixed', top: 80, right: 16, zIndex: 1300 }}>
      {alerts.map((alert: AlertType) => (
        <Snackbar
          key={alert.id}
          open={true}
          autoHideDuration={5000}
          onClose={() => handleClose(alert.id)}
          sx={{ position: 'relative', mb: 1 }}
        >
          <MUIAlert
            onClose={() => handleClose(alert.id)}
            severity={alert.alertType}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {alert.msg}
          </MUIAlert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default Alert;
