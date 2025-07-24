import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { RootState } from '../app/store';
import TeamSection from '../components/TeamSection';
import TabPanel from '../components/TabPanel';
import ConfirmDialog from '../components/ConfirmDialog';
import InfoDialog from '../components/InfoDialog';
import { calculateExpenses } from '../domain/Expenses';
import Icon from '../components/Icon';
import { CURRENCIES, DEFAULT_CURRENCY } from '../constants';
import {
  updateTrip,
  removePayment,
  addTrip,
  addTeamMember,
  removeTeamMember,
} from '../features/expenses/expensesSlice';
import { getCurrencySymbol } from '../utils/validation';

const TripDetailsScreen = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const trip = useSelector((state: RootState) => 
    state.tripExpenses.find(t => t.id === Number(tripId))
  );

  const [title, setTitle] = useState(trip?.title || '');
  const [currency, setCurrency] = useState(trip?.currency || DEFAULT_CURRENCY);
  const [hasChanged, setHasChanged] = useState(false);
  const [activePanel, setActivePanel] = useState<'split' | 'team' | 'settings'>('split');
  const [userManuallyToggled, setUserManuallyToggled] = useState(false);

  // Reset manual toggle when trip changes (navigation to different trip)
  useEffect(() => {
    setUserManuallyToggled(false);
  }, [tripId]);

  // Default to split panel if there are payments, otherwise team panel
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

  const [teamMemberInfoDialog, setTeamMemberInfoDialog] = useState<{ show: boolean; memberName: string | null }>({
    show: false,
    memberName: null,
  });



  const isNewTrip = !tripId;

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${amount.toFixed(2)}`;
  };

  // Only create a new trip if user has interacted and no trip exists
  useEffect(() => {
    if (isNewTrip && hasChanged && !trip) {
      // Only create trip if there's actual content
      const hasContent = title.trim().length > 0;
      if (hasContent) {
        const newTripId = Date.now();
        dispatch(addTrip({ 
          id: newTripId, 
          title: title || 'New Trip', 
          currency, 
          team: [], 
          payments: [] 
        }));
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
    if (trip) {
      dispatch(addTeamMember({ tripId: trip.id, member }));
    }
  };

  // Check if a user has any expenses (participates in any payments)
  const userHasExpenses = (memberName: string): boolean => {
    if (!trip) return false;
    return trip.payments.some(payment => payment.shares.has(memberName));
  };

  const handleRemoveTeamMember = (memberName: string) => {
    if (trip) {
      const hasExpenses = userHasExpenses(memberName);
      if (hasExpenses) {
        // Show info dialog if user has expenses - can't remove
        setTeamMemberInfoDialog({ show: true, memberName });
      } else {
        // Remove immediately if user has no expenses
        dispatch(removeTeamMember({ tripId: trip.id, memberName }));
      }
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

  const closeTeamMemberInfoDialog = () => {
    setTeamMemberInfoDialog({ show: false, memberName: null });
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

      {/* Tabbed Panel: Team and Split */}
      {trip && (
        <TabPanel
          activeTab={activePanel}
          onTabChange={(tab) => {
            setActivePanel(tab);
            setUserManuallyToggled(true);
          }}
          showSplitTab={trip && trip.payments.length > 0}
          showTeamTab={trip !== null}
          showSettingsTab={trip !== null}
        >
          {activePanel === 'split' && trip && (
            <div className="box mb-6">
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
          )}
          {activePanel === 'team' && trip && (
            <TeamSection
              team={trip.team}
              onAddTeamMember={handleAddTeamMember}
              onRemoveTeamMember={handleRemoveTeamMember}
              onFocus={() => setHasChanged(true)}
            />
          )}
          {activePanel === 'settings' && trip && (
            <div className="box mb-6">
              <div className="field">
                <label className="label is-small">Currency</label>
                <div className="control">
                  <div className="select">
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
          )}
        </TabPanel>
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
              {[...trip.payments]
                .sort((a, b) => b.id - a.id) // Sort by ID descending (newest first)
                .map((payment, index) => (
                <div key={payment.id} className={`${index > 0 ? 'pt-2' : ''} ${index < trip.payments.length - 1 ? 'pb-2 border-bottom' : ''}`}>
                  <div className="columns is-mobile is-vcentered">
                    <div className="column is-clickable" onClick={() => handleEditPayment(payment)}>
                      <div className="is-flex is-align-items-center is-flex-wrap-wrap">
                        <span className="is-size-6-mobile mr-3 has-text-weight-normal py-1">{payment.title}</span>
                        <div className="tags">
                          {Array.from(payment.shares)
                            .filter(([, amount]) => amount > 0) // Only show users who actually paid
                            .sort((a, b) => b[1] - a[1]) // Sort by amount (largest to smallest)
                            .map(([user, amount]) => (
                            <span key={user} className="tag is-info is-light is-small-mobile">
                              {user}: {formatCurrency(amount)}
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

      {teamMemberInfoDialog.show && (
        <InfoDialog
          title="Cannot Remove Team Member"
          message={`Cannot remove "${teamMemberInfoDialog.memberName}" because they participate in expenses. Please remove all expenses involving this team member first.`}
          onClose={closeTeamMemberInfoDialog}
        />
      )}

    </div>
  );
};

export default TripDetailsScreen;
