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
          <div className="column is-four-fifths is-size-4">Trips</div>
          <div className="column has-text-right">
            <button className="button is-primary mb-4" onClick={() => navigate(`/trip/`)}>
              <span className="icon">
                <i className="fas fa-plus"></i>
              </span>
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
                <div 
                  className="column is-four-fifths is-clickable" 
                  onClick={() => navigate(`/trip/${trip.id}`)}
                >
                  <h1 className="is-4 has-text-black has-text-left mb-2">{trip.title}</h1>
                  <div className="mt-2">
                    {trip.team.map(member => (
                      <span key={member.name} className="tag is-info is-light mr-1">
                        {member.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="column has-text-right">
                  <button
                    className="button is-danger is-light"
                    onClick={() => handleRemoveTrip(trip.id)}
                  >
                    <span className="icon">
                      <i className="fas fa-trash"></i>
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
