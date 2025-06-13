import authReducer, { login } from './authSlice';
import { AuthState } from '../../types';

describe('authSlice', () => {
  it('handles login.fulfilled', () => {
    const initialState: AuthState = {
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null,
    };

    const action = {
      type: login.fulfilled.type,
      payload: { token: 'tok', user: { _id: '1', name: 'Test', email: 'test@example.com', avatar: '' } },
    };

    const state = authReducer(initialState, action);

    expect(state.token).toBe('tok');
    expect(state.user).toEqual({ _id: '1', name: 'Test', email: 'test@example.com', avatar: '' });
    expect(state.isAuthenticated).toBe(true);
  });
});
