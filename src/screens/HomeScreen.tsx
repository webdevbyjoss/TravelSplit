import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { RootState } from '../app/store';
import { removeTrip } from '../features/expenses/expensesSlice';

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
    <div className="container">
      {trips.length > 0 && (
        <div className="columns is-mobile is-vcentered mb-5">
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
        <div className="has-text-centered" style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          paddingTop: '10vh',
          paddingBottom: '10vh'
        }}>
          <div className="mb-6">
            <img 
              src={appIcon} 
              alt="TravelSplit Logo" 
              style={{ 
                width: '200px', 
                height: '200px'
              }}
            />
          </div>
          <h2 className="title is-4 has-text-weight-normal has-text-grey-dark mb-4">
            Welcome to TravelSplit
          </h2>
          <p className="subtitle is-6 has-text-weight-normal has-text-grey mb-6">
            Split travel expenses with friends and family easily
          </p>
          <button 
            className="button is-primary is-rounded"
            onClick={() => navigate(`/trip/`)}
            style={{
              width: '50%',
              maxWidth: '400px',
              margin: '0 auto',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(50, 115, 220, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <span className="icon is-medium mr-2">
              <Icon name="fas fa-plus" size={20} />
            </span>
            Create Your First Trip
          </button>
        </div>
      ) : (
        <ul className="list">
          {trips.map((trip) => (
            <li key={trip.id} className="box mb-3">
              <div className="columns is-mobile is-vcentered">
                <div 
                  className="column" 
                  onClick={() => navigate(`/trip/${trip.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <h2 className="title is-5-mobile is-4 has-text-weight-normal has-text-grey-dark has-text-left mb-2">{trip.title}</h2>
                  <div className="tags has-addons mt-2" style={{ flexWrap: 'wrap', gap: '0.25rem' }}>
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
