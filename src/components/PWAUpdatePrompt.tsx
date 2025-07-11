import React, { useState, useEffect } from 'react';

const PWAUpdatePrompt: React.FC = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    // Handle online/offline status
    const handleOnline = () => setShowOfflineBanner(false);
    const handleOffline = () => {
      setShowOfflineBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
        
        // Listen for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setNeedRefresh(true);
              }
            });
          }
        });
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const close = () => {
    setNeedRefresh(false);
  };

  const update = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const closeOfflineBanner = () => {
    setShowOfflineBanner(false);
  };

  if (!needRefresh && !showOfflineBanner) {
    return null;
  }

  return (
    <>
      {/* Update Available Banner */}
      {needRefresh && (
        <div className="notification is-info is-light" style={{ 
          position: 'fixed', 
          bottom: '1rem', 
          right: '1rem', 
          zIndex: 1000,
          maxWidth: '400px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <button className="delete" onClick={close}></button>
          <div className="content">
            <p style={{ marginBottom: '1rem' }}>
              <strong>🔄 Update Available!</strong><br />
              A new version of TravelSplit is ready with improvements and bug fixes.
            </p>
            <div className="buttons">
              <button 
                className="button is-info is-small" 
                onClick={update}
                style={{ marginRight: '0.5rem' }}
              >
                Update Now
              </button>
              <button className="button is-small" onClick={close}>
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Banner */}
      {showOfflineBanner && (
        <div className="notification is-warning is-light" style={{ 
          position: 'fixed', 
          top: '1rem', 
          left: '1rem', 
          right: '1rem', 
          zIndex: 1000,
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <button className="delete" onClick={closeOfflineBanner}></button>
          <div className="content">
            <p style={{ margin: 0 }}>
              <strong>📶 You're offline</strong> - TravelSplit works offline with all your data stored locally.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAUpdatePrompt; 