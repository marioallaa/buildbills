/**
 * User Types
 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
  settings?: UserSettings;
  profile?: UserProfile;
}

export interface UserProfile {
  businessName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  photoURL?: string;
}

export interface UserSettings {
  currency: string;
  notifications: boolean;
  theme?: 'light' | 'dark';
  defaultPaymentTerms?: number; // in days
  invoicePrefix?: string;
  language?: string;
}

/**
 * Invoice Types
 */
export interface Invoice {
  id: string;
  userId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  amount: number;
  subtotal?: number;
  taxAmount?: number;
  taxRate?: number;
  description?: string;
  items?: InvoiceItem[];
  dueDate?: Date;
  issueDate?: Date;
  status: InvoiceStatus;
  invoiceNumber: string;
  notes?: string;
  terms?: string;
  paymentTerms?: number; // in days
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  sentAt?: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  total: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface CreateInvoiceInput {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  amount: number;
  subtotal?: number;
  taxAmount?: number;
  taxRate?: number;
  description?: string;
  items?: InvoiceItem[];
  dueDate?: Date;
  issueDate?: Date;
  notes?: string;
  terms?: string;
  paymentTerms?: number;
}

export interface UpdateInvoiceInput {
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  amount?: number;
  subtotal?: number;
  taxAmount?: number;
  taxRate?: number;
  description?: string;
  items?: InvoiceItem[];
  dueDate?: Date;
  issueDate?: Date;
  status?: InvoiceStatus;
  notes?: string;
  terms?: string;
  paymentTerms?: number;
}

/**
 * Expense Types
 */

// Expense categories as const for better type safety and maintainability
export const EXPENSE_CATEGORIES = [
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
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'check' | 'other';

export interface Expense {
  id: string;
  userId: string;
  vendor?: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  date: Date;
  paymentMethod?: PaymentMethod;
  taxDeductible?: boolean;
  receiptUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenseInput {
  vendor?: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  date?: Date;
  paymentMethod?: PaymentMethod;
  taxDeductible?: boolean;
  receiptUrl?: string;
  notes?: string;
}

export interface UpdateExpenseInput {
  vendor?: string;
  category?: ExpenseCategory;
  amount?: number;
  description?: string;
  date?: Date;
  paymentMethod?: PaymentMethod;
  taxDeductible?: boolean;
  receiptUrl?: string;
  notes?: string;
}

/**
 * Email Connection Types
 */
export interface EmailConnection {
  provider: 'gmail' | 'outlook';
  accessToken: string;
  refreshToken: string;
  connectedAt: Date;
  updatedAt: Date;
}

/**
 * Vision AI Types
 */
export interface Receipt {
  id: string;
  userId: string;
  expenseId?: string;
  imageUrl: string;
  extractedData?: ExtractedReceiptData;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExtractedInvoiceData {
  clientName?: string;
  amount?: number;
  invoiceNumber?: string;
  date?: string;
  items?: any[];
}

export interface ExtractedReceiptData {
  merchant?: string;
  amount?: number;
  date?: string;
  category?: ExpenseCategory;
  items?: any[];
  total?: number;
  tax?: number;
  subtotal?: number;
}

export interface VisionAnalysisResult {
  success: boolean;
  extractedData: ExtractedInvoiceData | ExtractedReceiptData;
  fullText: string;
  confidence?: number;
}

/**
 * API Response Types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
