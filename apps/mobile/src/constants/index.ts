/**
 * Constants
 * App-wide constants and configuration
 */

import { EXPENSE_CATEGORIES, PaymentMethod } from '@buildbills/shared-types';

// Export expense categories from shared types
export { EXPENSE_CATEGORIES };

// Payment methods
export const PAYMENT_METHODS: PaymentMethod[] = [
  'cash',
  'card',
  'bank_transfer',
  'check',
  'other',
];

// Payment method labels for display
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Cash',
  card: 'Credit/Debit Card',
  bank_transfer: 'Bank Transfer',
  check: 'Check',
  other: 'Other',
};
