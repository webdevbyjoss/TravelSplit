import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Payment, Person, TripExpenses } from '../../domain/Expenses.ts';

// Define initial state type
export type TripExpensesState = TripExpenses[];

// Initial state
const initialState: TripExpensesState = [];

export const tripExpensesSlice = createSlice({
  name: 'tripExpenses',
  initialState,
  reducers: {
    // Add a new trip
    addTrip(state, action: PayloadAction<TripExpenses>) {
      state.push(action.payload);
    },

    // Remove a trip by ID
    removeTrip: (state, action: PayloadAction<{ id: number }>) => {
      return state.filter(trip => trip.id !== action.payload.id);
    },

    // Update a trip by ID
    updateTrip(state, action: PayloadAction<TripExpenses>) {
      const tripIndex = state.findIndex(trip => trip.id === action.payload.id);
      if (tripIndex !== -1) {
        state[tripIndex] = action.payload;
      }
    },

    // Add a team member to a specific trip
    addTeamMember: (state, action: PayloadAction<{ tripId: number, member: Person }>) => {
      const trip = state.find(trip => trip.id === action.payload.tripId);
      if (trip) {
        const existingMember = trip.team.find(member => member.name === action.payload.member.name);
        if (!existingMember) {
          trip.team.push(action.payload.member);
        }
      }
    },

    // Remove a team member from a specific trip
    removeTeamMember: (state, action: PayloadAction<{ tripId: number, memberName: string }>) => {
      const trip = state.find(trip => trip.id === action.payload.tripId);
      if (trip) {
        trip.team = trip.team.filter(member => member.name !== action.payload.memberName);
      }
    },

    // Add a payment to a specific trip
    addPayment: (state, action: PayloadAction<{ tripId: number, payment: Payment }>) => {
      const trip = state.find(trip => trip.id === action.payload.tripId);
      if (trip) {
        const existingPayment = trip.payments.find(payment => payment.id === action.payload.payment.id);
        if (!existingPayment) {
          trip.payments.push(action.payload.payment);
        }
      }
    },

    // Remove a payment from a specific trip by ID
    removePayment: (state, action: PayloadAction<{ tripId: number, paymentId: number }>) => {
      const trip = state.find(trip => trip.id === action.payload.tripId);
      if (trip) {
        trip.payments = trip.payments.filter(payment => payment.id !== action.payload.paymentId);
      }
    }
  }
});

export const {
  addTrip,
  updateTrip,
  removeTrip,
  addTeamMember,
  removeTeamMember,
  addPayment,
  removePayment
} = tripExpensesSlice.actions;

export default tripExpensesSlice;
