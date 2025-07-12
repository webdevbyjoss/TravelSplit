import { Routes, Route } from 'react-router';
import { useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import TripDetailsScreen from './screens/TripDetailsScreen';
import UpdateNotification from './components/UpdateNotification';
import { registerServiceWorker } from './utils/pwa';
import './App.css'

function App() {
  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker();
  }, []);

  return (
    <>
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
          borderBottom: '1px solid #3298dc',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      />
      <Routes>
        <Route index element={<HomeScreen />} />
        <Route path="/trip/:tripId?" element={<TripDetailsScreen />} />
      </Routes>
    </>
  );
}

export default App
