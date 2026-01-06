# BuildBills Testing Guide

This guide will walk you through testing the BuildBills application, including the mobile app, Firebase backend, and website.

## 🎯 Overview

BuildBills is a comprehensive invoice and expense management platform consisting of:
- **Mobile App**: React Native app for iOS and Android
- **Firebase Backend**: Cloud Functions, Firestore, and Storage
- **Website**: Static marketing website
- **Shared Packages**: TypeScript types, utilities, and API client

## ✅ Prerequisites

Before you start testing, ensure you have:

### Required Software
- **Node.js**: v18 or higher (currently using v20.19.6) ✅
- **npm**: v9 or higher (currently using v10.8.2) ✅
- **Firebase CLI**: Install with `npm install -g firebase-tools`
- **React Native CLI**: For mobile testing

### For Mobile Testing
- **iOS Development**: Xcode (Mac only)
- **Android Development**: Android Studio
- **iOS Simulator** or **Android Emulator**

### Firebase Account
- Create a Firebase project at https://console.firebase.google.com
- Enable the following services:
  - Authentication (Email/Password)
  - Firestore Database
  - Cloud Storage
  - Cloud Functions

## 🚀 Setup Steps

### 1. Install Dependencies

All dependencies are already installed! The project includes:

```bash
# Root dependencies ✅ DONE
# Mobile dependencies ✅ DONE
# Firebase functions dependencies ✅ DONE
# All shared packages dependencies ✅ DONE
```

### 2. Configure Firebase

You need to set up Firebase configuration:

#### a. Login to Firebase
```bash
firebase login
```

#### b. Initialize Firebase (if not already done)
```bash
firebase use --add
# Select your Firebase project
# Enter an alias (e.g., "default")
```

#### c. Set up Firebase Configuration Files

**For Mobile App:**
Create these files with your Firebase project configuration:

`apps/mobile/google-services.json` (Android):
```json
{
  "project_info": {
    "project_number": "YOUR_PROJECT_NUMBER",
    "project_id": "YOUR_PROJECT_ID"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "YOUR_APP_ID",
        "android_client_info": {
          "package_name": "com.buildbills"
        }
      },
      "oauth_client": [],
      "api_key": [
        {
          "current_key": "YOUR_API_KEY"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": []
        }
      }
    }
  ],
  "configuration_version": "1"
}
```

`apps/mobile/ios/BuildBills/GoogleService-Info.plist` (iOS):
Download from Firebase Console → Project Settings → Your iOS App

#### d. Set up Service Account for Cloud Functions

For Google Cloud Vision API and other services:
1. Go to Google Cloud Console
2. Create a service account
3. Download the JSON key file
4. Set environment variable:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
```

## 🧪 Testing Components

### 1. Firebase Functions Testing

#### Build Functions
```bash
cd packages/firebase-functions
npm run build
```

**Status**: ✅ Compiles successfully with 0 errors

#### Lint Functions
```bash
npm run lint
```

**Status**: ✅ Passes with 0 errors (19 warnings about `any` types - acceptable)

#### Run Firebase Emulators
```bash
npm run emulator
```

This starts local emulators for:
- **Firestore**: http://localhost:8080
- **Functions**: http://localhost:5001
- **Auth**: http://localhost:9099
- **Storage**: http://localhost:9199
- **Emulator UI**: http://localhost:4000

#### Test Functions Manually

Once emulators are running, you can test functions using curl or Postman:

**Health Check:**
```bash
curl http://localhost:5001/buildbills-project/us-central1/healthCheck
```

**Create Invoice (requires auth):**
```bash
curl -X POST \
  http://localhost:5001/buildbills-project/us-central1/createInvoice \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TEST_TOKEN' \
  -d '{
    "data": {
      "clientName": "Test Client",
      "amount": 100,
      "description": "Test invoice"
    }
  }'
```

### 2. Mobile App Testing

#### Start Metro Bundler
```bash
cd apps/mobile
npm start
```

This starts the React Native development server.

#### Run on iOS Simulator (Mac only)
```bash
# First time: Install iOS dependencies
cd ios && pod install && cd ..

# Run the app
npm run ios
```

#### Run on Android Emulator
```bash
# Make sure Android emulator is running first
npm run android
```

#### Lint Mobile App
```bash
npm run lint
```

**Status**: ✅ Passes with 0 errors

### 3. Testing Features

#### Authentication Flow
1. **Launch the app** - You should see the Login screen
2. **Test Registration**: 
   - Tap "Sign Up"
   - Enter email and password
   - Submit (currently shows TODO alert)
3. **Test Login**:
   - Enter email and password
   - Submit (currently shows TODO alert)
4. **Test Forgot Password**:
   - Tap "Forgot Password"
   - Enter email
   - Submit (currently shows TODO alert)

**Note**: Firebase Authentication needs to be properly integrated. Currently shows placeholder alerts.

#### Dashboard
Once logged in (you'll need to modify `isAuthenticated` in `AppNavigator.tsx` temporarily to test):
- View statistics (Invoices, Revenue, Expenses, Total Cost)
- Access quick actions:
  - Create Invoice
  - Add Expense
  - Scan Receipt
- View recent activity

#### Invoices
1. Navigate to **Invoices** tab
2. **Create Invoice**:
   - Tap "Create Invoice" button
   - Fill in:
     - Client Name
     - Amount
     - Description (optional)
     - Due Date (optional)
   - Submit
3. **View Invoices**: List of all your invoices
4. **Search/Filter**: Test the search functionality

#### Expenses
1. Navigate to **Expenses** tab
2. **Add Expense**:
   - Tap "Add Expense" button
   - Fill in:
     - Category
     - Amount
     - Description
     - Date
   - Optionally attach receipt
   - Submit
3. **View Expenses**: List of all expenses
4. **Filter by Category**: Test category filtering

#### Settings
1. Navigate to **Settings** tab
2. Test:
   - Account information display
   - Email integration setup
   - Notification preferences
   - Currency settings
   - Logout functionality

### 4. Firebase Functions Testing

#### Available Functions

**Authentication Functions:**
- `createUser`: Create user profile
- `deleteUser`: Delete user and all data
- `onUserCreated`: Auto-create profile on signup

**Invoice Functions:**
- `createInvoice`: Create new invoice
- `getInvoice`: Get invoice by ID
- `updateInvoice`: Update invoice
- `deleteInvoice`: Delete invoice
- `listInvoices`: List user's invoices
- `getInvoicesByUser`: Alternative invoice listing

**Expense Functions:**
- `createExpense`: Create new expense
- `getExpense`: Get expense by ID
- `updateExpense`: Update expense
- `deleteExpense`: Delete expense
- `listExpenses`: List user's expenses
- `getExpensesByUser`: Alternative expense listing

**Vision AI Functions:**
- `analyzeInvoice`: Extract data from invoice image
- `analyzeReceipt`: Extract data from receipt image
- `processUploadedImage`: Auto-process uploaded images

**Email Integration Functions:**
- `connectGmail`: Connect Gmail account
- `connectOutlook`: Connect Outlook account
- `syncEmails`: Sync emails and extract invoices/receipts
- `extractInvoicesFromEmail`: Extract invoice data from email

## 📱 Manual Testing Scenarios

### Scenario 1: Create and Manage Invoice
1. Start mobile app
2. Login/Register
3. Navigate to Dashboard
4. Tap "Create Invoice"
5. Fill in invoice details
6. Save invoice
7. Verify invoice appears in Invoices list
8. Edit invoice
9. Delete invoice

### Scenario 2: Expense with Receipt
1. Navigate to Expenses
2. Tap "Add Expense"
3. Fill in expense details
4. Tap "Attach Receipt"
5. Take photo or select from gallery
6. Save expense
7. Verify expense appears in list with receipt thumbnail

### Scenario 3: Invoice Data Extraction
1. Create invoice with image
2. Upload invoice image
3. Wait for Vision AI processing
4. Verify extracted data appears correctly

### Scenario 4: Email Integration
1. Go to Settings
2. Tap "Connect Email"
3. Select Gmail or Outlook
4. Complete OAuth flow
5. Return to app
6. Tap "Sync Emails"
7. Verify invoices/receipts extracted from emails

## 🔍 Verification Checklist

### Code Quality ✅
- [x] Firebase Functions TypeScript compilation: **SUCCESS**
- [x] Firebase Functions linting: **PASSED** (0 errors, 19 warnings)
- [x] Mobile App linting: **PASSED** (0 errors)
- [x] Dependencies installed: **COMPLETE**
- [x] Build artifacts excluded from git

### Functionality Testing ⏳
- [ ] Mobile app launches successfully
- [ ] Authentication flow works
- [ ] Dashboard displays correctly
- [ ] Invoice creation works
- [ ] Expense creation works
- [ ] Image upload works
- [ ] Firebase functions respond correctly
- [ ] Firestore data persists
- [ ] Storage uploads work
- [ ] Vision AI extracts data correctly

## 🐛 Known Issues

1. **Mobile App Tests**: Native module mocking needs to be configured for Jest tests
2. **Firebase Functions Tests**: Need to be updated for v2 API compatibility
3. **Authentication**: Firebase Auth integration needs to be connected to the mobile app
4. **Email Integration**: OAuth credentials need to be configured

## 💡 Testing Tips

### Quick Tests Without Mobile Setup

If you don't have mobile development environment set up, you can still test:

1. **Firebase Functions**:
   ```bash
   cd packages/firebase-functions
   npm run emulator
   # Then test via HTTP requests
   ```

2. **Website**:
   ```bash
   cd packages/website
   npx http-server . -p 8080
   # Open http://localhost:8080
   ```

### Debugging

**Mobile App Debugging:**
- Enable "Debug JS Remotely" in dev menu (Cmd+D on iOS, Cmd+M on Android)
- Use React DevTools
- Check Metro bundler console for errors

**Firebase Functions Debugging:**
- Check emulator logs in terminal
- Use Firebase Emulator UI at http://localhost:4000
- Add console.log statements in functions

**Network Debugging:**
- Use React Native Debugger
- Check Network tab for API calls
- Verify Firebase URLs are correct

## 📊 Performance Testing

### Load Testing Functions
```bash
# Install Apache Bench
# Test health check endpoint
ab -n 1000 -c 10 http://localhost:5001/buildbills-project/us-central1/healthCheck
```

### Mobile App Performance
- Use React Native Performance Monitor (Cmd+D → Show Perf Monitor)
- Check frame rates (should be 60fps)
- Monitor memory usage
- Test on lower-end devices

## 🚀 Deployment Testing

### Deploy Functions to Firebase
```bash
cd packages/firebase-functions
npm run deploy
```

### Test Production Functions
Replace `localhost:5001` with your production URL:
```bash
curl https://us-central1-YOUR-PROJECT.cloudfunctions.net/healthCheck
```

### Mobile App Release Testing
1. Build release version
2. Test on actual devices
3. Verify all features work without dev mode
4. Check crash reporting

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review error messages carefully
3. Check Firebase Console for backend issues
4. Review Metro bundler logs for mobile issues
5. Consult React Native and Firebase documentation

## 🎉 Success Criteria

Your testing is successful when:
- ✅ All linters pass
- ✅ Firebase functions build successfully
- ✅ Mobile app launches without crashes
- ✅ Users can register and login
- ✅ Invoices can be created, viewed, edited, and deleted
- ✅ Expenses can be created, viewed, edited, and deleted
- ✅ Images can be uploaded and processed
- ✅ Data persists correctly in Firestore
- ✅ All screens are accessible and functional

---

**Last Updated**: January 6, 2026
**Version**: 1.0.0
**Status**: ✅ System ready for testing
