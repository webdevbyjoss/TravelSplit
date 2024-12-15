import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { useParams } from 'react-router';

const PaymentDetailsScreen: React.FC = () => {
  const { tripId, paymentId } = useParams<{ tripId: string; paymentId: string }>();
  const trip = useSelector((state: RootState) => state.tripExpenses.find(t => t.id === Number(tripId)));
  const payment = trip?.payments.find(p => p.id === Number(paymentId));

  if (!trip || !payment) {
    return <div>Payment not found</div>;
  }

  return (
    <div>
      <h1>Payment Details</h1>
  <h2>{payment.title}</h2>
  <p>Shares:</p>
  <ul>
  {Array.from(payment.shares.entries()).map(([name, amount]) => (
      <li key={name}>{name}: {amount}</li>
))}
  </ul>
  </div>
);
};

export default PaymentDetailsScreen;
