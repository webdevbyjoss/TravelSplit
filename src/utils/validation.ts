import { VALIDATION } from '../constants';
import { CURRENCIES } from '../constants';

export const validateTitle = (title: string): string | null => {
  if (!title.trim()) {
    return 'Title is required';
  }
  if (title.length < VALIDATION.MIN_TITLE_LENGTH) {
    return `Title must be at least ${VALIDATION.MIN_TITLE_LENGTH} character long`;
  }
  if (title.length > VALIDATION.MAX_TITLE_LENGTH) {
    return `Title must be no more than ${VALIDATION.MAX_TITLE_LENGTH} characters`;
  }
  return null;
};

export const validateAmount = (amount: number): string | null => {
  if (amount < VALIDATION.MIN_AMOUNT) {
    return `Amount must be at least ${VALIDATION.MIN_AMOUNT}`;
  }
  if (amount > VALIDATION.MAX_AMOUNT) {
    return `Amount must be no more than ${VALIDATION.MAX_AMOUNT}`;
  }
  if (!Number.isFinite(amount)) {
    return 'Amount must be a valid number';
  }
  return null;
};

export const validateTeamMember = (name: string): string | null => {
  if (!name.trim()) {
    return 'Name is required';
  }
  if (name.length < 1) {
    return 'Name must be at least 1 character long';
  }
  if (name.length > 50) {
    return 'Name must be no more than 50 characters';
  }
  return null;
};

export function getCurrencySymbol(currency: string): string {
  return CURRENCIES[currency as keyof typeof CURRENCIES]?.symbol || '$';
}
