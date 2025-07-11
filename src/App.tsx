import { Routes, Route } from 'react-router';
import { useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import TripDetailsScreen from './screens/TripDetailsScreen';
import { registerServiceWorker } from './utils/pwa';
import './App.css'

function App() {
  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker();
  }, []);

  return (
    <Routes>
      <Route index element={<HomeScreen />} />
      <Route path="/trip/:tripId?" element={<TripDetailsScreen />} />
    </Routes>
  );
}

export default App
