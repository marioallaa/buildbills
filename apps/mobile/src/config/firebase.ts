/**
 * Firebase Configuration
 * 
 * IMPORTANT: Replace these placeholder values with your actual Firebase config
 * 
 * To get your Firebase configuration:
 * 1. Go to Firebase Console (https://console.firebase.google.com/)
 * 2. Select your project
 * 3. Go to Project Settings (gear icon)
 * 4. Scroll down to "Your apps" section
 * 5. Select your app or create a new one
 * 6. Copy the configuration object
 */

export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  // Optional: Add measurementId if using Firebase Analytics
  // measurementId: 'YOUR_MEASUREMENT_ID',
};

/**
 * Firebase Functions Configuration
 * Update this if your Firebase functions are deployed to a different region
 */
export const functionsRegion = 'us-central1';

/**
 * Firebase Storage Configuration
 */
export const storageConfig = {
  // Maximum file size for uploads (in bytes)
  maxFileSize: 10 * 1024 * 1024, // 10MB
  
  // Allowed image types for receipts
  allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
};
