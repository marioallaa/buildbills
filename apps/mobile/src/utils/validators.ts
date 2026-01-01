/**
 * Validators
 * Utility functions for validating data
 */

/**
 * Validate email address
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (password.length < 8) {
    errors.push('For better security, use at least 8 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Include at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Include at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Include at least one number');
  }
  
  return {
    isValid: errors.length === 0 || (errors.length === 1 && errors[0].includes('better security')),
    errors,
  };
};

/**
 * Validate phone number (US format)
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate required field
 */
export const validateRequired = (value: any, fieldName: string = 'Field'): string | null => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate number range
 */
export const validateNumberRange = (
  value: number,
  min?: number,
  max?: number,
  fieldName: string = 'Value'
): string | null => {
  if (isNaN(value)) {
    return `${fieldName} must be a valid number`;
  }
  
  if (min !== undefined && value < min) {
    return `${fieldName} must be at least ${min}`;
  }
  
  if (max !== undefined && value > max) {
    return `${fieldName} must be at most ${max}`;
  }
  
  return null;
};

/**
 * Validate amount (positive number with max 2 decimal places)
 */
export const validateAmount = (amount: string | number): string | null => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return 'Amount must be a valid number';
  }
  
  if (numAmount < 0) {
    return 'Amount must be positive';
  }
  
  if (numAmount > 999999999) {
    return 'Amount is too large';
  }
  
  // Check decimal places
  const decimalPlaces = (amount.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return 'Amount can have at most 2 decimal places';
  }
  
  return null;
};

/**
 * Validate date
 */
export const validateDate = (date: Date | string, fieldName: string = 'Date'): string | null => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return `${fieldName} is not a valid date`;
  }
  
  return null;
};

/**
 * Validate date range
 */
export const validateDateRange = (
  startDate: Date | string,
  endDate: Date | string
): string | null => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  if (!(start instanceof Date) || isNaN(start.getTime())) {
    return 'Start date is not valid';
  }
  
  if (!(end instanceof Date) || isNaN(end.getTime())) {
    return 'End date is not valid';
  }
  
  if (start > end) {
    return 'Start date must be before end date';
  }
  
  return null;
};

/**
 * Validate invoice items
 */
export const validateInvoiceItems = (items: any[]): string | null => {
  if (!items || items.length === 0) {
    return 'At least one item is required';
  }
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    if (!item.description || item.description.trim() === '') {
      return `Item ${i + 1}: Description is required`;
    }
    
    if (!item.quantity || item.quantity <= 0) {
      return `Item ${i + 1}: Quantity must be greater than 0`;
    }
    
    if (!item.unitPrice || item.unitPrice < 0) {
      return `Item ${i + 1}: Unit price must be a positive number`;
    }
  }
  
  return null;
};

/**
 * Sanitize input (basic XSS prevention)
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
