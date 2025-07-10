import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { useParams, useNavigate } from 'react-router';
import PaymentDetailsScreen from './PaymentDetailsScreen';
import TeamSection from '../components/TeamSection';
import { calculateExpenses } from '../domain/Expenses';
import {
  addTrip,
  updateTrip,
  addTeamMember,
  removeTeamMember,
  addPayment,
  removePayment,
} from '../features/expenses/expensesSlice';

const TripDetailsScreen: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const trip = useSelector((state: RootState) => state.tripExpenses.find(t => t.id === Number(tripId)));
  const [title, setTitle] = useState(trip?.title || '');
  const [currency, setCurrency] = useState(trip?.currency || 'USD');
  const [hasChanged, setHasChanged] = useState(false);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<{ title: string; shares: Map<string, number> } | null>(null);

  const isNewTrip = !tripId;

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    const currencySymbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'CHF': 'CHF',
      'CNY': '¥',
      'INR': '₹',
      'BRL': 'R$',
      'UAH': '₴'
    };
    const symbol = currencySymbols[currency] || '$';
    return `${symbol}${amount.toFixed(2)}`;
  };

  // Only create a new trip if user has interacted and no trip exists
  useEffect(() => {
    if (isNewTrip && hasChanged && !trip) {
      // Only create trip if there's actual content
      const hasContent = title.trim().length > 0;
      if (hasContent) {
        const newTripId = Date.now();
        dispatch(addTrip({ id: newTripId, title: title || 'New Trip', currency, team: [], payments: [] }));
        navigate(`/trip/${newTripId}`);
      }
    }
  }, [isNewTrip, hasChanged, trip, title, dispatch, navigate]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setHasChanged(true);
    
    if (trip) {
      dispatch(updateTrip({ ...trip, title: newTitle }));
    }
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    setHasChanged(true);
    
    if (trip) {
      dispatch(updateTrip({ ...trip, currency: newCurrency }));
    }
  };

  const handleAddTeamMember = (member: { name: string }) => {
    setHasChanged(true);
    
    if (!trip) {
      // Create trip if it doesn't exist yet
      const newTripId = Date.now();
      dispatch(addTrip({ id: newTripId, title: title || 'New Trip', currency, team: [member], payments: [] }));
      navigate(`/trip/${newTripId}`);
    } else {
      dispatch(addTeamMember({ tripId: trip.id, member }));
    }
  };

  const handleRemoveTeamMember = (memberName: string) => {
    if (trip) {
      dispatch(removeTeamMember({ tripId: trip.id, memberName }));
    }
  };

  const handleAddPayment = (paymentTitle: string, paymentShares: Map<string, number>) => {
    if (trip) {
      const payment = {
        id: Date.now(),
        title: paymentTitle,
        shares: paymentShares,
      };
      dispatch(addPayment({ tripId: trip.id, payment }));
    }
  };

  const handleRemovePayment = (paymentId: number) => {
    if (trip) {
      dispatch(removePayment({ tripId: trip.id, paymentId }));
    }
  };

  const handleEditPayment = (payment: { title: string; shares: Map<string, number> }) => {
    setPaymentToEdit(payment);
    setIsPaymentModalOpen(true);
  };

  const handleSavePayment = (paymentTitle: string, paymentShares: Map<string, number>) => {
    if (trip && paymentToEdit) {
      const updatedPayments = trip.payments.map((payment) =>
        payment.title === paymentToEdit.title
          ? { ...payment, title: paymentTitle, shares: paymentShares }
          : payment
      );

      dispatch(updateTrip({ ...trip, payments: updatedPayments }));
      setPaymentToEdit(null);
      setIsPaymentModalOpen(false);
    }
  };

  // Always recalculate balances from the latest trip state
  const userBalances = trip ? calculateExpenses(trip) : null;

  // Separate users by balance
  const usersWithNegativeBalance: [string, number][] = [];
  const usersWithPositiveBalance: [string, number][] = [];

  if (userBalances) {
    Array.from(userBalances.entries()).forEach(([userName, balance]) => {
      if (balance < 0) {
        usersWithNegativeBalance.push([userName, balance]);
      } else if (balance > 0) {
        usersWithPositiveBalance.push([userName, balance]);
      }
    });
  }

  return (
    <div className="container">
      <div className="columns is-mobile is-vcentered">
        <div className="column is-narrow">
          <button className="button is-small-mobile" onClick={() => navigate(`/`)}>
            <span className="icon">
              <i className="fas fa-arrow-left"></i>
            </span>
          </button>
        </div>
        <div className="column">
          <input
            className="input is-small-mobile"
            type="text"
            placeholder="Trip title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onFocus={() => setHasChanged(true)}
            style={{ fontSize: '1.1rem', fontWeight: '600' }}
          />
        </div>
      </div>

      {trip && trip.payments.length > 0 && (
        <div className="box">
          <h2 className="subtitle has-text-weight-normal has-text-grey-dark">
            <div className="columns is-mobile is-vcentered">
              <div className="column">
                <span className="icon-text">
                  <span className="icon">
                    <i className="fa-solid fa-calculator"></i>
                  </span>
                  <span>Summary</span>
                </span>
              </div>
              <div className="column is-narrow">
                <div className="select is-small">
                  <select value={currency} onChange={(e) => handleCurrencyChange(e.target.value)}>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="AUD">AUD (A$)</option>
                    <option value="CHF">CHF (CHF)</option>
                    <option value="CNY">CNY (¥)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="BRL">BRL (R$)</option>
                    <option value="UAH">UAH (₴)</option>
                  </select>
                </div>
              </div>
            </div>
          </h2>
          <div className="columns is-mobile">
            {/* Left Column - Users with negative balance (need to pay) */}
            <div className="column">
              <h3 className="title is-6-mobile is-5 has-text-danger">
                <span className="icon-text">
                  <span className="icon">
                    <i className="fa-solid fa-arrow-down"></i>
                  </span>
                  <span>Put</span>
                </span>
              </h3>
              {usersWithNegativeBalance.length > 0 ? (
                <div className="tags">
                  {usersWithNegativeBalance.map(([userName, balance]) => (
                    <span key={userName} className="tag is-danger is-light is-small-mobile is-medium">
                      {userName}: {formatCurrency(Math.abs(balance))}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="has-text-grey">
                  <span className="icon-text">
                    <span className="icon">
                      <i className="fa-solid fa-check"></i>
                    </span>
                    <span>No one needs to pay</span>
                  </span>
                </p>
              )}
            </div>
            
            {/* Right Column - Users with positive balance (will receive) */}
            <div className="column">
              <h3 className="title is-6-mobile is-5 has-text-success">
                <span className="icon-text">
                  <span className="icon">
                    <i className="fa-solid fa-arrow-up"></i>
                  </span>
                  <span>Get</span>
                </span>
              </h3>
              {usersWithPositiveBalance.length > 0 ? (
                <div className="tags">
                  {usersWithPositiveBalance.map(([userName, balance]) => (
                    <span key={userName} className="tag is-success is-light is-small-mobile is-medium">
                      {userName}: {formatCurrency(balance)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="has-text-grey">
                  <span className="icon-text">
                    <span className="icon">
                      <i className="fa-solid fa-check"></i>
                    </span>
                    <span>No one will receive money</span>
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {trip && trip.team.length > 1 && (
      <h2 className="subtitle has-text-weight-normal has-text-grey-dark">
        <div className="columns is-mobile is-vcentered">
          <div className="column">Payments</div>
          <div className="column is-narrow">
            <button
              className="button is-primary is-small-mobile"
              type="button"
              onClick={() => {
                setPaymentToEdit(null);
                setIsPaymentModalOpen(true);
              }}
            >
              <span className="icon">
                <i className="fas fa-plus"></i>
              </span>
            </button>
          </div>
        </div>
      </h2>)}

      {trip && (trip.payments.length > 0) && (
        <div className="box">
          {trip.payments.map((payment, index) => (
            <div key={payment.id} className={`${index > 0 ? 'pt-3 mt-3' : ''} ${index < trip.payments.length - 1 ? 'pb-3 border-bottom' : ''}`}>
              <div className="columns is-mobile is-vcentered mb-1">
                <div className="column">
                  <strong className="is-size-6-mobile">{payment.title}</strong>
                </div>
                <div className="column is-narrow">
                  <div className="buttons are-small">
                    <button
                      className="button is-warning is-light is-small-mobile"
                      onClick={() => handleEditPayment(payment)}
                    >
                      <span className="icon">
                        <i className="fa-solid fa-pencil"></i>
                      </span>
                    </button>
                    <button
                      className="button is-danger is-light is-small-mobile"
                      onClick={() => handleRemovePayment(payment.id)}
                    >
                      <span className="icon">
                        <i className="fa-solid fa-trash-can"></i>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="tags">
                {Array.from(payment.shares).map(([user, amount]) => (
                  <span key={user} className="tag is-info is-light is-small-mobile">
                    {user}{amount > 0 ? `: ${formatCurrency(amount)}` : ''}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isPaymentModalOpen && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setIsPaymentModalOpen(false)}></div>
          <div className="modal-card">
            <header className="modal-card-head py-4">
              <p className="modal-card-title">{paymentToEdit ? 'Edit Payment' : 'New Payment'}</p>
              <button
                className="delete"
                aria-label="close"
                onClick={() => setIsPaymentModalOpen(false)}
              ></button>
            </header>
            <section className="modal-card-body">
              <PaymentDetailsScreen
                team={trip?.team || []}
                onSave={(title, shares) => {
                    if (paymentToEdit) {
                      handleSavePayment(title, shares);
                    } else {
                      handleAddPayment(title, shares);
                      setIsPaymentModalOpen(false);
                    }
                  }
                }
                initialTitle={paymentToEdit?.title || ''}
                initialShares={paymentToEdit?.shares || new Map()}
              />
            </section>
          </div>
        </div>
      )}

<TeamSection
        team={trip?.team || []}
        onAddTeamMember={handleAddTeamMember}
        onRemoveTeamMember={handleRemoveTeamMember}
        onFocus={() => setHasChanged(true)}
      />

    </div>
  );
};

export default TripDetailsScreen;
