// PWA utilities for installation prompts and service worker management

// Type definition for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
      
      // Check for updates
      checkForUpdates();
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Check for app updates
export const checkForUpdates = (): void => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      // Check for updates every hour
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // 1 hour

      // Listen for service worker updates
      registration.addEventListener('updatefound', () => {
        showUpdateNotification();
      });
    });
  }
};

// Show update notification
export const showUpdateNotification = (): void => {
  // Create a notification banner
  const notification = document.createElement('div');
  notification.className = 'notification is-warning is-light update-notification';
  notification.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 3000;
    margin: 0;
    border-radius: 0;
    border-bottom: 1px solid #ffdd57;
  `;
  
  notification.innerHTML = `
    <div class="columns is-mobile is-vcentered">
      <div class="column">
        <p class="is-size-7-mobile">
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-sync-alt"></i>
            </span>
            <span>New version available</span>
          </span>
        </p>
      </div>
      <div class="column is-narrow">
        <button class="button is-warning is-small" onclick="window.location.reload()">
          Refresh
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 10000);
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