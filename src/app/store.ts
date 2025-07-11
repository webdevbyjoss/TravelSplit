import { configureStore, combineReducers } from '@reduxjs/toolkit';
import tripExpensesSlice from '../features/expenses/expensesSlice';
import TripExpensesPersistTransform from './transform';

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
  key: 'TravelSplit', // Key to persist the store under
  storage,
  transforms: [TripExpensesPersistTransform],
  whitelist: ['tripExpenses'], // Only persist tripExpenses
}

const rootReducer = combineReducers({
  tripExpenses: tripExpensesSlice.reducer,
});

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default rootReducer;
