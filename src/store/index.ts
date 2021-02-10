import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import loginReducer from './auth-slice';

const store = configureStore({
  reducer: {
    authSlice: loginReducer,
  },
  middleware: (getDefaultMiddleware) =>
    process.env.NODE_ENV === 'development'
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'development',
});

export type AppDispatch = typeof store.dispatch;
export default store;
