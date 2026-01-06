"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseFunctions = exports.getExpensesByUser = exports.listExpenses = exports.deleteExpense = exports.updateExpense = exports.getExpense = exports.createExpense = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
/**
 * Create a new expense
 */
exports.createExpense = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { uid } = request.auth;
    const { category, amount, description, date, receiptUrl } = request.data;
    if (!category || !amount) {
        throw new https_1.HttpsError('invalid-argument', 'Missing required fields');
    }
    try {
        const expenseRef = await db.collection('expenses').add({
            userId: uid,
            category,
            amount: parseFloat(amount),
            description: description || '',
            date: date || admin.firestore.FieldValue.serverTimestamp(),
            receiptUrl: receiptUrl || null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { success: true, expenseId: expenseRef.id };
    }
    catch (error) {
        console.error('Error creating expense:', error);
        throw new https_1.HttpsError('internal', 'Failed to create expense');
    }
});
/**
 * Get a single expense by ID
 */
exports.getExpense = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { expenseId } = request.data;
    const { uid } = request.auth;
    if (!expenseId) {
        throw new https_1.HttpsError('invalid-argument', 'Expense ID is required');
    }
    try {
        const expenseDoc = await db.collection('expenses').doc(expenseId).get();
        if (!expenseDoc.exists) {
            throw new https_1.HttpsError('not-found', 'Expense not found');
        }
        const expense = expenseDoc.data();
        if ((expense === null || expense === void 0 ? void 0 : expense.userId) !== uid) {
            throw new https_1.HttpsError('permission-denied', 'Access denied');
        }
        return Object.assign(Object.assign({}, expense), { id: expenseDoc.id });
    }
    catch (error) {
        console.error('Error getting expense:', error);
        throw new https_1.HttpsError('internal', 'Failed to get expense');
    }
});
/**
 * Update an expense
 */
exports.updateExpense = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const _a = request.data, { expenseId } = _a, updateData = __rest(_a, ["expenseId"]);
    const { uid } = request.auth;
    if (!expenseId) {
        throw new https_1.HttpsError('invalid-argument', 'Expense ID is required');
    }
    try {
        const expenseRef = db.collection('expenses').doc(expenseId);
        const expenseDoc = await expenseRef.get();
        if (!expenseDoc.exists) {
            throw new https_1.HttpsError('not-found', 'Expense not found');
        }
        const expense = expenseDoc.data();
        if ((expense === null || expense === void 0 ? void 0 : expense.userId) !== uid) {
            throw new https_1.HttpsError('permission-denied', 'Access denied');
        }
        await expenseRef.update(Object.assign(Object.assign({}, updateData), { updatedAt: admin.firestore.FieldValue.serverTimestamp() }));
        return { success: true };
    }
    catch (error) {
        console.error('Error updating expense:', error);
        throw new https_1.HttpsError('internal', 'Failed to update expense');
    }
});
/**
 * Delete an expense
 */
exports.deleteExpense = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { expenseId } = request.data;
    const { uid } = request.auth;
    if (!expenseId) {
        throw new https_1.HttpsError('invalid-argument', 'Expense ID is required');
    }
    try {
        const expenseRef = db.collection('expenses').doc(expenseId);
        const expenseDoc = await expenseRef.get();
        if (!expenseDoc.exists) {
            throw new https_1.HttpsError('not-found', 'Expense not found');
        }
        const expense = expenseDoc.data();
        if ((expense === null || expense === void 0 ? void 0 : expense.userId) !== uid) {
            throw new https_1.HttpsError('permission-denied', 'Access denied');
        }
        await expenseRef.delete();
        return { success: true };
    }
    catch (error) {
        console.error('Error deleting expense:', error);
        throw new https_1.HttpsError('internal', 'Failed to delete expense');
    }
});
/**
 * List all expenses for a user
 */
exports.listExpenses = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { uid } = request.auth;
    const { limit = 50, startAfter } = request.data;
    try {
        let query = db.collection('expenses')
            .where('userId', '==', uid)
            .orderBy('date', 'desc')
            .limit(limit);
        if (startAfter) {
            const startDoc = await db.collection('expenses').doc(startAfter).get();
            query = query.startAfter(startDoc);
        }
        const snapshot = await query.get();
        const expenses = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        return { expenses };
    }
    catch (error) {
        console.error('Error listing expenses:', error);
        throw new https_1.HttpsError('internal', 'Failed to list expenses');
    }
});
/**
 * Get expenses by user
 */
exports.getExpensesByUser = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { uid } = request.auth;
    try {
        const snapshot = await db.collection('expenses')
            .where('userId', '==', uid)
            .orderBy('date', 'desc')
            .get();
        const expenses = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        return { expenses };
    }
    catch (error) {
        console.error('Error getting expenses by user:', error);
        throw new https_1.HttpsError('internal', 'Failed to get expenses');
    }
});
exports.expenseFunctions = {
    createExpense: exports.createExpense,
    getExpense: exports.getExpense,
    updateExpense: exports.updateExpense,
    deleteExpense: exports.deleteExpense,
    listExpenses: exports.listExpenses,
    getExpensesByUser: exports.getExpensesByUser,
};
//# sourceMappingURL=expenses.js.map