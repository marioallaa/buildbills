import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * Connect Gmail account using OAuth
 */
export const connectGmail = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { uid } = request.auth;
  const { accessToken, refreshToken } = request.data;

  if (!accessToken || !refreshToken) {
    throw new HttpsError('invalid-argument', 'Access token and refresh token are required');
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
  } catch (error) {
    console.error('Error connecting Gmail:', error);
    throw new HttpsError('internal', 'Failed to connect Gmail');
  }
});

/**
 * Connect Outlook account using OAuth
 */
export const connectOutlook = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { uid } = request.auth;
  const { accessToken, refreshToken } = request.data;

  if (!accessToken || !refreshToken) {
    throw new HttpsError('invalid-argument', 'Access token and refresh token are required');
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
  } catch (error) {
    console.error('Error connecting Outlook:', error);
    throw new HttpsError('internal', 'Failed to connect Outlook');
  }
});

/**
 * Sync emails and extract invoices/receipts
 */
export const syncEmails = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { uid } = request.auth;

  try {
    // Get email connection
    const connectionDoc = await db.collection('emailConnections').doc(uid).get();

    if (!connectionDoc.exists) {
      throw new HttpsError('not-found', 'No email connection found');
    }

    const connection = connectionDoc.data();
    const { provider, accessToken, refreshToken } = connection!;

    let emails: any[] = [];

    if (provider === 'gmail') {
      emails = await fetchGmailMessages(accessToken, refreshToken);
    } else if (provider === 'outlook') {
      emails = await fetchOutlookMessages(accessToken, refreshToken);
    }

    // Process emails and extract invoices/receipts
    const extractedDocuments = await processEmails(emails, uid);

    return {
      success: true,
      emailsScanned: emails.length,
      documentsExtracted: extractedDocuments.length,
    };
  } catch (error) {
    console.error('Error syncing emails:', error);
    throw new HttpsError('internal', 'Failed to sync emails');
  }
});

/**
 * Extract invoices from email attachments
 */
export const extractInvoicesFromEmail = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { uid } = request.auth;
  const { emailId } = request.data;

  if (!emailId) {
    throw new HttpsError('invalid-argument', 'Email ID is required');
  }

  try {
    // Get email connection
    const connectionDoc = await db.collection('emailConnections').doc(uid).get();

    if (!connectionDoc.exists) {
      throw new HttpsError('not-found', 'No email connection found');
    }

    const connection = connectionDoc.data();
    const { provider, accessToken, refreshToken } = connection!;

    let attachments: any[] = [];

    if (provider === 'gmail') {
      attachments = await fetchGmailAttachments(emailId, accessToken, refreshToken);
    } else if (provider === 'outlook') {
      attachments = await fetchOutlookAttachments(emailId, accessToken, refreshToken);
    }

    // Process attachments
    const extractedDocuments = [];
    for (const attachment of attachments) {
      if (attachment.contentType?.includes('pdf') || attachment.contentType?.includes('image')) {
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
  } catch (error) {
    console.error('Error extracting invoices from email:', error);
    throw new HttpsError('internal', 'Failed to extract invoices');
  }
});

/**
 * Fetch Gmail messages
 */
async function fetchGmailMessages(accessToken: string, refreshToken: string): Promise<any[]> {
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
async function fetchOutlookMessages(accessToken: string, refreshToken: string): Promise<any[]> {
  // TODO: Implement Microsoft Graph API integration
  console.log('Fetching Outlook messages with token:', accessToken);
  return [];
}

/**
 * Fetch Gmail attachments
 */
async function fetchGmailAttachments(emailId: string, accessToken: string, refreshToken: string): Promise<any[]> {
  // TODO: Implement Gmail attachment fetching
  console.log('Fetching Gmail attachments for email:', emailId);
  return [];
}

/**
 * Fetch Outlook attachments
 */
async function fetchOutlookAttachments(emailId: string, accessToken: string, refreshToken: string): Promise<any[]> {
  // TODO: Implement Outlook attachment fetching
  console.log('Fetching Outlook attachments for email:', emailId);
  return [];
}

/**
 * Process emails and extract invoices/receipts
 */
async function processEmails(emails: any[], userId: string): Promise<any[]> {
  // TODO: Implement email processing logic
  console.log(`Processing ${emails.length} emails for user ${userId}`);
  return [];
}

export const emailFunctions = {
  connectGmail,
  connectOutlook,
  syncEmails,
  extractInvoicesFromEmail,
};
