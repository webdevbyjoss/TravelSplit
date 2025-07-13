import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { useParams, useNavigate } from 'react-router';
import TeamSection from '../components/TeamSection';
import ConfirmDialog from '../components/ConfirmDialog';
import { calculateExpenses } from '../domain/Expenses';
import Icon from '../components/Icon';
import { CURRENCIES, DEFAULT_CURRENCY } from '../constants';
import {
  addTrip,
  updateTrip,
  addTeamMember,
  removeTeamMember,
  removePayment,
} from '../features/expenses/expensesSlice';

const TripDetailsScreen: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const trip = useSelector((state: RootState) => state.tripExpenses.find(t => t.id === Number(tripId)));
  const [title, setTitle] = useState(trip?.title || '');
  const [currency, setCurrency] = useState(trip?.currency || DEFAULT_CURRENCY);
  const [hasChanged, setHasChanged] = useState(false);
  const [activePanel, setActivePanel] = useState<'split' | 'team'>('split');
  const [userManuallyToggled, setUserManuallyToggled] = useState(false);

  // Reset manual toggle when trip changes (navigation to different trip)
  useEffect(() => {
    setUserManuallyToggled(false);
  }, [tripId]);

  // Default to team panel if there are no payments yet or no trip exists
  useEffect(() => {
    if ((!trip || (trip && trip.payments.length === 0)) && activePanel !== 'team' && !userManuallyToggled) {
      setActivePanel('team');
    }
  }, [trip, activePanel, userManuallyToggled]);

  // Switch to Split panel when the first payment is added (only if user hasn't manually toggled)
  useEffect(() => {
    if (trip && trip.payments.length === 1 && activePanel === 'team' && !userManuallyToggled) {
      setActivePanel('split');
    }
  }, [trip, activePanel, userManuallyToggled]);

  const [paymentConfirmDialog, setPaymentConfirmDialog] = useState<{ show: boolean; paymentId: number | null; paymentTitle: string }>({
    show: false,
    paymentId: null,
    paymentTitle: '',
  });

  const isNewTrip = !tripId;

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    const symbol = CURRENCIES[currency as keyof typeof CURRENCIES]?.symbol || CURRENCIES[DEFAULT_CURRENCY].symbol;
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
  }, [isNewTrip, hasChanged, trip, title, currency, dispatch, navigate]);

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

  const handleRemovePayment = (paymentId: number, paymentTitle: string) => {
    setPaymentConfirmDialog({ show: true, paymentId, paymentTitle });
  };

  const confirmPaymentRemoval = () => {
    if (paymentConfirmDialog.paymentId !== null && trip) {
      dispatch(removePayment({ tripId: trip.id, paymentId: paymentConfirmDialog.paymentId }));
    }
    setPaymentConfirmDialog({ show: false, paymentId: null, paymentTitle: '' });
  };

  const cancelPaymentRemoval = () => {
    setPaymentConfirmDialog({ show: false, paymentId: null, paymentTitle: '' });
  };

  const handleAddNewPayment = () => {
    navigate(`/trip/${tripId}/payment`);
  };

  const handleEditPayment = (payment: { id: number; title: string; shares: Map<string, number> }) => {
    navigate(`/trip/${tripId}/payment/${payment.id}`);
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
    
    // Sort by absolute balance amount (largest to smallest)
    usersWithNegativeBalance.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
    usersWithPositiveBalance.sort((a, b) => b[1] - a[1]);
  }

  return (
    <div className="container">
      <div className="columns is-mobile is-vcentered mb-2">
        <div className="column is-narrow">
          <button className="button is-small-mobile" onClick={() => navigate(`/`)}>
            <span className="icon">
              <Icon name="fas fa-arrow-left" />
            </span>
          </button>
        </div>
        <div className="column">
          <input
            className="input is-small-mobile"
            type="text"
            placeholder="How do you name this trip?"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onFocus={() => setHasChanged(true)}
          />
        </div>
      </div>

      {/* Panel Switcher: Split (balances) or Team */}
      {(trip || isNewTrip) && (
        activePanel === 'split' ? (
          trip && (
            <div className="box mb-6">
              <h2 className="subtitle has-text-weight-normal has-text-grey-dark mb-2">
                <div className="columns is-mobile is-vcentered">
                  <div className="column">
                    <span className="icon-text">
                      <span className="icon">
                        <Icon name="fa-solid fa-calculator" size={24} />
                      </span>
                      <span>Split</span>
                    </span>
                  </div>
                                  <div className="column is-narrow">
                  <div className="buttons are-small is-align-items-center">
                    <button
                      className="button is-info is-light is-small-mobile"
                      onClick={() => {
                        setActivePanel('team');
                        setUserManuallyToggled(true);
                      }}
                    >
                    <span className="icon">
                      <Icon name="fa-solid fa-users" size={20} />
                    </span>
                    </button>
                    <div className="select is-small">
                      <select 
                        value={currency} 
                        onChange={(e) => handleCurrencyChange(e.target.value)}
                      >
                        {Object.entries(CURRENCIES).map(([code, currency]) => (
                          <option key={code} value={code}>
                            {code} ({currency.symbol})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  </div>
                </div>
              </h2>
              {/* Balances summary */}
              <div className="columns is-mobile">
                {/* Left Column - Users with negative balance (need to pay) */}
                <div className="column">
                  <h3 className="title is-6-mobile is-5 has-text-danger mb-1">
                    <span className="icon-text">
                      <span className="icon">
                        <Icon name="fa-solid fa-arrow-down" />
                      </span>
                      <span>Give</span>
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
                          <Icon name="fa-solid fa-check" />
                        </span>
                        <span>No one needs to pay</span>
                      </span>
                    </p>
                  )}
                </div>
                {/* Right Column - Users with positive balance (will receive) */}
                <div className="column">
                  <h3 className="title is-6-mobile is-5 has-text-success mb-1">
                    <span className="icon-text">
                      <span className="icon">
                        <Icon name="fa-solid fa-arrow-up" />
                      </span>
                      <span>Take</span>
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
                          <Icon name="fa-solid fa-check" />
                        </span>
                        <span>No one will receive money</span>
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        ) : (
          <TeamSection
            team={trip?.team || []}
            onAddTeamMember={handleAddTeamMember}
            onRemoveTeamMember={handleRemoveTeamMember}
            onFocus={() => setHasChanged(true)}
            onSwitchToSplit={() => {
              setActivePanel('split');
              setUserManuallyToggled(true);
            }}
            showSplitButton={trip && trip.payments.length > 0}
          />
        )
      )}

      {/* Expenses section always visible if trip and team */}
      {trip && trip.team.length > 1 && (
        <>
          <h2 className="subtitle has-text-weight-normal has-text-grey-dark mb-2">
            <div className="columns is-mobile is-vcentered">
              <div className="column">Expenses</div>
              <div className="column is-narrow">
                <button
                  className="button is-primary is-small-mobile"
                  type="button"
                  onClick={handleAddNewPayment}
                >
                  <span className="icon">
                    <Icon name="fas fa-plus" />
                  </span>
                </button>
              </div>
            </div>
          </h2>
          {trip.payments.length > 0 && (
            <div className="box">
              {trip.payments
                .sort((a, b) => b.id - a.id) // Sort by ID descending (newest first)
                .map((payment, index) => (
                <div key={payment.id} className={`${index > 0 ? 'pt-2' : ''} ${index < trip.payments.length - 1 ? 'pb-2 border-bottom' : ''}`}>
                  <div className="columns is-mobile is-vcentered">
                    <div className="column is-clickable" onClick={() => handleEditPayment(payment)}>
                      <div className="is-flex is-align-items-center is-flex-wrap-wrap">
                        <span className="is-size-6-mobile mr-3 has-text-weight-normal py-1">{payment.title}</span>
                        <div className="tags">
                          {Array.from(payment.shares)
                            .sort((a, b) => b[1] - a[1]) // Sort by amount (largest to smallest)
                            .map(([user, amount]) => (
                            <span key={user} className="tag is-info is-light is-small-mobile">
                              {user}{amount > 0 ? `: ${formatCurrency(amount)}` : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="column is-narrow">
                      <div className="buttons are-small">
                        <button
                          className="button is-warning is-light is-small-mobile"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPayment(payment);
                          }}
                        >
                          <span className="icon">
                            <Icon name="fa-solid fa-pencil" />
                          </span>
                        </button>
                        <button
                          className="button is-danger is-light is-small-mobile"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePayment(payment.id, payment.title);
                          }}
                        >
                          <span className="icon">
                            <Icon name="fa-solid fa-trash-can" />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {paymentConfirmDialog.show && (
        <ConfirmDialog
          title="Confirm Payment Removal"
          message={`Are you sure you want to remove the payment "${paymentConfirmDialog.paymentTitle}"?`}
          onConfirm={confirmPaymentRemoval}
          onCancel={cancelPaymentRemoval}
        />
      )}

    </div>
  );
};

export default TripDetailsScreen;
