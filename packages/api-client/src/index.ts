import axios, { AxiosInstance } from 'axios';
import type {
  Invoice,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
  VisionAnalysisResult,
  ApiResponse,
} from '@buildbills/shared-types';

export class BuildBillsApiClient {
  private api: AxiosInstance;
  private authToken: string | null = null;

  constructor(baseURL: string = 'https://us-central1-buildbills-project.cloudfunctions.net') {
    this.api = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use((config) => {
      if (this.authToken) {
        config.headers.Authorization = `Bearer ${this.authToken}`;
      }
      return config;
    });
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = null;
  }

  // Invoice methods
  async createInvoice(data: CreateInvoiceInput): Promise<ApiResponse<{ invoiceId: string }>> {
    const response = await this.api.post('/createInvoice', data);
    return response.data;
  }

  async getInvoice(invoiceId: string): Promise<ApiResponse<Invoice>> {
    const response = await this.api.post('/getInvoice', { invoiceId });
    return response.data;
  }

  async updateInvoice(invoiceId: string, data: UpdateInvoiceInput): Promise<ApiResponse> {
    const response = await this.api.post('/updateInvoice', { invoiceId, ...data });
    return response.data;
  }

  async deleteInvoice(invoiceId: string): Promise<ApiResponse> {
    const response = await this.api.post('/deleteInvoice', { invoiceId });
    return response.data;
  }

  async listInvoices(limit?: number, startAfter?: string): Promise<ApiResponse<{ invoices: Invoice[] }>> {
    const response = await this.api.post('/listInvoices', { limit, startAfter });
    return response.data;
  }

  // Expense methods
  async createExpense(data: CreateExpenseInput): Promise<ApiResponse<{ expenseId: string }>> {
    const response = await this.api.post('/createExpense', data);
    return response.data;
  }

  async getExpense(expenseId: string): Promise<ApiResponse<Expense>> {
    const response = await this.api.post('/getExpense', { expenseId });
    return response.data;
  }

  async updateExpense(expenseId: string, data: UpdateExpenseInput): Promise<ApiResponse> {
    const response = await this.api.post('/updateExpense', { expenseId, ...data });
    return response.data;
  }

  async deleteExpense(expenseId: string): Promise<ApiResponse> {
    const response = await this.api.post('/deleteExpense', { expenseId });
    return response.data;
  }

  async listExpenses(limit?: number, startAfter?: string): Promise<ApiResponse<{ expenses: Expense[] }>> {
    const response = await this.api.post('/listExpenses', { limit, startAfter });
    return response.data;
  }

  // Vision AI methods
  async analyzeInvoice(imageUrl?: string, imageBase64?: string): Promise<VisionAnalysisResult> {
    const response = await this.api.post('/analyzeInvoice', { imageUrl, imageBase64 });
    return response.data;
  }

  async analyzeReceipt(imageUrl?: string, imageBase64?: string): Promise<VisionAnalysisResult> {
    const response = await this.api.post('/analyzeReceipt', { imageUrl, imageBase64 });
    return response.data;
  }

  // Email integration methods
  async connectGmail(accessToken: string, refreshToken: string): Promise<ApiResponse> {
    const response = await this.api.post('/connectGmail', { accessToken, refreshToken });
    return response.data;
  }

  async connectOutlook(accessToken: string, refreshToken: string): Promise<ApiResponse> {
    const response = await this.api.post('/connectOutlook', { accessToken, refreshToken });
    return response.data;
  }

  async syncEmails(): Promise<ApiResponse<{ emailsScanned: number; documentsExtracted: number }>> {
    const response = await this.api.post('/syncEmails', {});
    return response.data;
  }

  async extractInvoicesFromEmail(emailId: string): Promise<ApiResponse<{ attachments: any[] }>> {
    const response = await this.api.post('/extractInvoicesFromEmail', { emailId });
    return response.data;
  }
}

// Export a default instance
export const apiClient = new BuildBillsApiClient();

// Export the class for custom instances
export default BuildBillsApiClient;
