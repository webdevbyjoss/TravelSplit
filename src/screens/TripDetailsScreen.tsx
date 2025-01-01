import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { useParams, useNavigate } from 'react-router';
import PaymentDetailsScreen from './PaymentDetailsScreen';
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

  const [teamMember, setTeamMember] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<{ title: string; shares: Map<string, number> } | null>(null);

  const isNewTrip = !tripId;

  // Create a new trip if it doesn't exist
  useEffect(() => {
    if (isNewTrip) {
      const newTripId = Date.now();
      dispatch(addTrip({ id: newTripId, title: 'New Trip', team: [], payments: [] }));
      navigate(`/trip/${newTripId}`);
    }
  }, [isNewTrip, dispatch, navigate]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (trip) {
      dispatch(updateTrip({ ...trip, title: newTitle }));
    }
  };

  const handleAddTeamMember = () => {
    if (!teamMember || !trip) return;

    dispatch(addTeamMember({ tripId: trip.id, member: { name: teamMember } }));
    setTeamMember('');
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

  return (
    <div className="container">
      <div className="columns">
        <div className="column is-2">
          <button className="button" onClick={() => navigate(`/`)}>All Trips</button>
        </div>
        <div className="column">
          <h1 className="title has-text-left">
            <input
              className="input is-inline"
              type="text"
              placeholder="Trip title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </h1>
        </div>
      </div>

      <h2 className="subtitle">Team</h2>

      <ul className="box">
        {trip?.team.map((member) => (
          <li key={member.name} className="list-item">
            <span className="tag is-info is-light mr-2">{member.name}</span>
            <button
              className="button is-small is-danger is-light ml-2"
              onClick={() => handleRemoveTeamMember(member.name)}
            >
              Remove
            </button>
          </li>
        ))}
        <li>
          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                className="input"
                type="text"
                placeholder="Add team member"
                value={teamMember}
                onChange={(e) => setTeamMember(e.target.value)}
              />
            </div>
            <div className="control">
              <button className="button is-info" onClick={handleAddTeamMember}>
                Add
              </button>
            </div>
          </div>
        </li>
      </ul>

      {trip && trip.team.length > 1 && (
      <h2 className="subtitle">
        <div className="columns">
          <div className="column is-four-fifths">Payments</div>
          <div className="column has-text-right">
            <button
              className="button is-primary mb-4"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              New Payment
            </button>
          </div>
        </div>
      </h2>)}

      {trip && (trip.payments.length > 0) && (
        <ul className="box">
          {trip.payments.map((payment) => (
            <li key={payment.id} className="list-item">
              <div className="content">
                <strong>{payment.title}</strong>
                <ul>
                  {Array.from(payment.shares).map(([user, amount]) => (
                    <li key={user}>
                      {user}: {amount.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className="button is-warning is-light"
                onClick={() => handleEditPayment(payment)}
              >
                Edit
              </button>
              <button
                className="button is-danger is-light ml-2"
                onClick={() => handleRemovePayment(payment.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {isPaymentModalOpen && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setIsPaymentModalOpen(false)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
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

    </div>
  );
};

export default TripDetailsScreen;
