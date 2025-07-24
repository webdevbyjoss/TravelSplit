import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { RootState } from '../app/store';
import { removeTrip } from '../features/expenses/expensesSlice';
import { isInstallPromptAvailable, showInstallPrompt, isPWAInstalled, isIos, isIosSafari } from '../utils/pwa';
import { generateShareUrl } from '../utils/serialization';
import { copyToClipboard } from '../utils/clipboard';
import { TripExpenses } from '../domain/Expenses';

import ConfirmDialog from '../components/ConfirmDialog';
import Icon from '../components/Icon';
import appIcon from '../assets/appicon.png';

const HomeScreen = () => {
  const trips = useSelector((state: RootState) => state.tripExpenses);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; tripId: number | null }>({
    show: false,
    tripId: null,
  });
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [copiedTripId, setCopiedTripId] = useState<number | null>(null);

  useEffect(() => {
    // Check if install prompt is available and app is not already installed
    const checkInstallAvailability = () => {
      const canInstall = isInstallPromptAvailable() && !isPWAInstalled();
      setShowInstallButton(canInstall);
    };

    // Check immediately
    checkInstallAvailability();

    // Check periodically (in case the prompt becomes available later)
    const interval = setInterval(checkInstallAvailability, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleInstallClick = async () => {
    const installed = await showInstallPrompt();
    if (installed) {
      setShowInstallButton(false);
    }
  };

  const handleRemoveTrip = (id: number) => {
    setConfirmDialog({ show: true, tripId: id });
  };

  const confirmRemoval = () => {
    if (confirmDialog.tripId !== null) {
      dispatch(removeTrip({ id: confirmDialog.tripId }));
    }
    setConfirmDialog({ show: false, tripId: null });
  };

  const cancelRemoval = () => {
    setConfirmDialog({ show: false, tripId: null });
  };

  const handleShareTrip = async (trip: TripExpenses) => {
    try {
      const shareUrl = generateShareUrl(trip);
      const success = await copyToClipboard(shareUrl);
      
      if (success) {
        setCopiedTripId(trip.id);
        setTimeout(() => setCopiedTripId(null), 2000);
        
        // Show iOS-specific guidance if needed
        if (isIos() && isIosSafari() && !isPWAInstalled()) {
          setTimeout(() => {
            alert(`Trip shared! 📱\n\nFor the best experience on iPhone:\n1. Install the app by tapping Share → Add to Home Screen\n2. Then share this link with friends\n\nThis will allow shared links to open directly in the app instead of Safari.`);
          }, 100);
        }
      } else {
        alert(`Share URL copied to clipboard:\n${shareUrl}`);
      }
    } catch (error) {
      console.error('Failed to copy share URL:', error);
      const shareUrl = generateShareUrl(trip);
      alert(`Share URL:\n${shareUrl}`);
    }
  };

  return (
    <div className="container">
      <div className="section">
        <div className="columns is-mobile is-vcentered mb-4">
          <div className="column">
            <h1 className="title is-4-mobile is-3 has-text-weight-normal has-text-grey-dark">TravelSplit</h1>
            <p className="subtitle is-6-mobile is-5 has-text-weight-light has-text-grey">Split travel expenses with friends and family</p>
          </div>
        </div>

        {trips.length > 0 && (
          <div className="columns is-mobile is-vcentered mb-4">
            <div className="column">
              <h2 className="title is-5-mobile is-4 has-text-weight-normal has-text-grey-dark">Your Trips</h2>
            </div>
            <div className="column is-narrow">
              <button
                className="button is-primary is-small-mobile"
                onClick={() => navigate('/trip/')}
              >
                <span className="icon">
                  <Icon name="fas fa-plus" />
                </span>
                <span>New Trip</span>
              </button>
            </div>
          </div>
        )}

        {trips.length === 0 ? (
          <div className="box has-text-centered p-6">
            <div className="mb-4">
              <img src={appIcon} alt="TravelSplit" style={{ width: 144, height: 144 }} />
            </div>
            <div className="mb-4">
              <span className="icon is-large has-text-grey-light">
                <Icon name="fas fa-plane" />
              </span>
            </div>
            <h3 className="title is-5 has-text-weight-normal has-text-grey-dark mb-3">No trips yet</h3>
            <p className="has-text-grey mb-4">Create your first trip to start splitting expenses</p>
            <button
              className="button is-primary"
              onClick={() => navigate('/trip/')}
            >
              <span className="icon">
                <Icon name="fas fa-plus" />
              </span>
              <span>Create Your First Trip</span>
            </button>
          </div>
        ) : (
          <ul className="list">
            {trips.map((trip) => (
              <li key={trip.id} className="box mb-4 p-5">
                <div className="columns is-mobile is-vcentered">
                  <div 
                    className="column is-clickable p-3" 
                    onClick={() => navigate(`/trip/${trip.id}`)}
                  >
                    <h2 className="title is-5-mobile is-4 has-text-weight-normal has-text-grey-dark has-text-left mb-3">{trip.title}</h2>
                    <div className="tags has-addons is-flex-wrap">
                      {trip.team.map(member => (
                        <span key={member.name} className="tag is-info is-light is-small-mobile mb-1">
                          {member.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="column is-narrow pl-2">
                    <div className="buttons are-small is-vertical">
                      <button
                        className="button is-info is-light is-small-mobile"
                        onClick={() => handleShareTrip(trip)}
                        title="Share trip"
                      >
                        <span className="icon">
                          <Icon name={copiedTripId === trip.id ? "fas fa-check" : "fas fa-share-alt"} />
                        </span>
                      </button>
                      <button
                        className="button is-danger is-light is-small-mobile"
                        onClick={() => handleRemoveTrip(trip.id)}
                        title="Remove trip"
                      >
                        <span className="icon">
                          <Icon name="fas fa-trash" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showInstallButton && (
          <div className="notification is-info is-light mb-4">
            <div className="columns is-mobile is-vcentered">
              <div className="column">
                <p className="is-size-7-mobile">
                  <span className="icon-text">
                    <span className="icon">
                      <Icon name="fas fa-download" />
                    </span>
                    <span><strong>Install TravelSplit</strong> for a better experience and offline access</span>
                  </span>
                </p>
              </div>
              <div className="column is-narrow">
                <button className="button is-info is-small" onClick={handleInstallClick}>
                  <span className="icon">
                    <Icon name="fas fa-download" />
                  </span>
                  <span>Install</span>
                </button>
              </div>
            </div>
          </div>
        )}

      {confirmDialog.show && (
        <ConfirmDialog
          title="Remove Trip"
          message="Are you sure you want to remove this trip? This action cannot be undone."
          onConfirm={confirmRemoval}
          onCancel={cancelRemoval}
        />
      )}
    </div>
  );
};

export default HomeScreen;
