import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * Create a new expense
 */
export const createExpense = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { uid } = context.auth;
  const { category, amount, description, date, receiptUrl } = data;

  if (!category || !amount) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
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
  } catch (error) {
    console.error('Error creating expense:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create expense');
  }
});

/**
 * Get a single expense by ID
 */
export const getExpense = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { expenseId } = data;
  const { uid } = context.auth;

  if (!expenseId) {
    throw new functions.https.HttpsError('invalid-argument', 'Expense ID is required');
  }

  try {
    const expenseDoc = await db.collection('expenses').doc(expenseId).get();

    if (!expenseDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Expense not found');
    }

    const expense = expenseDoc.data();
    if (expense?.userId !== uid) {
      throw new functions.https.HttpsError('permission-denied', 'Access denied');
    }

    return { ...expense, id: expenseDoc.id };
  } catch (error) {
    console.error('Error getting expense:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get expense');
  }
});

/**
 * Update an expense
 */
export const updateExpense = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { expenseId, ...updateData } = data;
  const { uid } = context.auth;

  if (!expenseId) {
    throw new functions.https.HttpsError('invalid-argument', 'Expense ID is required');
  }

  try {
    const expenseRef = db.collection('expenses').doc(expenseId);
    const expenseDoc = await expenseRef.get();

    if (!expenseDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Expense not found');
    }

    const expense = expenseDoc.data();
    if (expense?.userId !== uid) {
      throw new functions.https.HttpsError('permission-denied', 'Access denied');
    }

    await expenseRef.update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating expense:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update expense');
  }
});

/**
 * Delete an expense
 */
export const deleteExpense = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { expenseId } = data;
  const { uid } = context.auth;

  if (!expenseId) {
    throw new functions.https.HttpsError('invalid-argument', 'Expense ID is required');
  }

  try {
    const expenseRef = db.collection('expenses').doc(expenseId);
    const expenseDoc = await expenseRef.get();

    if (!expenseDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Expense not found');
    }

    const expense = expenseDoc.data();
    if (expense?.userId !== uid) {
      throw new functions.https.HttpsError('permission-denied', 'Access denied');
    }

    await expenseRef.delete();

    return { success: true };
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw new functions.https.HttpsError('internal', 'Failed to delete expense');
  }
});

/**
 * List all expenses for a user
 */
export const listExpenses = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { uid } = context.auth;
  const { limit = 50, startAfter } = data;

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
    const expenses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { expenses };
  } catch (error) {
    console.error('Error listing expenses:', error);
    throw new functions.https.HttpsError('internal', 'Failed to list expenses');
  }
});

/**
 * Get expenses by user
 */
export const getExpensesByUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { uid } = context.auth;

  try {
    const snapshot = await db.collection('expenses')
      .where('userId', '==', uid)
      .orderBy('date', 'desc')
      .get();

    const expenses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { expenses };
  } catch (error) {
    console.error('Error getting expenses by user:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get expenses');
  }
});

export const expenseFunctions = {
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  listExpenses,
  getExpensesByUser,
};
