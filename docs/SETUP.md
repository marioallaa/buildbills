# Development Setup Guide

This guide will help you set up the BuildBills development environment.

## Prerequisites Installation

### 1. Node.js and npm

**macOS (using Homebrew):**
```bash
brew install node@18
```

**Windows (using Chocolatey):**
```bash
choco install nodejs-lts
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify installation:
```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
```

### 2. Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 3. React Native Environment

#### iOS Development (macOS only)

1. **Install Xcode** from the Mac App Store
2. **Install Xcode Command Line Tools:**
   ```bash
   xcode-select --install
   ```
3. **Install CocoaPods:**
   ```bash
   sudo gem install cocoapods
   ```

#### Android Development

1. **Install Java Development Kit (JDK) 11:**
   ```bash
   # macOS
   brew install openjdk@11
   
   # Windows
   choco install openjdk11
   ```

2. **Install Android Studio:**
   - Download from https://developer.android.com/studio
   - During installation, ensure the following are selected:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device

3. **Configure Android SDK:**
   - Open Android Studio
   - Go to Preferences → Appearance & Behavior → System Settings → Android SDK
   - Install SDK Platform 33 (Android 13.0)
   - Install SDK Build-Tools 33.0.0

4. **Set environment variables:**
   ```bash
   # Add to ~/.bash_profile or ~/.zshrc
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

## Project Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/marioallaa/buildbills.git
cd buildbills

# Install root dependencies
npm install

# Install mobile app dependencies
cd apps/mobile
npm install

# iOS: Install pods
cd ios
pod install
cd ..

# Back to root
cd ../..

# Install Firebase functions dependencies
cd packages/firebase-functions
npm install
cd ../..
```

### 2. Firebase Configuration

1. **Create a Firebase project:**
   - Go to https://console.firebase.google.com/
   - Click "Add project"
   - Follow the setup wizard

2. **Enable Firebase services:**
   - Authentication (Email/Password, Google)
   - Firestore Database
   - Storage
   - Functions

3. **Get Firebase configuration:**
   - Go to Project Settings → General
   - Scroll to "Your apps" section
   - Click on Android/iOS app icon to add apps
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)

4. **Add configuration files:**
   ```bash
   # Android
   cp google-services.json apps/mobile/android/app/
   
   # iOS
   cp GoogleService-Info.plist apps/mobile/ios/
   ```

5. **Initialize Firebase in the project:**
   ```bash
   firebase init
   # Select:
   # - Firestore
   # - Functions
   # - Storage
   # - Emulators
   ```

### 3. Environment Variables

Create a `.env` file in `apps/mobile/`:
```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

## Running the Project

### Start Everything

```bash
# Terminal 1: Start Metro bundler
npm run mobile

# Terminal 2: Run Firebase emulators
npm run firebase:emulator

# Terminal 3: Run iOS
npm run mobile:ios

# Or run Android
npm run mobile:android
```

## Troubleshooting

### iOS Issues

**Pod install fails:**
```bash
cd apps/mobile/ios
pod deintegrate
pod cache clean --all
pod install
```

### Android Issues

**Gradle build fails:**
```bash
cd apps/mobile/android
./gradlew clean
```

### Metro Bundler Issues

**Clear cache:**
```bash
cd apps/mobile
npx react-native start --reset-cache
```

## IDE Setup

### VS Code (Recommended)

**Install Extensions:**
- ESLint
- Prettier
- React Native Tools
- Firebase
- TypeScript
