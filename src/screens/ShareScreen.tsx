import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router';
import { RootState } from '../app/store';
import { updateTrip, addTrip } from '../features/expenses/expensesSlice';
import { 
  deserializeTripFromSharing, 
  calculateTripDiff, 
  mergeTripData,
  extractShareDataFromUrl,
  validateShareData,
  ShareDiff
} from '../utils/serialization';
import { TripExpenses } from '../domain/Expenses';
import { getCurrencySymbol } from '../utils/validation';
import { CURRENCIES, DEFAULT_CURRENCY } from '../constants';
import Icon from '../components/Icon';
import ConfirmDialog from '../components/ConfirmDialog';

const ShareScreen: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const currentTrip = useSelector((state: RootState) => 
    state.tripExpenses.find(t => t.id === Number(tripId))
  );
  
  const [sharedTrip, setSharedTrip] = useState<TripExpenses | null>(null);
  const [diff, setDiff] = useState<ShareDiff | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const loadSharedData = () => {
      try {
        setIsLoading(true);
        setError(null);

        // Extract data from URL
        const shareData = extractShareDataFromUrl(location.pathname + location.search);
        
        if (!shareData) {
          setError('Invalid share URL. No data found.');
          return;
        }

        // Validate and deserialize the data
        if (!validateShareData(shareData)) {
          setError('Invalid share data. The link may be corrupted or outdated.');
          return;
        }

        const deserializedTrip = deserializeTripFromSharing(shareData);
        
        if (!deserializedTrip) {
          setError('Failed to load shared trip data.');
          return;
        }

        setSharedTrip(deserializedTrip);

        // Calculate diff if we have a current trip
        if (currentTrip) {
          const tripDiff = calculateTripDiff(currentTrip, deserializedTrip);
          setDiff(tripDiff);
        }

      } catch (err) {
        setError('Failed to process shared data. Please check the link and try again.');
        console.error('Share screen error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedData();
  }, [location, currentTrip]);

  const handleApplyChanges = () => {
    if (!sharedTrip) return;

    if (currentTrip) {
      // Merge with existing trip
      const mergedTrip = mergeTripData(currentTrip, sharedTrip);
      dispatch(updateTrip(mergedTrip));
    } else {
      // Create new trip
      dispatch(addTrip(sharedTrip));
    }

    // Navigate to the trip
    navigate(`/trip/${sharedTrip.id}`);
  };

  const handleRejectChanges = () => {
    navigate('/');
  };

  const formatCurrency = (amount: number, currency: string): string => {
    const symbol = CURRENCIES[currency as keyof typeof CURRENCIES]?.symbol || CURRENCIES[DEFAULT_CURRENCY].symbol;
    return `${symbol}${amount.toFixed(2)}`;
  };

  // Helper function to check if there are changes to apply
  const hasChanges = (): boolean => {
    if (!diff) return false;
    return diff.newPayments.length > 0 || 
           diff.updatedPayments.length > 0 || 
           diff.newTeamMembers.length > 0 || 
           Object.keys(diff.updatedTrip).length > 0;
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="section has-text-centered">
          <div className="notification is-info is-light">
            <span className="icon-text">
              <span className="icon">
                <Icon name="fas fa-spinner fa-spin" />
              </span>
              <span>Loading shared trip data...</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="section">
          <div className="columns is-mobile is-vcentered mb-2">
            <div className="column is-narrow">
              <button className="button is-small-mobile" onClick={() => navigate('/')}>
                <span className="icon">
                  <Icon name="fas fa-arrow-left" />
                </span>
              </button>
            </div>
            <div className="column">
              <h1 className="title is-4-mobile has-text-weight-normal has-text-grey-dark">Share Import</h1>
            </div>
          </div>
          
          <div className="notification is-danger is-light">
            <span className="icon-text">
              <span className="icon">
                <Icon name="fas fa-exclamation-triangle" />
              </span>
              <span><strong>Error:</strong> {error}</span>
            </span>
          </div>
          
          <div className="buttons">
            <button className="button is-primary" onClick={() => navigate('/')}>
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!sharedTrip) {
    return (
      <div className="container">
        <div className="section">
          <div className="notification is-warning is-light">
            <span className="icon-text">
              <span className="icon">
                <Icon name="fas fa-exclamation-triangle" />
              </span>
              <span>No shared trip data found.</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section">
        <div className="columns is-mobile is-vcentered mb-2">
          <div className="column is-narrow">
            <button className="button is-small-mobile" onClick={() => navigate('/')}>
              <span className="icon">
                <Icon name="fas fa-arrow-left" />
              </span>
            </button>
          </div>
          <div className="column">
            <h1 className="title is-4-mobile has-text-weight-normal has-text-grey-dark">Import Shared Trip</h1>
          </div>
        </div>

        {/* Shared Trip Info */}
        <div className="box mb-4">
          <h2 className="title is-5 has-text-weight-normal has-text-grey-dark mb-3">
            <span className="icon-text">
              <span className="icon">
                <Icon name="fas fa-share-alt" />
              </span>
              <span>Shared Trip: {sharedTrip.title}</span>
            </span>
          </h2>
          
          <div className="columns is-mobile">
            <div className="column">
              <p className="has-text-grey">
                <strong>Team:</strong> {sharedTrip.team.map(m => m.name).join(', ')}
              </p>
              <p className="has-text-grey">
                <strong>Currency:</strong> {sharedTrip.currency} ({getCurrencySymbol(sharedTrip.currency)})
              </p>
              <p className="has-text-grey">
                <strong>Payments:</strong> {sharedTrip.payments.length}
              </p>
            </div>
          </div>
        </div>

        {/* Diff Information */}
        {diff && hasChanges() && (
          <div className="box mb-4">
            <h3 className="title is-6 has-text-weight-normal has-text-grey-dark mb-3">
              <span className="icon-text">
                <span className="icon">
                  <Icon name="fas fa-code-branch" />
                </span>
                <span>Changes to Apply</span>
              </span>
            </h3>

            {/* Trip metadata changes */}
            {Object.keys(diff.updatedTrip).length > 0 && (
              <div className="mb-3">
                <h4 className="subtitle is-6 has-text-weight-normal has-text-grey-dark">Trip Updates:</h4>
                <ul className="list">
                  {diff.updatedTrip.title && (
                    <li className="has-text-success">
                      <span className="icon-text">
                        <span className="icon">
                          <Icon name="fas fa-edit" />
                        </span>
                        <span>Title: {diff.updatedTrip.title}</span>
                      </span>
                    </li>
                  )}
                  {diff.updatedTrip.currency && (
                    <li className="has-text-success">
                      <span className="icon-text">
                        <span className="icon">
                          <Icon name="fas fa-edit" />
                        </span>
                        <span>Currency: {diff.updatedTrip.currency}</span>
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* New team members */}
            {diff.newTeamMembers.length > 0 && (
              <div className="mb-3">
                <h4 className="subtitle is-6 has-text-weight-normal has-text-grey-dark">New Team Members:</h4>
                <div className="tags">
                  {diff.newTeamMembers.map(name => (
                    <span key={name} className="tag is-success is-light">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* New payments */}
            {diff.newPayments.length > 0 && (
              <div className="mb-3">
                <h4 className="subtitle is-6 has-text-weight-normal has-text-grey-dark">New Payments:</h4>
                <ul className="list">
                  {diff.newPayments.map(payment => (
                    <li key={payment.id} className="has-text-success">
                      <span className="icon-text">
                        <span className="icon">
                          <Icon name="fas fa-plus" />
                        </span>
                        <span>{payment.title}</span>
                      </span>
                      <div className="tags mt-1">
                        {Array.from(payment.shares.entries())
                          .filter(([, amount]) => amount > 0)
                          .map(([person, amount]) => (
                            <span key={person} className="tag is-info is-light is-small">
                              {person}: {formatCurrency(amount, sharedTrip.currency)}
                            </span>
                          ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Updated payments */}
            {diff.updatedPayments.length > 0 && (
              <div className="mb-3">
                <h4 className="subtitle is-6 has-text-weight-normal has-text-grey-dark">Updated Payments:</h4>
                <ul className="list">
                  {diff.updatedPayments.map(payment => (
                    <li key={payment.id} className="has-text-warning">
                      <span className="icon-text">
                        <span className="icon">
                          <Icon name="fas fa-edit" />
                        </span>
                        <span>{payment.title}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* No changes message */}
        {diff && !hasChanges() && (
          <div className="notification is-info is-light">
            <span className="icon-text">
              <span className="icon">
                <Icon name="fas fa-info-circle" />
              </span>
              <span>No changes to apply. The shared trip is identical to your current version.</span>
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="columns is-mobile">
          <div className="column">
            <button
              className="button is-light is-fullwidth"
              onClick={handleRejectChanges}
            >
              {hasChanges() ? 'Cancel' : 'Go Back'}
            </button>
          </div>
          {hasChanges() && (
            <div className="column">
              <button
                className="button is-success is-fullwidth"
                onClick={() => setShowConfirmDialog(true)}
              >
                <span className="icon-text">
                  <span className="icon">
                    <Icon name="fas fa-check" />
                  </span>
                  <span>Apply Changes</span>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showConfirmDialog && (
        <ConfirmDialog
          title="Confirm Import"
          message={`Are you sure you want to apply the changes from the shared trip "${sharedTrip.title}"? This will merge the new data with your existing trip.`}
          onConfirm={handleApplyChanges}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
};

export default ShareScreen; 