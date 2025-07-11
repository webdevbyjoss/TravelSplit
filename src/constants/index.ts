// Currency configuration
export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  UAH: { symbol: '₴', name: 'Ukrainian Hryvnia' },
  PLN: { symbol: 'zł', name: 'Polish Złoty' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc' },
  NOK: { symbol: 'kr', name: 'Norwegian Krone' },
  SEK: { symbol: 'kr', name: 'Swedish Krona' },
  CZK: { symbol: 'Kč', name: 'Czech Koruna' },
} as const;

export const DEFAULT_CURRENCY = 'USD';

// App configuration
export const APP_CONFIG = {
  NAME: 'TravelSplit',
  VERSION: '1.0.0',
  DESCRIPTION: 'Split travel expenses with friends and family',
  STORAGE_KEY: 'TravelSplit',
} as const;

// Validation constants
export const VALIDATION = {
  MIN_TITLE_LENGTH: 1,
  MAX_TITLE_LENGTH: 100,
  MIN_AMOUNT: 0,
  MAX_AMOUNT: 1000000,
} as const; 