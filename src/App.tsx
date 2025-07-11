import { Routes, Route } from 'react-router';
import HomeScreen from './screens/HomeScreen';
import TripDetailsScreen from './screens/TripDetailsScreen';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route index element={<HomeScreen />} />
        <Route path="/trip/:tripId?" element={<TripDetailsScreen />} />
      </Routes>
      <PWAUpdatePrompt />
    </>
  );
}

export default App
