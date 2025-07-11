// PWA utility functions

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered successfully:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

export const checkForAppUpdate = (registration: ServiceWorkerRegistration): Promise<boolean> => {
  return new Promise((resolve) => {
    if (registration.waiting) {
      resolve(true);
      return;
    }

    const handleUpdateFound = () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            resolve(true);
          }
        });
      }
    };

    registration.addEventListener('updatefound', handleUpdateFound);
    
    // If no update is found, resolve with false after a timeout
    setTimeout(() => resolve(false), 5000);
  });
};

export const promptForUpdate = (registration: ServiceWorkerRegistration): void => {
  if (registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
};

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as NavigatorStandalone).standalone === true;
};

export const isOnline = (): boolean => {
  return navigator.onLine;
};

export const addOnlineOfflineListeners = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  const handleOnline = () => onOnline();
  const handleOffline = () => onOffline();

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

export const getPWAInstallPrompt = (): Promise<Event | null> => {
  return new Promise((resolve) => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      resolve(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // If no prompt is available, resolve with null after a timeout
    setTimeout(() => resolve(null), 1000);
  });
};

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const showInstallPrompt = async (promptEvent: Event): Promise<'accepted' | 'dismissed'> => {
  const beforeInstallPromptEvent = promptEvent as BeforeInstallPromptEvent;
  
  beforeInstallPromptEvent.prompt();
  const { outcome } = await beforeInstallPromptEvent.userChoice;
  
  return outcome;
}; 