import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { RootState } from '../app/store';
import { removeTrip } from '../features/expenses/expensesSlice';
import { isInstallPromptAvailable, showInstallPrompt, isPWAInstalled } from '../utils/pwa';

import ConfirmDialog from '../components/ConfirmDialog';
import Icon from '../components/Icon';
import appIcon from '../assets/appicon.png';

const HomeScreen: React.FC = () => {
  const trips = useSelector((state: RootState) => state.tripExpenses);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; tripId: number | null }>({
    show: false,
    tripId: null,
  });
  const [showInstallButton, setShowInstallButton] = useState(false);

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

  return (
    <div className="home-screen-container">
      <div className="home-screen-content">
        <div className="container">
          {trips.length > 0 && (
            <div className="columns is-mobile is-vcentered mb-3">
              <div className="column">
                <h1 className="title is-4-mobile has-text-weight-normal has-text-grey-dark">Trips</h1>
              </div>
              <div className="column is-narrow">
                <button className="button is-primary is-small-mobile" onClick={() => navigate(`/trip/`)}>
                  <span className="icon">
                    <Icon name="fas fa-plus" />
                  </span>
                </button>
              </div>
            </div>
          )}

          {trips.length === 0 ? (
            <div className="home-screen-empty-state">
              <div className="has-text-centered">
                <div className="mb-6 mt-6">
                  <img 
                    src={appIcon} 
                    alt="TravelSplit Logo" 
                    style={{ 
                      width: '120px', 
                      height: '120px'
                    }}
                  />
                </div>
                <h2 className="title is-4 has-text-weight-normal has-text-grey-dark mb-5">
                  Welcome to TravelSplit
                </h2>
                <p className="subtitle is-6 has-text-weight-normal has-text-grey mb-6" style={{ marginBottom: '2.5rem' }}>
                  Split travel expenses with friends and family easily
                </p>
                <div className="mb-4">
                  <button 
                    className="button is-primary is-rounded"
                    onClick={() => navigate(`/trip/`)}
                    style={{
                      width: '70%',
                      minWidth: '240px',
                      maxWidth: '280px',
                      margin: '0 auto',
                      padding: '0.7rem 1.2rem',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 12px rgba(74, 158, 255, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span className="icon is-medium mr-2">
                      <Icon name="fas fa-plus" size={16} />
                    </span>
                    Create Your First Trip
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <ul className="list">
              {trips.map((trip) => (
                <li key={trip.id} className="box mb-2">
                  <div className="columns is-mobile is-vcentered">
                    <div 
                      className="column" 
                      onClick={() => navigate(`/trip/${trip.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h2 className="title is-5-mobile is-4 has-text-weight-normal has-text-grey-dark has-text-left mb-1">{trip.title}</h2>
                      <div className="tags has-addons" style={{ flexWrap: 'wrap', gap: '0.25rem' }}>
                        {trip.team.map(member => (
                          <span key={member.name} className="tag is-info is-light is-small-mobile">
                            {member.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="column is-narrow">
                      <button
                        className="button is-danger is-light is-small-mobile"
                        onClick={() => handleRemoveTrip(trip.id)}
                      >
                          <span className="icon">
                            <Icon name="fas fa-trash" />
                          </span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showInstallButton && (
        <div className="home-screen-install-banner">
          <div className="container">
            <div className="notification is-info is-light">
              <div className="columns is-mobile is-vcentered">
                <div className="column">
                  <p className="is-size-7-mobile">
                    <Icon name="download" /> Install TravelSplit for a better experience
                  </p>
                </div>
                <div className="column is-narrow">
                  <button 
                    className="button is-info is-small"
                    onClick={handleInstallClick}
                  >
                    Install App
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDialog.show && (
        <ConfirmDialog
          title="Confirm Removal"
          message="Are you sure you want to remove this trip?"
            onConfirm={confirmRemoval}
            onCancel={cancelRemoval}
          />
        )}
    </div>
  );
};

export default HomeScreen;
