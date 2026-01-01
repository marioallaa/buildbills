/**
 * Data Context
 * Manages invoices, expenses, and other app data
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  Invoice,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
} from '@buildbills/shared-types';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface DataContextType {
  // Invoices
  invoices: Invoice[];
  loadingInvoices: boolean;
  createInvoice: (data: CreateInvoiceInput) => Promise<Invoice>;
  updateInvoice: (id: string, data: UpdateInvoiceInput) => Promise<Invoice>;
  deleteInvoice: (id: string) => Promise<void>;
  refreshInvoices: () => Promise<void>;
  
  // Expenses
  expenses: Expense[];
  loadingExpenses: boolean;
  createExpense: (data: CreateExpenseInput) => Promise<Expense>;
  updateExpense: (id: string, data: UpdateExpenseInput) => Promise<Expense>;
  deleteExpense: (id: string) => Promise<void>;
  refreshExpenses: () => Promise<void>;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  
  const [error, setError] = useState<string | null>(null);

  // Set up real-time listeners for invoices
  useEffect(() => {
    if (!user) {
      setInvoices([]);
      return;
    }

    setLoadingInvoices(true);
    
    const unsubscribe = firestore()
      .collection('invoices')
      .where('userId', '==', user.id)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          const invoiceData: Invoice[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
              dueDate: data.dueDate?.toDate(),
              issueDate: data.issueDate?.toDate(),
              paidAt: data.paidAt?.toDate(),
              sentAt: data.sentAt?.toDate(),
            } as Invoice;
          });
          setInvoices(invoiceData);
          setLoadingInvoices(false);
        },
        (err) => {
          console.error('Error loading invoices:', err);
          setError('Failed to load invoices');
          setLoadingInvoices(false);
        }
      );

    return () => unsubscribe();
  }, [user]);

  // Set up real-time listeners for expenses
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      return;
    }

    setLoadingExpenses(true);
    
    const unsubscribe = firestore()
      .collection('expenses')
      .where('userId', '==', user.id)
      .orderBy('date', 'desc')
      .onSnapshot(
        (snapshot) => {
          const expenseData: Expense[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              date: data.date?.toDate() || new Date(),
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Expense;
          });
          setExpenses(expenseData);
          setLoadingExpenses(false);
        },
        (err) => {
          console.error('Error loading expenses:', err);
          setError('Failed to load expenses');
          setLoadingExpenses(false);
        }
      );

    return () => unsubscribe();
  }, [user]);

  // Invoice operations
  const createInvoice = async (data: CreateInvoiceInput): Promise<Invoice> => {
    try {
      setError(null);
      const invoice = await api.createInvoice(data);
      // Real-time listener will update the state
      return invoice;
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice');
      throw err;
    }
  };

  const updateInvoice = async (id: string, data: UpdateInvoiceInput): Promise<Invoice> => {
    try {
      setError(null);
      const invoice = await api.updateInvoice(id, data);
      // Real-time listener will update the state
      return invoice;
    } catch (err: any) {
      setError(err.message || 'Failed to update invoice');
      throw err;
    }
  };

  const deleteInvoice = async (id: string): Promise<void> => {
    try {
      setError(null);
      await api.deleteInvoice(id);
      // Real-time listener will update the state
    } catch (err: any) {
      setError(err.message || 'Failed to delete invoice');
      throw err;
    }
  };

  const refreshInvoices = async (): Promise<void> => {
    // With real-time listeners, manual refresh is not needed
    // But we can force a re-fetch if needed
    setLoadingInvoices(true);
    try {
      const invoiceList = await api.listInvoices();
      setInvoices(invoiceList);
    } catch (err: any) {
      setError(err.message || 'Failed to refresh invoices');
    } finally {
      setLoadingInvoices(false);
    }
  };

  // Expense operations
  const createExpense = async (data: CreateExpenseInput): Promise<Expense> => {
    try {
      setError(null);
      const expense = await api.createExpense(data);
      // Real-time listener will update the state
      return expense;
    } catch (err: any) {
      setError(err.message || 'Failed to create expense');
      throw err;
    }
  };

  const updateExpense = async (id: string, data: UpdateExpenseInput): Promise<Expense> => {
    try {
      setError(null);
      const expense = await api.updateExpense(id, data);
      // Real-time listener will update the state
      return expense;
    } catch (err: any) {
      setError(err.message || 'Failed to update expense');
      throw err;
    }
  };

  const deleteExpense = async (id: string): Promise<void> => {
    try {
      setError(null);
      await api.deleteExpense(id);
      // Real-time listener will update the state
    } catch (err: any) {
      setError(err.message || 'Failed to delete expense');
      throw err;
    }
  };

  const refreshExpenses = async (): Promise<void> => {
    setLoadingExpenses(true);
    try {
      const expenseList = await api.listExpenses();
      setExpenses(expenseList);
    } catch (err: any) {
      setError(err.message || 'Failed to refresh expenses');
    } finally {
      setLoadingExpenses(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: DataContextType = {
    invoices,
    loadingInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    refreshInvoices,
    expenses,
    loadingExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses,
    error,
    clearError,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
