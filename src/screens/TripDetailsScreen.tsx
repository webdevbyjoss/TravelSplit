import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { useParams, useNavigate } from 'react-router';
import { addTrip, addTeamMember } from '../features/expenses/expensesSlice';


const TripDetailsScreen: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const trip = useSelector((state: RootState) => state.tripExpenses.find(t => t.id === Number(tripId)));

  const [title, setTitle] = useState(trip?.title || '');
  const [teamMember, setTeamMember] = useState('');
  const [team, setTeam] = useState(trip?.team || []);

  const isNewTrip = !tripId;

  const handleSaveTrip = () => {
    if (isNewTrip) {
      const newTripId = Date.now(); // Unique ID for the new trip
      dispatch(addTrip({ id: newTripId, title }));
      navigate(`/trip/${newTripId}`);
    } else if (trip) {
      // Update logic could go here
    }
  };

  const handleAddTeamMember = () => {
    if (!teamMember) return;

    if (isNewTrip) {
      setTeam([...team, { name: teamMember }]);
    } else if (trip) {
      dispatch(addTeamMember({ tripId: Number(tripId), member: { name: teamMember } }));
    }

    setTeamMember('');
  };

  return (
    <div className="container">
      <div className="columns">
        <div className="column is-2">
          <button className="button" onClick={() => navigate(`/`)}>All Trips</button>
        </div>
        <div className="column">
          <h1 className="title has-text-left">{isNewTrip ? 'Create New Trip' : `Edit Trip`}</h1>
        </div>
      </div>

      <div className="field">
        <label className="label">Title</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Trip title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>

      <h2 className="subtitle">Team</h2>

      <ul className="box">
        {team.map((member) => (
          <li key={member.name} className="list-item">
            <span className="tag is-info is-light mr-2">{member.name}</span>
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

      <div className="field is-grouped">
        <div className="control">
          <button className="button is-primary" onClick={handleSaveTrip}>
            Save Trip
          </button>
        </div>
        <div className="control">
          <button className="button is-light" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </div>

    </div>
  );
};

export default TripDetailsScreen;
