import React, { useState } from 'react';
import { Person } from '../domain/Expenses';

interface TeamSectionProps {
  team: Person[];
  onAddTeamMember: (member: Person) => void;
  onRemoveTeamMember: (memberName: string) => void;
  onFocus?: () => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({
  team,
  onAddTeamMember,
  onRemoveTeamMember,
  onFocus
}) => {
  const [teamMember, setTeamMember] = useState('');

  const handleAddTeamMember = () => {
    if (!teamMember.trim()) return;
    
    onAddTeamMember({ name: teamMember.trim() });
    setTeamMember('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTeamMember();
    }
  };

  return (
    <>
      <h2 className="subtitle is-6-mobile has-text-weight-normal has-text-grey-dark">Team</h2>
      <div className="box">
        <div className="tags">
          {team.map((member) => (
            <span key={member.name} className="tag is-info is-light is-small-mobile is-medium">
              {member.name}
              <button
                className="delete is-small ml-2"
                onClick={() => onRemoveTeamMember(member.name)}
              ></button>
            </span>
          ))}
          <div className="field has-addons" style={{ display: 'inline-flex', maxWidth: '250px', width: '100%' }}>
            <div className="control is-expanded">
              <input
                className="input is-small-mobile"
                type="text"
                placeholder="Add team member"
                value={teamMember}
                onChange={(e) => setTeamMember(e.target.value)}
                onFocus={onFocus}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="control">
              <button className="button is-info is-small-mobile" onClick={handleAddTeamMember}>
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamSection; 