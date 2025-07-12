import React, { useState } from 'react';
import { Person } from '../domain/Expenses';
import Icon from './Icon';

interface TeamSectionProps {
  team: Person[];
  // eslint-disable-next-line no-unused-vars
  onAddTeamMember: (member: Person) => void;
  // eslint-disable-next-line no-unused-vars
  onRemoveTeamMember: (memberName: string) => void;
  onFocus?: () => void;
  onSwitchToSplit?: () => void;
  showSplitButton?: boolean;
}

const TeamSection: React.FC<TeamSectionProps> = ({
  team,
  onAddTeamMember,
  onRemoveTeamMember,
  onFocus,
  onSwitchToSplit,
  showSplitButton
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
      <h2 className="subtitle is-6-mobile has-text-weight-normal has-text-grey-dark mb-2">
        <div className="columns is-mobile is-vcentered">
          <div className="column">Team</div>
          {onSwitchToSplit && showSplitButton && (
            <div className="column is-narrow">
              <button
                className="button is-info is-light is-small-mobile"
                onClick={onSwitchToSplit}
              >
                <span className="icon">
                  <Icon name="fa-solid fa-calculator" />
                </span>
              </button>
            </div>
          )}
        </div>
      </h2>
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
          <div className="field has-addons is-align-items-center" style={{ display: 'inline-flex', maxWidth: '250px', width: '100%' }}>
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
              <button 
                className="button is-info is-small-mobile" 
                onClick={handleAddTeamMember}
              >
                <span className="icon">
                  <Icon name="fas fa-plus" />
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