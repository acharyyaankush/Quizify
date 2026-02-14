import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import authReducer from './authSlice'; // path to your slice
import userExamReducer from './userExamSlice';
import { combineReducers } from 'redux';

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only persist the auth slice
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  userExam: userExamReducer,
});

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // for redux-persist compatibility
    }),
});

// Create persistor
export const persistor = persistStore(store);
