import React, { useEffect, useState } from 'react';
import { isUpdateAvailable, forceUpdate } from '../utils/pwa';

interface UpdateNotificationProps {
  className?: string;
  style?: React.CSSProperties;
}

const UpdateNotification: React.FC<UpdateNotificationProps> = ({ className = '', style }) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Check for updates every 5 seconds
    const checkInterval = setInterval(() => {
      const hasUpdate = isUpdateAvailable();
      setUpdateAvailable(hasUpdate);
    }, 5000);

    // Initial check
    setUpdateAvailable(isUpdateAvailable());

    return () => clearInterval(checkInterval);
  }, []);

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await forceUpdate();
    } catch (error) {
      console.error('Failed to force update:', error);
      // Fallback to simple reload
      window.location.reload();
    } finally {
      setIsUpdating(false);
    }
  };

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className={`notification is-info is-light update-notification ${className}`} style={style}>
      <div className="columns is-mobile is-vcentered">
        <div className="column">
          <p className="is-size-7-mobile">
            <span className="icon-text">
              <span className="icon">
                <i className="fas fa-sync-alt"></i>
              </span>
              <span><strong>New version available!</strong> Refresh to get the latest features.</span>
            </span>
          </p>
        </div>
        <div className="column is-narrow">
          <div className="buttons">
            <button 
              className={`button is-info is-small ${isUpdating ? 'is-loading' : ''}`}
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              <span className="icon">
                <i className="fas fa-sync-alt"></i>
              </span>
              <span>{isUpdating ? 'Updating...' : 'Update Now'}</span>
            </button>
            <button 
              className="button is-small" 
              onClick={() => setUpdateAvailable(false)}
              disabled={isUpdating}
            >
              <span className="icon">
                <i className="fas fa-times"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification; 