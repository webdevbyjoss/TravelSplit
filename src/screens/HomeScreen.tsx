import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { RootState } from '../app/store';
import { removeTrip } from '../features/expenses/expensesSlice';

import ConfirmDialog from '../components/ConfirmDialog';

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
      <h1 className="title">
        <div className="columns">
          <div className="column is-four-fifths">Trips</div>
          <div className="column has-text-right">
            <button className="button is-primary mb-4" onClick={() => navigate(`/trip/`)}>
              New trip
            </button>
          </div>
        </div>
      </h1>

      {trips.length === 0 && (
        <div className="notification">
          <p className="subtitle">No trips found</p>
          </div>
        )}

        <ul className="list">
          {trips.map((trip) => (
            <li key={trip.id} className="box mb-3">
              <div className="columns">
                <div className="column is-four-fifths">
                  <button
                    className="button is-link is-outlined is-fullwidth"
                    onClick={() => navigate(`/trip/${trip.id}`)}
                  >{trip.title}</button>
                </div>
                <div className="column has-text-right">
                  <button
                    className="button is-danger is-light"
                    onClick={() => handleRemoveTrip(trip.id)}
                  >Remove
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
