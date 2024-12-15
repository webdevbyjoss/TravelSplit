import { Routes, Route } from 'react-router';
import HomeScreen from './screens/HomeScreen';
import TripDetailsScreen from './screens/TripDetailsScreen';
import PaymentDetailsScreen from './screens/PaymentDetailsScreen';
import './App.css'

function App() {
  return (
      <Routes>
        <Route index element={<HomeScreen />} />
        <Route path="/trip/:tripId?" element={<TripDetailsScreen />} />
        <Route path="/trip/:tripId/payment/:paymentId?" element={<PaymentDetailsScreen />} />
      </Routes>
  );
}

export default App
