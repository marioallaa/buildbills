/**
 * Constants
 * App-wide constants and configuration
 */

import { ExpenseCategory, PaymentMethod } from '@buildbills/shared-types';

// Expense categories as defined in shared types
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Office Supplies',
  'Travel & Transportation',
  'Meals & Entertainment',
  'Professional Services',
  'Utilities',
  'Rent/Lease',
  'Insurance',
  'Marketing & Advertising',
  'Equipment & Tools',
  'Materials & Supplies',
  'Subcontractor Costs',
  'Vehicle Expenses',
  'Bank Fees',
  'Other',
];

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
