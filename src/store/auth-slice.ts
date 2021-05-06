import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  AuthError,
  AUTH_REQUEST_CANCELLED,
  User,
  UserRequest,
} from '../types/auth';
import { authenticateFromRemote, authenticateFromToken } from '../utils/auth';
import { localStorage } from '../utils/storage';

import { AuthState } from '../types/auth';

/**
 * Asynchronous dispatch function to authenticate the user.
 */
export const logUserIn = createAsyncThunk<
  User | undefined,
  UserRequest,
  { state: AuthState }
>('auth/logUserIn', async ({ email, password }: UserRequest, thunkAPI) => {
  const { user, error } = await authenticateFromRemote(email, password);
  if (error) throw error;
  const state = thunkAPI.getState();
  if (state.status === 'cancelled')
    throw new AuthError(
      AUTH_REQUEST_CANCELLED,
      `Cancelled user login: ${email}`
    );
  return user;
});

/**
 * Slice intitial seed based on an existing JWT.
 */
const initialState = (): AuthState => {
  const { user } = authenticateFromToken();
  return {
    user,
    status: user ? 'success' : 'idle',
  };
};

/**
 * State slice describing the current user.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: initialState(),
  reducers: {
    logUserOut: (state) => {
      localStorage.removeItem('token');
      return {
        ...state,
        user: undefined,
        status: 'idle',
      };
    },
    cancelLogin: (state) => {
      return {
        ...state,
        status: 'cancelled',
      };
    },
    expireUser: (state) => {
      return {
        ...state,
        status: 'expired',
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logUserIn.pending, (state) => {
      return {
        ...state,
        status: 'loading',
      };
    });
    builder.addCase(logUserIn.fulfilled, (state, action) => {
      return {
        ...state,
        status: 'success',
        user: action.payload,
      };
    });
    builder.addCase(logUserIn.rejected, (state, action) => {
      return {
        ...state,
        status: 'failed',
        error: action.error as AuthError,
      };
    });
  },
});

/**
 * Synchronous dispatch action to logout the user.
 */
export const { cancelLogin, expireUser, logUserOut } = authSlice.actions;

/**
 * Selector variable to use in components via the **useSelector** hook.
 * @param state current state slice object.
 */
export const authSelector = (state: { authSlice: AuthState }): AuthState =>
  state.authSlice;

/**
 * Auth slice reducer to configure the store, either directly or combined in a root reducer.
 */
export default authSlice.reducer;
