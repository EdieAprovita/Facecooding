import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertState } from '../../types';

const initialState: AlertState = {
  alerts: [],
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: {
      reducer: (state, action: PayloadAction<Alert>) => {
        state.alerts.push(action.payload);
      },
      prepare: (msg: string, alertType: 'success' | 'error' | 'warning' | 'info' = 'info') => ({
        payload: {
          id: uuidv4(),
          msg,
          alertType,
        },
      }),
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
  },
});

export const { setAlert, removeAlert } = alertSlice.actions;
export default alertSlice.reducer;
