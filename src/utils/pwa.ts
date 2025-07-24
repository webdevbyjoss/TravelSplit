// PWA utilities for installation prompts and service worker management

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let updateAvailable = false;
let updateCallback: (() => void) | null = null;

// Check if we're in development mode using Vite's environment
const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Set up update detection
      setupUpdateDetection(registration);
      
      // Check for updates immediately
      checkForUpdates(registration);
      
      // In development mode, clear cache on registration
      if (isDevelopment()) {
        console.warn('Development mode detected - clearing service worker cache');
        clearServiceWorkerCache();
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Clear service worker cache (useful for development)
export const clearServiceWorkerCache = async (): Promise<void> => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      // Send message to service worker to clear cache
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
      
      // Also clear browser cache for development
      if (isDevelopment()) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.warn('Development cache cleared');
      }
    } catch (error) {
      console.error('Failed to clear service worker cache:', error);
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
    border-bottom: 1px solid var(--button-info-bg);
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
export const forceUpdate = async (): Promise<void> => {
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

// Deep linking utilities for iOS PWA
export const setupDeepLinking = (): void => {
  // Handle deep linking for shared URLs
  if (isPWAInstalled()) {
    // If the app is installed, ensure we're handling the current URL properly
    handleCurrentURL();
  }

  // Listen for URL changes
  window.addEventListener('popstate', () => {
    if (isPWAInstalled()) {
      handleCurrentURL();
    }
  });
};

// Handle the current URL for deep linking
const handleCurrentURL = (): void => {
  const currentPath = window.location.pathname + window.location.search;
  
  // Check if this is a shared trip URL
  if (currentPath.includes('/trip/') && currentPath.includes('/share')) {
    // The ShareScreen component will handle the URL parsing
    console.warn('Deep link detected for shared trip:', currentPath);
  }
};

// Redirect to PWA if needed (for iOS)
export const redirectToPWA = (url: string): void => {
  if (isIos() && !isPWAInstalled()) {
    // On iOS, if the PWA is not installed, try to open in Safari
    // This is a fallback since iOS doesn't support programmatic PWA opening
    window.location.href = url;
  } else {
    // For other platforms or if PWA is installed, navigate normally
    window.location.href = url;
  }
};

// Check if running on iOS
export const isIos = (): boolean => {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
};

// Check if running in Safari on iOS
export const isIosSafari = (): boolean => {
  const ua = window.navigator.userAgent;
  return isIos() && /safari/i.test(ua) && !/crios|fxios|opios|edgios/i.test(ua);
}; 