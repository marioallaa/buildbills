/**
 * Color Palette
 * Consistent color scheme for the entire application
 */

export const colors = {
  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryLight: '#4DA3FF',
  
  // Secondary colors
  secondary: '#5AC8FA',
  secondaryDark: '#32AEE8',
  secondaryLight: '#88D9FB',
  
  // Status colors
  success: '#34C759',
  successLight: '#6FDC8C',
  warning: '#FF9500',
  warningLight: '#FFB340',
  error: '#FF3B30',
  errorLight: '#FF6B60',
  info: '#5AC8FA',
  
  // Invoice status colors
  draft: '#999999',
  sent: '#5AC8FA',
  paid: '#34C759',
  overdue: '#FF3B30',
  cancelled: '#8E8E93',
  
  // Neutral colors
  black: '#000000',
  white: '#FFFFFF',
  gray900: '#1C1C1E',
  gray800: '#2C2C2E',
  gray700: '#3A3A3C',
  gray600: '#48484A',
  gray500: '#636366',
  gray400: '#8E8E93',
  gray300: '#C7C7CC',
  gray200: '#D1D1D6',
  gray100: '#E5E5EA',
  gray50: '#F2F2F7',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  backgroundTertiary: '#F9F9F9',
  
  // Text colors
  text: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textDisabled: '#C7C7CC',
  textInverse: '#FFFFFF',
  
  // Border colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderDark: '#C7C7CC',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Expense amount color (negative)
  expense: '#FF3B30',
  
  // Income amount color (positive)
  income: '#34C759',
};

export type ColorName = keyof typeof colors;
