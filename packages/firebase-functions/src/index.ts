import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { authFunctions } from './functions/auth';
import { invoiceFunctions } from './functions/invoices';
import { expenseFunctions } from './functions/expenses';
import { visionFunctions } from './functions/vision';
import { emailFunctions } from './functions/email';

// Initialize Firebase Admin
admin.initializeApp();

// Export Firestore instance
export const db = admin.firestore();
export const storage = admin.storage();
export const auth = admin.auth();

// Export all functions
export const {
  createUser,
  deleteUser,
  onUserCreated,
} = authFunctions;

export const {
  createInvoice,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  listInvoices,
  getInvoicesByUser,
} = invoiceFunctions;

export const {
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  listExpenses,
  getExpensesByUser,
} = expenseFunctions;

export const {
  analyzeInvoice,
  analyzeReceipt,
  processUploadedImage,
} = visionFunctions;

export const {
  connectGmail,
  connectOutlook,
  syncEmails,
  extractInvoicesFromEmail,
} = emailFunctions;

// Health check endpoint
export const healthCheck = functions.https.onRequest((req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'BuildBills Functions',
  });
});
