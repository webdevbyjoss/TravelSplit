import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { RootState } from '../app/store';
import { removeTrip } from '../features/expenses/expensesSlice';

import ConfirmDialog from '../components/ConfirmDialog';
import Icon from '../components/Icon';

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

      {trips.length === 0 && (
        <div className="notification">
          <p className="subtitle has-text-weight-normal has-text-grey">No trips found</p>
        </div>
      )}

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
