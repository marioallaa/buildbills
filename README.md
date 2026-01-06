# BuildBills 🧾

> Modern mobile-first invoice and expense management platform for contractors and small businesses

BuildBills is a comprehensive monorepo that includes a React Native mobile app, Firebase backend, and marketing website for managing invoices, tracking expenses, and automating document processing with AI.

## 🏗️ Project Structure

```
buildbills/
├── apps/
│   └── mobile/              # React Native mobile app
├── packages/
│   ├── website/            # Marketing website (static HTML/CSS/JS)
│   ├── firebase-functions/ # Firebase Cloud Functions backend
│   ├── shared-types/       # Shared TypeScript types
│   ├── shared-utils/       # Shared utility functions
│   └── api-client/         # API client for Firebase functions
├── firebase.json           # Firebase configuration
└── package.json            # Root package.json with workspaces
```

## ✨ Features

### Mobile App (React Native)
- 📱 Cross-platform iOS and Android support
- 🔐 Firebase Authentication (Email/Password, Google Sign-In)
- 📄 Invoice creation and management
- 💰 Expense tracking with receipt capture
- 📸 Camera integration for document scanning
- 🤖 AI-powered invoice/receipt data extraction (Google Cloud Vision)
- 📧 Email integration (Gmail & Outlook) for automatic invoice retrieval
- 📊 Dashboard with financial overview
- 🔄 Real-time sync with Firestore

### Firebase Backend
- ⚡ Serverless Cloud Functions
- 🗄️ Firestore database for data storage
- 🔥 Firebase Storage for images and documents
- 🔒 Secure authentication and authorization
- 👁️ Google Cloud Vision AI integration
- 📬 Email API integration (Gmail & Outlook)
- 🛡️ Firestore and Storage security rules

### Shared Packages
- 📦 TypeScript types shared across mobile and backend
- 🛠️ Common utility functions
- 🌐 API client for easy backend integration

## 🚀 Getting Started

### Quick Start (Recommended)

**The easiest way to get started:**

```bash
# Clone and navigate to the repository
git clone https://github.com/marioallaa/buildbills.git
cd buildbills

# Run the interactive quick start menu
./quick-start.sh
```

The quick start script will help you:
- ✅ Verify dependencies are installed
- 🔥 Start Firebase Emulators for backend testing
- 📱 Launch the mobile app development server
- 🧪 Run linters and build tools
- 📊 Check system status

**For detailed testing instructions, see [TESTING_GUIDE.md](TESTING_GUIDE.md)**

### Prerequisites

- **Node.js** >= 18.0.0 (v20.19.6 ✅)
- **npm** >= 9.0.0 (v10.8.2 ✅)
- **Firebase CLI**: `npm install -g firebase-tools`
- **React Native CLI**: `npm install -g @react-native-community/cli`
- **Xcode** (for iOS development - Mac only)
- **Android Studio** (for Android development)

### Manual Installation

If you prefer manual setup:

1. **Clone the repository**
   ```bash
   git clone https://github.com/marioallaa/buildbills.git
   cd buildbills
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```
   
   This installs dependencies for:
   - Root workspace ✅
   - Mobile app ✅
   - Firebase functions ✅
   - All shared packages ✅

3. **For iOS development (Mac only)**
   ```bash
   cd apps/mobile/ios
   pod install
   cd ../../..
   ```

## 🔧 Development

### ✅ Current Setup Status

**All systems are configured and ready to test!**

- ✅ **Dependencies**: All packages installed
- ✅ **TypeScript**: Firebase functions compile successfully  
- ✅ **Linting**: All code passes linting (0 errors)
- ✅ **Firebase Functions**: Ready for local testing with emulators
- ✅ **Mobile App**: Code is ready (needs Firebase configuration)
- ✅ **Documentation**: Complete testing guide included

**Next Steps:**
1. Configure Firebase project credentials
2. Run Firebase emulators: `./quick-start.sh` (option 1)
3. Test mobile app: `./quick-start.sh` (option 2)

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed instructions.

---

### Mobile App

**Start Metro bundler:**
```bash
npm run mobile
# or
cd apps/mobile && npm start
```

**Run on iOS:**
```bash
npm run mobile:ios
# or
cd apps/mobile && npm run ios
```

**Run on Android:**
```bash
npm run mobile:android
# or
cd apps/mobile && npm run android
```

### Firebase Functions

**Run emulators locally:**
```bash
npm run firebase:emulator
# or
cd packages/firebase-functions && npm run emulator
```

**Deploy to Firebase:**
```bash
npm run firebase:deploy
# or
cd packages/firebase-functions && npm run deploy
```

### Website

The marketing website is a static site located in `packages/website/`. You can serve it locally with:
```bash
cd packages/website
npx http-server . -p 8080
```

## 🧪 Testing

**Run all tests:**
```bash
npm test
```

**Test Firebase functions:**
```bash
npm run test:functions
```

**Test mobile app:**
```bash
npm run test:mobile
```

## 📱 Mobile App Architecture

The mobile app uses:
- **React Navigation** for navigation (Stack & Tab navigators)
- **React Native Firebase** for backend integration
- **TypeScript** for type safety
- **Context API** for state management (can be extended with Redux)

### Key Screens
- Authentication: Login, Register, Forgot Password
- Dashboard: Financial overview and quick actions
- Invoices: List, Create, Edit invoices
- Expenses: List, Create, Edit expenses with receipt scanning
- Settings: Account management and integrations

## 🔥 Firebase Backend Architecture

### Cloud Functions
- **Authentication**: User management and profile creation
- **Invoices**: CRUD operations for invoices
- **Expenses**: CRUD operations for expenses
- **Vision AI**: Image analysis for invoice/receipt extraction
- **Email Integration**: Connect and sync Gmail/Outlook accounts

### Firestore Collections
- `users`: User profiles and settings
- `invoices`: Invoice documents
- `expenses`: Expense records
- `emailConnections`: Email account connections

### Storage Structure
- `users/{userId}/profile/`: Profile pictures
- `invoices/{userId}/{invoiceId}/`: Invoice images
- `receipts/{userId}/{receiptId}/`: Receipt images
- `expenses/{userId}/{expenseId}/`: Expense images

## 🔐 Security

- Firestore and Storage security rules enforce user-level access control
- All Cloud Functions require authentication
- Sensitive data is protected with Firebase Auth
- API tokens are stored securely

## 📚 API Documentation

### Invoice Functions

**createInvoice**
```typescript
{
  clientName: string;
  clientEmail?: string;
  amount: number;
  description?: string;
  items?: InvoiceItem[];
  dueDate?: Date;
}
```

**getInvoice**
```typescript
{ invoiceId: string }
```

**updateInvoice**
```typescript
{
  invoiceId: string;
  clientName?: string;
  amount?: number;
  // ... other fields
}
```

**deleteInvoice**
```typescript
{ invoiceId: string }
```

**listInvoices**
```typescript
{
  limit?: number;
  startAfter?: string;
}
```

### Expense Functions

Similar structure to Invoice functions with expense-specific fields.

### Vision AI Functions

**analyzeInvoice / analyzeReceipt**
```typescript
{
  imageUrl?: string;
  imageBase64?: string;
}
```

### Email Integration Functions

**connectGmail / connectOutlook**
```typescript
{
  accessToken: string;
  refreshToken: string;
}
```

**syncEmails**
```typescript
{}
```

## 🚢 Deployment

### Mobile App

**iOS:**
1. Configure signing in Xcode
2. Archive and submit to App Store
3. Follow Apple's review guidelines

**Android:**
1. Generate release APK/AAB
2. Sign with release keystore
3. Submit to Google Play Console

### Firebase Backend

```bash
# Login to Firebase
firebase login

# Deploy all functions and rules
npm run firebase:deploy

# Deploy specific functions
cd packages/firebase-functions
npm run deploy
```

### Website

The static website in `packages/website/` can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

BuildBills Team

## 🙏 Acknowledgments

- React Native team for the mobile framework
- Firebase team for the backend infrastructure
- Google Cloud Vision AI for document processing
- All open-source contributors

---

**Made with ❤️ for contractors and small businesses**
