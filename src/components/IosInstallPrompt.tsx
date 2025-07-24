import React, { useEffect, useState } from 'react';

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isInStandaloneMode() {
  // @ts-expect-error: window.navigator.standalone is only available on iOS Safari
  return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
}

function isSafari() {
  const ua = window.navigator.userAgent;
  return isIos() && /safari/i.test(ua) && !/crios|fxios|opios|edgios/i.test(ua);
}

const IosInstallPrompt: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isIos() && isSafari() && !isInStandaloneMode()) {
      // Only show if not already dismissed in this session
      if (!sessionStorage.getItem('iosInstallPromptDismissed')) {
        setShow(true);
      }
    }
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#3273dc',
      color: 'white',
      padding: '1em',
      zIndex: 1000,
      textAlign: 'center',
      fontSize: '1em',
      boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
    }}>
      <span role="img" aria-label="info" style={{ marginRight: 8 }}>📱</span>
      Install this app: Tap <span style={{fontWeight:'bold'}}>Share</span> <span role="img" aria-label="share">⬆️</span> then <span style={{fontWeight:'bold'}}>Add to Home Screen</span>
      <br />
      <small style={{ opacity: 0.8, marginTop: '0.5em', display: 'block' }}>
        This will allow shared trip links to open directly in the app
      </small>
      <button
        onClick={() => {
          setShow(false);
          sessionStorage.setItem('iosInstallPromptDismissed', '1');
        }}
        style={{
          marginLeft: 16,
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          borderRadius: 4,
          padding: '0.25em 0.75em',
          cursor: 'pointer',
          fontSize: '1em'
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
};

export default IosInstallPrompt; 