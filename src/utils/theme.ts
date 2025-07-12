// Theme utility functions for TravelSplit

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Get the current system theme preference
 */
export function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Check if the system is in dark mode
 */
export function isDarkMode(): boolean {
  return getSystemTheme() === 'dark';
}

/**
 * Listen for system theme changes
 */
export function onThemeChange(callback: () => void): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = () => {
    callback();
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', handleChange);
}

/**
 * Get the effective theme (system preference or user override)
 */
export function getEffectiveTheme(): 'light' | 'dark' {
  // For now, we only support system preference
  // In the future, this could check for user preference in localStorage
  return getSystemTheme();
}

/**
 * Apply theme-specific meta tags
 */
export function updateThemeMetaTags(theme: 'light' | 'dark'): void {
  const themeColor = theme === 'dark' ? '#1a1a1a' : '#3273dc';
  
  // Update theme-color meta tag
  let themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeColorMeta) {
    themeColorMeta = document.createElement('meta');
    themeColorMeta.setAttribute('name', 'theme-color');
    document.head.appendChild(themeColorMeta);
  }
  themeColorMeta.setAttribute('content', themeColor);
}

/**
 * Initialize theme system
 */
export function initializeTheme(): void {
  const currentTheme = getEffectiveTheme();
  updateThemeMetaTags(currentTheme);
  
  // Listen for system theme changes
  onThemeChange(() => {
    const newTheme = getEffectiveTheme();
    updateThemeMetaTags(newTheme);
  });
}
