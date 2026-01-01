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
}

export interface UserSettings {
  currency: string;
  notifications: boolean;
  theme?: 'light' | 'dark';
}

/**
 * Invoice Types
 */
export interface Invoice {
  id: string;
  userId: string;
  clientName: string;
  clientEmail?: string;
  amount: number;
  description?: string;
  items?: InvoiceItem[];
  dueDate?: Date;
  status: InvoiceStatus;
  invoiceNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface CreateInvoiceInput {
  clientName: string;
  clientEmail?: string;
  amount: number;
  description?: string;
  items?: InvoiceItem[];
  dueDate?: Date;
}

export interface UpdateInvoiceInput {
  clientName?: string;
  clientEmail?: string;
  amount?: number;
  description?: string;
  items?: InvoiceItem[];
  dueDate?: Date;
  status?: InvoiceStatus;
}

/**
 * Expense Types
 */
export interface Expense {
  id: string;
  userId: string;
  category: string;
  amount: number;
  description?: string;
  date: Date;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenseInput {
  category: string;
  amount: number;
  description?: string;
  date?: Date;
  receiptUrl?: string;
}

export interface UpdateExpenseInput {
  category?: string;
  amount?: number;
  description?: string;
  date?: Date;
  receiptUrl?: string;
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
  category?: string;
  items?: any[];
}

export interface VisionAnalysisResult {
  success: boolean;
  extractedData: ExtractedInvoiceData | ExtractedReceiptData;
  fullText: string;
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
