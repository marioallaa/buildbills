"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_functions_test_1 = __importDefault(require("firebase-functions-test"));
const testEnv = (0, firebase_functions_test_1.default)();
describe('Expense Functions', () => {
    let createExpense;
    let getExpense;
    beforeAll(() => {
        const functions = require('../functions/expenses');
        createExpense = functions.createExpense;
        getExpense = functions.getExpense;
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
//# sourceMappingURL=expenses.test.js.map