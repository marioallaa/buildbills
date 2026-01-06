import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * Create a new invoice
 */
export const createInvoice = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { uid } = request.auth;
  const { clientName, clientEmail, amount, description, items, dueDate } = request.data;

  if (!clientName || !amount) {
    throw new HttpsError('invalid-argument', 'Missing required fields');
  }

  try {
    const invoiceRef = await db.collection('invoices').add({
      userId: uid,
      clientName,
      clientEmail: clientEmail || null,
      amount: parseFloat(amount),
      description: description || '',
      items: items || [],
      dueDate: dueDate || null,
      status: 'draft',
      invoiceNumber: await generateInvoiceNumber(uid),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, invoiceId: invoiceRef.id };
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw new HttpsError('internal', 'Failed to create invoice');
  }
});

/**
 * Get a single invoice by ID
 */
export const getInvoice = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { invoiceId } = request.data;
  const { uid } = request.auth;

  if (!invoiceId) {
    throw new HttpsError('invalid-argument', 'Invoice ID is required');
  }

  try {
    const invoiceDoc = await db.collection('invoices').doc(invoiceId).get();

    if (!invoiceDoc.exists) {
      throw new HttpsError('not-found', 'Invoice not found');
    }

    const invoice = invoiceDoc.data();
    if (invoice?.userId !== uid) {
      throw new HttpsError('permission-denied', 'Access denied');
    }

    return { ...invoice, id: invoiceDoc.id };
  } catch (error) {
    console.error('Error getting invoice:', error);
    throw new HttpsError('internal', 'Failed to get invoice');
  }
});

/**
 * Update an invoice
 */
export const updateInvoice = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { invoiceId, ...updateData } = request.data;
  const { uid } = request.auth;

  if (!invoiceId) {
    throw new HttpsError('invalid-argument', 'Invoice ID is required');
  }

  try {
    const invoiceRef = db.collection('invoices').doc(invoiceId);
    const invoiceDoc = await invoiceRef.get();

    if (!invoiceDoc.exists) {
      throw new HttpsError('not-found', 'Invoice not found');
    }

    const invoice = invoiceDoc.data();
    if (invoice?.userId !== uid) {
      throw new HttpsError('permission-denied', 'Access denied');
    }

    await invoiceRef.update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw new HttpsError('internal', 'Failed to update invoice');
  }
});

/**
 * Delete an invoice
 */
export const deleteInvoice = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { invoiceId } = request.data;
  const { uid } = request.auth;

  if (!invoiceId) {
    throw new HttpsError('invalid-argument', 'Invoice ID is required');
  }

  try {
    const invoiceRef = db.collection('invoices').doc(invoiceId);
    const invoiceDoc = await invoiceRef.get();

    if (!invoiceDoc.exists) {
      throw new HttpsError('not-found', 'Invoice not found');
    }

    const invoice = invoiceDoc.data();
    if (invoice?.userId !== uid) {
      throw new HttpsError('permission-denied', 'Access denied');
    }

    await invoiceRef.delete();

    return { success: true };
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw new HttpsError('internal', 'Failed to delete invoice');
  }
});

/**
 * List all invoices for a user
 */
export const listInvoices = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { uid } = request.auth;
  const { limit = 50, startAfter } = request.data;

  try {
    let query = db.collection('invoices')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (startAfter) {
      const startDoc = await db.collection('invoices').doc(startAfter).get();
      query = query.startAfter(startDoc);
    }

    const snapshot = await query.get();
    const invoices = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { invoices };
  } catch (error) {
    console.error('Error listing invoices:', error);
    throw new HttpsError('internal', 'Failed to list invoices');
  }
});

/**
 * Get invoices by user (alternative method)
 */
export const getInvoicesByUser = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { uid } = request.auth;

  try {
    const snapshot = await db.collection('invoices')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();

    const invoices = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { invoices };
  } catch (error) {
    console.error('Error getting invoices by user:', error);
    throw new HttpsError('internal', 'Failed to get invoices');
  }
});

/**
 * Generate a unique invoice number
 */
async function generateInvoiceNumber(userId: string): Promise<string> {
  const year = new Date().getFullYear();
  const snapshot = await db.collection('invoices')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get();

  const lastNumber = snapshot.empty ? 0 : parseInt(snapshot.docs[0].data().invoiceNumber?.split('-').pop() || '0');
  const newNumber = lastNumber + 1;

  return `INV-${year}-${String(newNumber).padStart(4, '0')}`;
}

export const invoiceFunctions = {
  createInvoice,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  listInvoices,
  getInvoicesByUser,
};
