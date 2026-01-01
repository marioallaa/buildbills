import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * Create a new user profile in Firestore
 */
export const createUser = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { uid } = context.auth;
  const { displayName, email } = data;

  try {
    await db.collection('users').doc(uid).set({
      displayName,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, uid };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create user profile');
  }
});

/**
 * Delete a user and their data
 */
export const deleteUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { uid } = context.auth;

  try {
    // Delete user's invoices
    const invoicesSnapshot = await db.collection('invoices').where('userId', '==', uid).get();
    const batch = db.batch();
    invoicesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete user's expenses
    const expensesSnapshot = await db.collection('expenses').where('userId', '==', uid).get();
    expensesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete user profile
    batch.delete(db.collection('users').doc(uid));

    await batch.commit();

    // Delete auth user
    await admin.auth().deleteUser(uid);

    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new functions.https.HttpsError('internal', 'Failed to delete user');
  }
});

/**
 * Trigger when a new user is created in Firebase Auth
 */
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName } = user;

  try {
    await db.collection('users').doc(uid).set({
      email,
      displayName: displayName || email?.split('@')[0] || 'User',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      settings: {
        currency: 'USD',
        notifications: true,
      },
    });

    console.log(`User profile created for ${uid}`);
  } catch (error) {
    console.error('Error creating user profile on auth creation:', error);
  }
});

export const authFunctions = {
  createUser,
  deleteUser,
  onUserCreated,
};
