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
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailFunctions = exports.extractInvoicesFromEmail = exports.syncEmails = exports.connectOutlook = exports.connectGmail = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
/**
 * Connect Gmail account using OAuth
 */
exports.connectGmail = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { uid } = request.auth;
    const { accessToken, refreshToken } = request.data;
    if (!accessToken || !refreshToken) {
        throw new https_1.HttpsError('invalid-argument', 'Access token and refresh token are required');
    }
    try {
        // Store email connection details
        await db.collection('emailConnections').doc(uid).set({
            provider: 'gmail',
            accessToken,
            refreshToken,
            connectedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        return { success: true, provider: 'gmail' };
    }
    catch (error) {
        console.error('Error connecting Gmail:', error);
        throw new https_1.HttpsError('internal', 'Failed to connect Gmail');
    }
});
/**
 * Connect Outlook account using OAuth
 */
exports.connectOutlook = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { uid } = request.auth;
    const { accessToken, refreshToken } = request.data;
    if (!accessToken || !refreshToken) {
        throw new https_1.HttpsError('invalid-argument', 'Access token and refresh token are required');
    }
    try {
        await db.collection('emailConnections').doc(uid).set({
            provider: 'outlook',
            accessToken,
            refreshToken,
            connectedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        return { success: true, provider: 'outlook' };
    }
    catch (error) {
        console.error('Error connecting Outlook:', error);
        throw new https_1.HttpsError('internal', 'Failed to connect Outlook');
    }
});
/**
 * Sync emails and extract invoices/receipts
 */
exports.syncEmails = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { uid } = request.auth;
    try {
        // Get email connection
        const connectionDoc = await db.collection('emailConnections').doc(uid).get();
        if (!connectionDoc.exists) {
            throw new https_1.HttpsError('not-found', 'No email connection found');
        }
        const connection = connectionDoc.data();
        const { provider, accessToken, refreshToken } = connection;
        let emails = [];
        if (provider === 'gmail') {
            emails = await fetchGmailMessages(accessToken, refreshToken);
        }
        else if (provider === 'outlook') {
            emails = await fetchOutlookMessages(accessToken, refreshToken);
        }
        // Process emails and extract invoices/receipts
        const extractedDocuments = await processEmails(emails, uid);
        return {
            success: true,
            emailsScanned: emails.length,
            documentsExtracted: extractedDocuments.length,
        };
    }
    catch (error) {
        console.error('Error syncing emails:', error);
        throw new https_1.HttpsError('internal', 'Failed to sync emails');
    }
});
/**
 * Extract invoices from email attachments
 */
exports.extractInvoicesFromEmail = (0, https_1.onCall)(async (request) => {
    var _a, _b;
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { uid } = request.auth;
    const { emailId } = request.data;
    if (!emailId) {
        throw new https_1.HttpsError('invalid-argument', 'Email ID is required');
    }
    try {
        // Get email connection
        const connectionDoc = await db.collection('emailConnections').doc(uid).get();
        if (!connectionDoc.exists) {
            throw new https_1.HttpsError('not-found', 'No email connection found');
        }
        const connection = connectionDoc.data();
        const { provider, accessToken, refreshToken } = connection;
        let attachments = [];
        if (provider === 'gmail') {
            attachments = await fetchGmailAttachments(emailId, accessToken, refreshToken);
        }
        else if (provider === 'outlook') {
            attachments = await fetchOutlookAttachments(emailId, accessToken, refreshToken);
        }
        // Process attachments
        const extractedDocuments = [];
        for (const attachment of attachments) {
            if (((_a = attachment.contentType) === null || _a === void 0 ? void 0 : _a.includes('pdf')) || ((_b = attachment.contentType) === null || _b === void 0 ? void 0 : _b.includes('image'))) {
                // TODO: Process PDF or image attachment
                extractedDocuments.push({
                    name: attachment.filename,
                    type: attachment.contentType,
                });
            }
        }
        return {
            success: true,
            attachments: extractedDocuments,
        };
    }
    catch (error) {
        console.error('Error extracting invoices from email:', error);
        throw new https_1.HttpsError('internal', 'Failed to extract invoices');
    }
});
/**
 * Fetch Gmail messages
 */
async function fetchGmailMessages(accessToken, refreshToken) {
    // TODO: Implement Gmail API integration
    // This is a placeholder implementation
    console.log('Fetching Gmail messages with token:', accessToken);
    // Example implementation:
    // const oauth2Client = new google.auth.OAuth2();
    // oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
    // const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    // const response = await gmail.users.messages.list({ userId: 'me', q: 'has:attachment' });
    return [];
}
/**
 * Fetch Outlook messages
 */
async function fetchOutlookMessages(accessToken, refreshToken) {
    // TODO: Implement Microsoft Graph API integration
    console.log('Fetching Outlook messages with token:', accessToken);
    return [];
}
/**
 * Fetch Gmail attachments
 */
async function fetchGmailAttachments(emailId, accessToken, refreshToken) {
    // TODO: Implement Gmail attachment fetching
    console.log('Fetching Gmail attachments for email:', emailId);
    return [];
}
/**
 * Fetch Outlook attachments
 */
async function fetchOutlookAttachments(emailId, accessToken, refreshToken) {
    // TODO: Implement Outlook attachment fetching
    console.log('Fetching Outlook attachments for email:', emailId);
    return [];
}
/**
 * Process emails and extract invoices/receipts
 */
async function processEmails(emails, userId) {
    // TODO: Implement email processing logic
    console.log(`Processing ${emails.length} emails for user ${userId}`);
    return [];
}
exports.emailFunctions = {
    connectGmail: exports.connectGmail,
    connectOutlook: exports.connectOutlook,
    syncEmails: exports.syncEmails,
    extractInvoicesFromEmail: exports.extractInvoicesFromEmail,
};
//# sourceMappingURL=email.js.map