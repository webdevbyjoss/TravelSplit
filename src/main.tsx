import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './app/store'
import { Provider } from 'react-redux'

import './index.css'
import App from './App.tsx'

import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<LoadingSpinner message="Loading your trips..." />} persistor={persistor}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
)
