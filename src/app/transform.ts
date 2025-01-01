import { createTransform } from 'redux-persist';
import { TripExpensesState } from '../features/expenses/expensesSlice';
import { Person } from '../domain/Expenses';

export type SerializedPayment = {
  id: number;
  title: string;
  shares: { [key: string]: number }; // Serialized form of Map
};

export type SerializedTripExpenses = {
  id: number;
  title: string;
  team: Person[];
  payments: SerializedPayment[];
};

export type SerializedTripExpensesState = SerializedTripExpenses[];

const TripExpensesPersistTransform = createTransform<
  TripExpensesState, // In-memory state type
  SerializedTripExpensesState // Serialized state type
>(
  // Transform inbound state (saving to storage)
  (inboundState: TripExpensesState): SerializedTripExpensesState =>
    inboundState.map(trip => ({
      ...trip,
      payments: trip.payments.map(payment => ({
        ...payment,
        shares: Object.fromEntries(payment.shares), // Convert Map to Object
      })),
    })),
  // Transform outbound state (loading from storage)
  (outboundState: SerializedTripExpensesState): TripExpensesState =>
    outboundState.map(trip => ({
      ...trip,
      payments: trip.payments.map(payment => ({
        ...payment,
        shares: new Map(Object.entries(payment.shares)), // Convert Object back to Map
      })),
    })),
  { whitelist: ['tripExpenses'] } // Apply only to the `tripExpenses` slice
);

export default TripExpensesPersistTransform;
