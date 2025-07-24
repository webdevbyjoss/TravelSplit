import React from 'react';
import Icon from './Icon';

interface TabPanelProps {
  activeTab: 'team' | 'split' | 'settings';
  // eslint-disable-next-line no-unused-vars
  onTabChange: (_tab: 'team' | 'split' | 'settings') => void;
  children: React.ReactNode;
  showSplitTab?: boolean;
  showTeamTab?: boolean;
  showSettingsTab?: boolean;
}

const TabPanel: React.FC<TabPanelProps> = ({ 
  activeTab, 
  onTabChange, 
  children, 
  showSplitTab = true,
  showTeamTab = true,
  showSettingsTab = true
}) => {
  return (
    <div>
      <div className="tabs is-boxed is-small-mobile">
        <ul>
          {showSplitTab && (
            <li className={activeTab === 'split' ? 'is-active' : ''}>
              <a onClick={() => onTabChange('split')}>
                <span className="icon">
                  <Icon name="fa-solid fa-calculator" size={20} />
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Split</span>
              </a>
            </li>
          )}
          {showTeamTab && (
            <li className={activeTab === 'team' ? 'is-active' : ''}>
              <a onClick={() => onTabChange('team')}>
                <span className="icon">
                  <Icon name="fa-solid fa-users" size={20} />
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Team</span>
              </a>
            </li>
          )}
          {showSettingsTab && (
            <li className={activeTab === 'settings' ? 'is-active' : ''}>
              <a onClick={() => onTabChange('settings')}>
                <span className="icon">
                  <Icon name="fa-solid fa-gear" size={20} />
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Settings</span>
              </a>
            </li>
          )}
        </ul>
      </div>
      <div className="tab-content">
        {children}
      </div>
    </div>
  );
};

export default TabPanel; 