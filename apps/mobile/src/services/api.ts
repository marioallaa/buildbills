/**
 * API Service
 * Wrapper for Firebase Cloud Functions
 */

import functions from '@react-native-firebase/functions';
import { functionsRegion } from '../config/firebase';
import {
  Invoice,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
  VisionAnalysisResult,
  ApiResponse,
} from '@buildbills/shared-types';

class APIService {
  private functions = functions();

  constructor() {
    // Use the configured region for functions
    if (functionsRegion) {
      this.functions = functions().region(functionsRegion);
    }
    
    // For development with emulators, uncomment this:
    // if (__DEV__) {
    //   this.functions.useFunctionsEmulator('http://localhost:5001');
    // }
  }

  /**
   * Call a Firebase function
   */
  private async call<T>(functionName: string, data?: any): Promise<T> {
    try {
      const callable = this.functions.httpsCallable(functionName);
      const result = await callable(data);
      return result.data;
    } catch (error: any) {
      console.error(`API Error calling ${functionName}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle Firebase function errors
   */
  private handleError(error: any): Error {
    if (error.code === 'functions/unauthenticated') {
      return new Error('You must be signed in to perform this action');
    }
    
    if (error.code === 'functions/permission-denied') {
      return new Error('You do not have permission to perform this action');
    }
    
    if (error.code === 'functions/not-found') {
      return new Error('The requested resource was not found');
    }
    
    if (error.code === 'functions/internal') {
      return new Error('An internal error occurred. Please try again later');
    }
    
    if (error.message) {
      return new Error(error.message);
    }
    
    return new Error('An unexpected error occurred');
  }

  // ============= Invoice Operations =============

  /**
   * Create a new invoice
   */
  async createInvoice(data: CreateInvoiceInput): Promise<Invoice> {
    const response = await this.call<ApiResponse<Invoice>>('createInvoice', data);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create invoice');
    }
    return response.data;
  }

  /**
   * Get invoice by ID
   */
  async getInvoice(invoiceId: string): Promise<Invoice> {
    const response = await this.call<ApiResponse<Invoice>>('getInvoice', { invoiceId });
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get invoice');
    }
    return response.data;
  }

  /**
   * List all invoices
   */
  async listInvoices(params?: { limit?: number; startAfter?: string }): Promise<Invoice[]> {
    const response = await this.call<ApiResponse<Invoice[]>>('listInvoices', params);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to list invoices');
    }
    return response.data;
  }

  /**
   * Update an invoice
   */
  async updateInvoice(invoiceId: string, data: UpdateInvoiceInput): Promise<Invoice> {
    const response = await this.call<ApiResponse<Invoice>>('updateInvoice', {
      invoiceId,
      ...data,
    });
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update invoice');
    }
    return response.data;
  }

  /**
   * Delete an invoice
   */
  async deleteInvoice(invoiceId: string): Promise<void> {
    const response = await this.call<ApiResponse>('deleteInvoice', { invoiceId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete invoice');
    }
  }

  // ============= Expense Operations =============

  /**
   * Create a new expense
   */
  async createExpense(data: CreateExpenseInput): Promise<Expense> {
    const response = await this.call<ApiResponse<Expense>>('createExpense', data);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create expense');
    }
    return response.data;
  }

  /**
   * Get expense by ID
   */
  async getExpense(expenseId: string): Promise<Expense> {
    const response = await this.call<ApiResponse<Expense>>('getExpense', { expenseId });
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get expense');
    }
    return response.data;
  }

  /**
   * List all expenses
   */
  async listExpenses(params?: { limit?: number; startAfter?: string }): Promise<Expense[]> {
    const response = await this.call<ApiResponse<Expense[]>>('listExpenses', params);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to list expenses');
    }
    return response.data;
  }

  /**
   * Update an expense
   */
  async updateExpense(expenseId: string, data: UpdateExpenseInput): Promise<Expense> {
    const response = await this.call<ApiResponse<Expense>>('updateExpense', {
      expenseId,
      ...data,
    });
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update expense');
    }
    return response.data;
  }

  /**
   * Delete an expense
   */
  async deleteExpense(expenseId: string): Promise<void> {
    const response = await this.call<ApiResponse>('deleteExpense', { expenseId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete expense');
    }
  }

  // ============= Vision AI Operations =============

  /**
   * Analyze a receipt image
   */
  async analyzeReceipt(imageUrl: string): Promise<VisionAnalysisResult> {
    const response = await this.call<ApiResponse<VisionAnalysisResult>>('analyzeReceipt', {
      imageUrl,
    });
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to analyze receipt');
    }
    return response.data;
  }

  /**
   * Analyze an invoice image
   */
  async analyzeInvoice(imageUrl: string): Promise<VisionAnalysisResult> {
    const response = await this.call<ApiResponse<VisionAnalysisResult>>('analyzeInvoice', {
      imageUrl,
    });
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to analyze invoice');
    }
    return response.data;
  }
}

// Export singleton instance
export const api = new APIService();
