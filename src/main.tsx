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
import { registerServiceWorker, setupInstallPrompt } from './utils/pwa';
import { initializeTheme } from './utils/theme';

// Register service worker and setup PWA functionality
registerServiceWorker();
setupInstallPrompt();

// Initialize theme system
initializeTheme();

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
