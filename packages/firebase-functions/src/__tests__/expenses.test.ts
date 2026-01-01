import * as admin from 'firebase-admin';
import * as test from 'firebase-functions-test';

const testEnv = test();

describe('Expense Functions', () => {
  let createExpense: any;
  let getExpense: any;
  let updateExpense: any;
  let deleteExpense: any;
  let listExpenses: any;

  beforeAll(() => {
    const functions = require('../functions/expenses');
    createExpense = functions.createExpense;
    getExpense = functions.getExpense;
    updateExpense = functions.updateExpense;
    deleteExpense = functions.deleteExpense;
    listExpenses = functions.listExpenses;
  });

  afterAll(() => {
    testEnv.cleanup();
  });

  describe('createExpense', () => {
    it('should create an expense successfully', async () => {
      const data = {
        category: 'Materials',
        amount: 50,
        description: 'Test expense',
      };

      const context = {
        auth: {
          uid: 'test-user-id',
        },
      };

      const wrapped = testEnv.wrap(createExpense);
      const result = await wrapped(data, context);

      expect(result.success).toBe(true);
      expect(result.expenseId).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const data = {
        category: 'Materials',
        amount: 50,
      };

      const wrapped = testEnv.wrap(createExpense);

      await expect(wrapped(data, {})).rejects.toThrow();
    });
  });

  describe('getExpense', () => {
    it('should retrieve an expense successfully', async () => {
      const data = {
        expenseId: 'test-expense-id',
      };

      const context = {
        auth: {
          uid: 'test-user',
        },
      };

      const wrapped = testEnv.wrap(getExpense);
      const result = await wrapped(data, context);

      expect(result.id).toBeDefined();
    });
  });
});
