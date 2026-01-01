# BuildBills Mobile App Setup Guide

This guide will help you set up and run the BuildBills mobile application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.0.0
- **npm** >= 9.0.0
- **React Native development environment**:
  - For iOS: Xcode (Mac only)
  - For Android: Android Studio and Android SDK
- **Firebase project** with:
  - Authentication enabled (Email/Password provider)
  - Firestore database created
  - Cloud Storage enabled
  - Cloud Functions deployed (from `packages/firebase-functions`)

## Installation Steps

### 1. Install Dependencies

From the root of the monorepo:

```bash
npm install
```

Then, install mobile app dependencies:

```bash
cd apps/mobile
npm install
```

For iOS, also install CocoaPods:

```bash
cd ios
pod install
cd ..
```

### 2. Configure Firebase

#### Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon (⚙️) next to "Project Overview" → "Project settings"
4. Scroll down to "Your apps" section
5. If you haven't added an app yet, click "Add app" and select iOS or Android
6. Copy the Firebase configuration object

#### Update Firebase Config File

Open `apps/mobile/src/config/firebase.ts` and replace the placeholder values:

```typescript
export const firebaseConfig = {
  apiKey: 'YOUR_ACTUAL_API_KEY',
  authDomain: 'your-project-id.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project-id.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
```

### 3. Configure Firebase for iOS (iOS only)

1. Download `GoogleService-Info.plist` from Firebase Console
2. Add it to `apps/mobile/ios/BuildBills/` directory
3. Open the project in Xcode and add the file to your target

### 4. Configure Firebase for Android

1. Download `google-services.json` from Firebase Console
2. Place it in `apps/mobile/android/app/` directory

### 5. Set Up Firebase Services

#### Enable Firebase Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get Started"
3. Enable "Email/Password" sign-in method

#### Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database

#### Set Up Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Invoices collection
    match /invoices/{invoiceId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null &&
        request.resource.data.userId == request.auth.uid;
    }
    
    // Expenses collection
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null &&
        request.resource.data.userId == request.auth.uid;
    }
  }
}
```

#### Enable Cloud Storage

1. In Firebase Console, go to "Storage"
2. Click "Get Started"
3. Set up security rules for user-specific storage

#### Deploy Firebase Functions

From the root of the monorepo:

```bash
cd packages/firebase-functions
npm install
npm run deploy
```

Or from root:

```bash
npm run firebase:deploy
```

## Running the App

### Start Metro Bundler

```bash
cd apps/mobile
npm start
```

Or from root:

```bash
npm run mobile
```

### Run on iOS

```bash
npm run ios
```

Or from root:

```bash
npm run mobile:ios
```

### Run on Android

```bash
npm run android
```

Or from root:

```bash
npm run mobile:android
```

## Features Implemented

### ✅ Authentication
- Email/password registration
- Email/password login
- Password reset via email
- Automatic session persistence
- Logout functionality

### ✅ Invoice Management
- Create invoices with client information and amounts
- View all invoices in real-time
- See invoice status (draft, sent, paid, overdue, cancelled)
- Pull-to-refresh to update invoice list
- Form validation for all fields

### ✅ Expense Tracking
- Create expenses with vendor, category, and amount
- 14 bookkeeping categories for proper expense categorization
- Tax-deductible expense tracking
- View all expenses in real-time
- Receipt attachment support (UI ready, camera coming soon)
- Pull-to-refresh to update expense list

### ✅ Dashboard
- Real-time financial summary:
  - Total invoiced amount
  - Total revenue (paid invoices)
  - Outstanding balance
  - Total expenses
  - Profit/Loss calculation
- Quick stats:
  - Pending invoices count
  - Overdue invoices count
- Recent activity feed (last 5 transactions)
- Quick action buttons for common tasks

### ✅ Settings
- User profile information display
- Logout functionality
- App version information
- Placeholder for future settings (currency, notifications, theme)

## Project Structure

```
apps/mobile/src/
├── components/           # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Loading.tsx
│   ├── EmptyState.tsx
│   ├── AmountDisplay.tsx
│   └── StatusBadge.tsx
├── config/              # Firebase configuration
│   └── firebase.ts
├── constants/           # App constants
│   └── index.ts
├── contexts/            # React contexts
│   ├── AuthContext.tsx
│   └── DataContext.tsx
├── hooks/               # Custom hooks
│   ├── useAuth.ts
│   └── useData.ts
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx
├── screens/             # App screens
│   ├── auth/            # Authentication screens
│   ├── dashboard/       # Dashboard screen
│   ├── invoices/        # Invoice screens
│   ├── expenses/        # Expense screens
│   └── settings/        # Settings screen
├── services/            # API and service layers
│   ├── api.ts
│   ├── auth.ts
│   └── storage.ts
├── theme/               # Theme system
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── index.ts
└── utils/               # Utility functions
    ├── formatters.ts
    └── validators.ts
```

## Troubleshooting

### Metro Bundler Issues

If Metro bundler fails to start:

```bash
npm start -- --reset-cache
```

### iOS Build Issues

1. Clean build folder in Xcode: Product → Clean Build Folder
2. Delete derived data
3. Re-install pods:

```bash
cd ios
pod deinstall
pod install
```

### Android Build Issues

1. Clean gradle:

```bash
cd android
./gradlew clean
```

2. Ensure Android SDK is properly configured
3. Check that `google-services.json` is in the correct location

### Firebase Connection Issues

1. Verify your Firebase configuration in `apps/mobile/src/config/firebase.ts`
2. Ensure Firebase services are enabled in your Firebase Console
3. Check that you're using the correct Firebase project
4. Verify Firestore security rules allow your operations

## Known Limitations

- **Receipt Scanning**: Camera integration is marked as "Coming Soon" - UI placeholders are in place
- **Invoice Detail View**: Not yet implemented - users can view invoices in the list
- **Expense Detail View**: Not yet implemented - users can view expenses in the list
- **PDF Export**: Not yet implemented
- **Payment Method Selection**: Basic implementation, needs enhancement
- **Date Picker**: Using default date (current date) for now

## Next Steps for Production

1. **Implement Receipt Scanning**:
   - Add camera permission handling
   - Integrate `react-native-vision-camera`
   - Connect to Firebase Vision AI functions

2. **Add Detail Screens**:
   - InvoiceDetailScreen for viewing/editing individual invoices
   - ExpenseDetailScreen for viewing/editing individual expenses

3. **Enhance Forms**:
   - Add date picker components
   - Add payment method selector
   - Add invoice line items support

4. **Testing**:
   - Add unit tests for services
   - Add integration tests for contexts
   - Add E2E tests for critical flows

5. **Polish**:
   - Add animations and transitions
   - Improve error messages
   - Add offline support
   - Implement proper loading states

## Support

For issues or questions:
1. Check the main README.md in the repository root
2. Review Firebase documentation for setup issues
3. Check React Native documentation for platform-specific issues

## License

MIT
