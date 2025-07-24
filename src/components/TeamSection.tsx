import { useState } from 'react';
import { Person } from '../domain/Expenses';
import Icon from './Icon';

interface TeamSectionProps {
  team: Person[];
  // eslint-disable-next-line no-unused-vars
  onAddTeamMember: (member: Person) => void;
  // eslint-disable-next-line no-unused-vars
  onRemoveTeamMember: (memberName: string) => void;
  onFocus?: () => void;
}

const TeamSection = ({
  team,
  onAddTeamMember,
  onRemoveTeamMember,
  onFocus
}: TeamSectionProps) => {
  const [teamMember, setTeamMember] = useState('');

  const handleAddTeamMember = () => {
    if (!teamMember.trim()) return;
    
    onAddTeamMember({ name: teamMember.trim() });
    setTeamMember('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTeamMember();
    }
  };

  return (
    <div className="box mb-6">
      <div className="field">
        <div className="tags">
          {team.map((member) => (
            <span key={member.name} className="tag is-medium">
              {member.name}
              <button
                className="delete is-small ml-2"
                onClick={() => onRemoveTeamMember(member.name)}
              ></button>
            </span>
          ))}
          <div className="control" style={{ display: 'inline-block', marginLeft: '0.5rem' }}>
            <div className="field has-addons">
              <p className="control">
                <input
                  className="input is-small"
                  type="text"
                  placeholder="Add team member..."
                  value={teamMember}
                  onChange={(e) => setTeamMember(e.target.value)}
                  onFocus={onFocus}
                  onKeyDown={handleKeyDown}
                  style={{ width: '150px' }}
                />
              </p>
              <p className="control">
                <button
                  className="button is-primary is-small"
                  onClick={handleAddTeamMember}
                  disabled={!teamMember.trim()}
                  title="Add team member"
                  type="button"
                >
                  <span className="icon">
                    <Icon name="fas fa-plus" />
                  </span>
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSection; 