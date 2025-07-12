// PWA utilities for installation prompts and service worker management

// Type definition for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let updateAvailable = false;
let updateCallback: (() => void) | null = null;

export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Set up update detection
      setupUpdateDetection(registration);
      
      // Check for updates immediately
      checkForUpdates(registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Set up update detection for the service worker
const setupUpdateDetection = (registration: ServiceWorkerRegistration): void => {
  // Listen for service worker updates
  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;
    
    if (newWorker) {
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          updateAvailable = true;
          showUpdateNotification();
        }
      });
    }
  });

  // Listen for controller change (when new service worker takes over)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    updateAvailable = false;
    if (updateCallback) {
      updateCallback();
      updateCallback = null;
    }
  });
};

// Check for app updates
export const checkForUpdates = (registration?: ServiceWorkerRegistration): void => {
  if (!registration && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((reg) => {
      checkForUpdates(reg);
    });
    return;
  }

  if (registration) {
    // Check for updates every 30 minutes
    setInterval(() => {
      registration.update();
    }, 30 * 60 * 1000); // 30 minutes
  }
};

// Show update notification with better UX
export const showUpdateNotification = (): void => {
  // Remove any existing notification
  const existingNotification = document.querySelector('.update-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create a notification banner
  const notification = document.createElement('div');
  notification.className = 'notification is-info is-light update-notification';
  notification.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 3000;
    margin: 0;
    border-radius: 0;
    border-bottom: 1px solid #3298dc;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  `;
  
  notification.innerHTML = `
    <div class="columns is-mobile is-vcentered">
      <div class="column">
        <p class="is-size-7-mobile">
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-sync-alt"></i>
            </span>
            <span><strong>New version available!</strong> Refresh to get the latest features.</span>
          </span>
        </p>
      </div>
      <div class="column is-narrow">
        <div class="buttons">
          <button class="button is-info is-small" onclick="window.location.reload()">
            <span class="icon">
              <i class="fas fa-sync-alt"></i>
            </span>
            <span>Update Now</span>
          </button>
          <button class="button is-small" onclick="this.closest('.update-notification').remove()">
            <span class="icon">
              <i class="fas fa-times"></i>
            </span>
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 30 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 30000);
};

// Force update by reloading the page
export const forceUpdate = (): void => {
  if (updateAvailable) {
    // Send message to service worker to skip waiting
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
    
    // Set callback to reload when new service worker takes over
    updateCallback = () => {
      window.location.reload();
    };
  } else {
    // If no update is available, just reload
    window.location.reload();
  }
};

// Check if update is available
export const isUpdateAvailable = (): boolean => {
  return updateAvailable;
};

// Setup install prompt for Android Chrome
export const setupInstallPrompt = (): void => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e as BeforeInstallPromptEvent;
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
  });
};

// Trigger the install prompt manually
export const showInstallPrompt = async (): Promise<boolean> => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return outcome === 'accepted';
  }
  return false;
};

// Check if app is installed/running in standalone mode
export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
};

// Check if install prompt is available
export const isInstallPromptAvailable = (): boolean => {
  return deferredPrompt !== null;
}; 