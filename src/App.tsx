import { Routes, Route } from 'react-router';
import { useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import TripDetailsScreen from './screens/TripDetailsScreen';
import PaymentDetailsScreen from './screens/PaymentDetailsScreen';
import ShareScreen from './screens/ShareScreen';
import UpdateNotification from './components/UpdateNotification';
import IosInstallPrompt from './components/IosInstallPrompt';
import { registerServiceWorker } from './utils/pwa';
import './App.css'

function App() {
  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker();
  }, []);

  return (
    <>
      <IosInstallPrompt />
      <UpdateNotification 
        className="is-fixed-top" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 3000,
          margin: 0,
          borderRadius: 0,
          borderBottom: '1px solid var(--button-info-bg)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      />
      <Routes>
        <Route index element={<HomeScreen />} />
        <Route path="/trip/:tripId?" element={<TripDetailsScreen />} />
        <Route path="/trip/:tripId/payment/:paymentId?" element={<PaymentDetailsScreen />} />
        <Route path="/trip/:tripId/share" element={<ShareScreen />} />
      </Routes>
    </>
  );
}

export default App
