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
exports.invoiceFunctions = exports.getInvoicesByUser = exports.listInvoices = exports.deleteInvoice = exports.updateInvoice = exports.getInvoice = exports.createInvoice = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
/**
 * Create a new invoice
 */
exports.createInvoice = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { uid } = request.auth;
    const { clientName, clientEmail, amount, description, items, dueDate } = request.data;
    if (!clientName || !amount) {
        throw new https_1.HttpsError('invalid-argument', 'Missing required fields');
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
    }
    catch (error) {
        console.error('Error creating invoice:', error);
        throw new https_1.HttpsError('internal', 'Failed to create invoice');
    }
});
/**
 * Get a single invoice by ID
 */
exports.getInvoice = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { invoiceId } = request.data;
    const { uid } = request.auth;
    if (!invoiceId) {
        throw new https_1.HttpsError('invalid-argument', 'Invoice ID is required');
    }
    try {
        const invoiceDoc = await db.collection('invoices').doc(invoiceId).get();
        if (!invoiceDoc.exists) {
            throw new https_1.HttpsError('not-found', 'Invoice not found');
        }
        const invoice = invoiceDoc.data();
        if ((invoice === null || invoice === void 0 ? void 0 : invoice.userId) !== uid) {
            throw new https_1.HttpsError('permission-denied', 'Access denied');
        }
        return Object.assign(Object.assign({}, invoice), { id: invoiceDoc.id });
    }
    catch (error) {
        console.error('Error getting invoice:', error);
        throw new https_1.HttpsError('internal', 'Failed to get invoice');
    }
});
/**
 * Update an invoice
 */
exports.updateInvoice = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const _a = request.data, { invoiceId } = _a, updateData = __rest(_a, ["invoiceId"]);
    const { uid } = request.auth;
    if (!invoiceId) {
        throw new https_1.HttpsError('invalid-argument', 'Invoice ID is required');
    }
    try {
        const invoiceRef = db.collection('invoices').doc(invoiceId);
        const invoiceDoc = await invoiceRef.get();
        if (!invoiceDoc.exists) {
            throw new https_1.HttpsError('not-found', 'Invoice not found');
        }
        const invoice = invoiceDoc.data();
        if ((invoice === null || invoice === void 0 ? void 0 : invoice.userId) !== uid) {
            throw new https_1.HttpsError('permission-denied', 'Access denied');
        }
        await invoiceRef.update(Object.assign(Object.assign({}, updateData), { updatedAt: admin.firestore.FieldValue.serverTimestamp() }));
        return { success: true };
    }
    catch (error) {
        console.error('Error updating invoice:', error);
        throw new https_1.HttpsError('internal', 'Failed to update invoice');
    }
});
/**
 * Delete an invoice
 */
exports.deleteInvoice = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { invoiceId } = request.data;
    const { uid } = request.auth;
    if (!invoiceId) {
        throw new https_1.HttpsError('invalid-argument', 'Invoice ID is required');
    }
    try {
        const invoiceRef = db.collection('invoices').doc(invoiceId);
        const invoiceDoc = await invoiceRef.get();
        if (!invoiceDoc.exists) {
            throw new https_1.HttpsError('not-found', 'Invoice not found');
        }
        const invoice = invoiceDoc.data();
        if ((invoice === null || invoice === void 0 ? void 0 : invoice.userId) !== uid) {
            throw new https_1.HttpsError('permission-denied', 'Access denied');
        }
        await invoiceRef.delete();
        return { success: true };
    }
    catch (error) {
        console.error('Error deleting invoice:', error);
        throw new https_1.HttpsError('internal', 'Failed to delete invoice');
    }
});
/**
 * List all invoices for a user
 */
exports.listInvoices = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
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
        const invoices = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        return { invoices };
    }
    catch (error) {
        console.error('Error listing invoices:', error);
        throw new https_1.HttpsError('internal', 'Failed to list invoices');
    }
});
/**
 * Get invoices by user (alternative method)
 */
exports.getInvoicesByUser = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { uid } = request.auth;
    try {
        const snapshot = await db.collection('invoices')
            .where('userId', '==', uid)
            .orderBy('createdAt', 'desc')
            .get();
        const invoices = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        return { invoices };
    }
    catch (error) {
        console.error('Error getting invoices by user:', error);
        throw new https_1.HttpsError('internal', 'Failed to get invoices');
    }
});
/**
 * Generate a unique invoice number
 */
async function generateInvoiceNumber(userId) {
    var _a;
    const year = new Date().getFullYear();
    const snapshot = await db.collection('invoices')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();
    const lastNumber = snapshot.empty ? 0 : parseInt(((_a = snapshot.docs[0].data().invoiceNumber) === null || _a === void 0 ? void 0 : _a.split('-').pop()) || '0');
    const newNumber = lastNumber + 1;
    return `INV-${year}-${String(newNumber).padStart(4, '0')}`;
}
exports.invoiceFunctions = {
    createInvoice: exports.createInvoice,
    getInvoice: exports.getInvoice,
    updateInvoice: exports.updateInvoice,
    deleteInvoice: exports.deleteInvoice,
    listInvoices: exports.listInvoices,
    getInvoicesByUser: exports.getInvoicesByUser,
};
//# sourceMappingURL=invoices.js.map