import * as admin from 'firebase-admin';
import * as test from 'firebase-functions-test';

// Initialize test environment
const testEnv = test();

// Mock Firestore
const mockFirestore = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      set: jest.fn(() => Promise.resolve()),
      get: jest.fn(() => Promise.resolve({
        exists: true,
        data: () => ({
          userId: 'test-user',
          clientName: 'Test Client',
          amount: 100,
          status: 'draft',
        }),
        id: 'test-invoice-id',
      })),
      update: jest.fn(() => Promise.resolve()),
      delete: jest.fn(() => Promise.resolve()),
    })),
    add: jest.fn(() => Promise.resolve({ id: 'new-invoice-id' })),
    where: jest.fn(() => ({
      orderBy: jest.fn(() => ({
        limit: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve({
            empty: false,
            docs: [
              {
                id: 'invoice-1',
                data: () => ({
                  clientName: 'Client 1',
                  amount: 100,
                }),
              },
            ],
          })),
          startAfter: jest.fn(() => ({
            get: jest.fn(() => Promise.resolve({
              empty: false,
              docs: [],
            })),
          })),
        })),
      })),
      get: jest.fn(() => Promise.resolve({
        empty: false,
        docs: [
          {
            id: 'invoice-1',
            data: () => ({
              clientName: 'Client 1',
              amount: 100,
            }),
          },
        ],
      })),
    })),
  })),
};

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  firestore: jest.fn(() => mockFirestore),
  auth: jest.fn(() => ({
    deleteUser: jest.fn(() => Promise.resolve()),
  })),
  storage: jest.fn(() => ({})),
}));

describe('Invoice Functions', () => {
  let createInvoice: any;
  let getInvoice: any;
  let updateInvoice: any;
  let deleteInvoice: any;
  let listInvoices: any;

  beforeAll(() => {
    // Import functions after mocking
    const functions = require('../functions/invoices');
    createInvoice = functions.createInvoice;
    getInvoice = functions.getInvoice;
    updateInvoice = functions.updateInvoice;
    deleteInvoice = functions.deleteInvoice;
    listInvoices = functions.listInvoices;
  });

  afterAll(() => {
    testEnv.cleanup();
  });

  describe('createInvoice', () => {
    it('should create an invoice successfully', async () => {
      const data = {
        clientName: 'Test Client',
        amount: 100,
        description: 'Test invoice',
      };

      const context = {
        auth: {
          uid: 'test-user-id',
        },
      };

      const wrapped = testEnv.wrap(createInvoice);
      const result = await wrapped(data, context);

      expect(result.success).toBe(true);
      expect(result.invoiceId).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const data = {
        clientName: 'Test Client',
        amount: 100,
      };

      const wrapped = testEnv.wrap(createInvoice);

      await expect(wrapped(data, {})).rejects.toThrow();
    });

    it('should fail without required fields', async () => {
      const data = {
        description: 'Test invoice',
      };

      const context = {
        auth: {
          uid: 'test-user-id',
        },
      };

      const wrapped = testEnv.wrap(createInvoice);

      await expect(wrapped(data, context)).rejects.toThrow();
    });
  });

  describe('getInvoice', () => {
    it('should retrieve an invoice successfully', async () => {
      const data = {
        invoiceId: 'test-invoice-id',
      };

      const context = {
        auth: {
          uid: 'test-user',
        },
      };

      const wrapped = testEnv.wrap(getInvoice);
      const result = await wrapped(data, context);

      expect(result.id).toBe('test-invoice-id');
      expect(result.clientName).toBe('Test Client');
    });

    it('should fail without invoice ID', async () => {
      const data = {};

      const context = {
        auth: {
          uid: 'test-user',
        },
      };

      const wrapped = testEnv.wrap(getInvoice);

      await expect(wrapped(data, context)).rejects.toThrow();
    });
  });

  describe('updateInvoice', () => {
    it('should update an invoice successfully', async () => {
      const data = {
        invoiceId: 'test-invoice-id',
        status: 'sent',
        amount: 150,
      };

      const context = {
        auth: {
          uid: 'test-user',
        },
      };

      const wrapped = testEnv.wrap(updateInvoice);
      const result = await wrapped(data, context);

      expect(result.success).toBe(true);
    });
  });

  describe('deleteInvoice', () => {
    it('should delete an invoice successfully', async () => {
      const data = {
        invoiceId: 'test-invoice-id',
      };

      const context = {
        auth: {
          uid: 'test-user',
        },
      };

      const wrapped = testEnv.wrap(deleteInvoice);
      const result = await wrapped(data, context);

      expect(result.success).toBe(true);
    });
  });

  describe('listInvoices', () => {
    it('should list invoices successfully', async () => {
      const data = {
        limit: 10,
      };

      const context = {
        auth: {
          uid: 'test-user',
        },
      };

      const wrapped = testEnv.wrap(listInvoices);
      const result = await wrapped(data, context);

      expect(result.invoices).toBeDefined();
      expect(Array.isArray(result.invoices)).toBe(true);
    });
  });
});
