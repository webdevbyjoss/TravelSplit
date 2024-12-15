import { configureStore, combineReducers } from '@reduxjs/toolkit';
import tripExpensesSlice from '../features/expenses/expensesSlice';

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
  key: 'TravelSplit', // Key to persist the store under
  storage,
}

const rootReducer = combineReducers({
  tripExpenses: tripExpensesSlice.reducer,
  // Add other reducers here if necessary
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for Redux Persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
