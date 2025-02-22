import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './app/store'
import { Provider } from 'react-redux'

import './index.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
)
