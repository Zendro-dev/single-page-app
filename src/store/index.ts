import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import loginReducer from './auth-slice';
import { REDUX_LOGGER } from '@/config/globals';
import {} from 'react-redux';

const store = configureStore({
  reducer: {
    authSlice: loginReducer,
  },
  middleware: (getDefaultMiddleware) =>
    process.env.NODE_ENV === 'development' && REDUX_LOGGER === 'true'
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'development',
});

export type AppDispatch = typeof store.dispatch;
export default store;
