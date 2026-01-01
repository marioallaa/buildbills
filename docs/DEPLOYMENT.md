# Deployment Guide

This guide covers deploying BuildBills to production environments.

## Firebase Backend Deployment

### Prerequisites

1. **Firebase project set up** in production mode
2. **Billing enabled** on your Firebase project (required for Cloud Functions)
3. **Firebase CLI installed** and authenticated

### Deploy Functions

```bash
# Navigate to functions directory
cd packages/firebase-functions

# Build the functions
npm run build

# Deploy to Firebase
npm run deploy

# Or deploy specific function
firebase deploy --only functions:createInvoice
```

### Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### Deploy Storage Rules

```bash
firebase deploy --only storage:rules
```

### Deploy Everything

```bash
firebase deploy
```

## Mobile App Deployment

### iOS App Store

#### 1. Prepare for Release

1. **Update version in `ios/mobile/Info.plist`:**
   ```xml
   <key>CFBundleShortVersionString</key>
   <string>1.0.0</string>
   <key>CFBundleVersion</key>
   <string>1</string>
   ```

2. **Configure signing:**
   - Open `ios/mobile.xcworkspace` in Xcode
   - Select your development team
   - Set bundle identifier
   - Enable automatic signing

3. **Create App Store listing:**
   - Go to https://appstoreconnect.apple.com
   - Create new app
   - Fill in app information, screenshots, etc.

#### 2. Build and Archive

```bash
cd apps/mobile/ios

# Clean build
xcodebuild clean -workspace mobile.xcworkspace -scheme mobile

# Archive
xcodebuild archive \
  -workspace mobile.xcworkspace \
  -scheme mobile \
  -archivePath ./build/mobile.xcarchive

# Export for App Store
xcodebuild -exportArchive \
  -archivePath ./build/mobile.xcarchive \
  -exportPath ./build \
  -exportOptionsPlist ExportOptions.plist
```

**Or use Xcode:**
1. Product → Archive
2. Window → Organizer
3. Select archive → Distribute App
4. Follow the wizard

#### 3. Submit to App Store

- Upload the IPA via Xcode Organizer or Transporter app
- Wait for processing (15-30 minutes)
- Submit for review in App Store Connect

### Android Play Store

#### 1. Prepare for Release

1. **Update version in `android/app/build.gradle`:**
   ```gradle
   versionCode 1
   versionName "1.0.0"
   ```

2. **Generate signing key:**
   ```bash
   cd apps/mobile/android/app
   keytool -genkeypair -v \
     -keystore buildbills-release.keystore \
     -alias buildbills \
     -keyalg RSA -keysize 2048 -validity 10000
   ```

3. **Configure signing in `android/gradle.properties`:**
   ```properties
   BUILDBILLS_RELEASE_STORE_FILE=buildbills-release.keystore
   BUILDBILLS_RELEASE_KEY_ALIAS=buildbills
   BUILDBILLS_RELEASE_STORE_PASSWORD=****
   BUILDBILLS_RELEASE_KEY_PASSWORD=****
   ```

4. **Update `android/app/build.gradle`:**
   ```gradle
   signingConfigs {
       release {
           storeFile file(BUILDBILLS_RELEASE_STORE_FILE)
           storePassword BUILDBILLS_RELEASE_STORE_PASSWORD
           keyAlias BUILDBILLS_RELEASE_KEY_ALIAS
           keyPassword BUILDBILLS_RELEASE_KEY_PASSWORD
       }
   }
   ```

#### 2. Build Release APK/AAB

```bash
cd apps/mobile/android

# Clean
./gradlew clean

# Build release AAB (recommended for Play Store)
./gradlew bundleRelease

# Or build release APK
./gradlew assembleRelease
```

Output files:
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`
- APK: `android/app/build/outputs/apk/release/app-release.apk`

#### 3. Submit to Play Store

1. Go to https://play.google.com/console
2. Create new app
3. Fill in store listing, content rating, pricing
4. Upload AAB in Production track
5. Submit for review

## Website Deployment

### GitHub Pages

```bash
cd packages/website

# Commit and push
git add .
git commit -m "Update website"
git push origin main

# Enable GitHub Pages in repository settings
# Source: main branch / root or docs folder
```

### Netlify

1. Connect repository to Netlify
2. Configure build settings:
   - Base directory: `packages/website`
   - Build command: (none, it's static)
   - Publish directory: `packages/website`
3. Deploy

### Firebase Hosting (Alternative)

```bash
# Initialize hosting
firebase init hosting

# Configure firebase.json
{
  "hosting": {
    "public": "packages/website",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  }
}

# Deploy
firebase deploy --only hosting
```

## Environment Configuration

### Production Environment Variables

**Firebase Functions:**
```bash
# Set environment config
firebase functions:config:set \
  vision.api_key="YOUR_API_KEY" \
  gmail.client_id="YOUR_CLIENT_ID" \
  gmail.client_secret="YOUR_CLIENT_SECRET"

# View current config
firebase functions:config:get
```

**Mobile App:**
Update `.env` with production values:
```env
FIREBASE_API_KEY=prod_api_key
FIREBASE_AUTH_DOMAIN=prod_auth_domain
FIREBASE_PROJECT_ID=prod_project_id
```

## Continuous Deployment (CI/CD)

### GitHub Actions for Firebase

Create `.github/workflows/firebase-deploy.yml`:
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: cd packages/firebase-functions && npm ci
      - run: cd packages/firebase-functions && npm run build
      - uses: w9jds/firebase-action@master
        with:
          args: deploy --only functions
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

### GitHub Actions for Mobile

Use Fastlane for automated mobile deployments.

## Monitoring and Maintenance

### Firebase Console
- Monitor function executions and errors
- Check Firestore usage and quotas
- Review authentication activity

### App Store Connect / Play Console
- Monitor crash reports
- Track user reviews
- Check app performance metrics

### Google Cloud Console
- Monitor Cloud Vision API usage
- Check billing and quotas
- Review error logs

## Rollback Strategy

**Firebase Functions:**
```bash
# List previous deployments
firebase functions:list

# Rollback to previous version
firebase functions:rollback
```

**Mobile Apps:**
- iOS: Submit updated version to App Store
- Android: Use Play Console's staged rollout or rollback features

## Post-Deployment Checklist

- [ ] Test authentication flows
- [ ] Verify invoice creation and retrieval
- [ ] Test expense tracking with image upload
- [ ] Check Vision AI integration
- [ ] Verify email sync functionality
- [ ] Monitor error logs for first 24 hours
- [ ] Check performance metrics
- [ ] Verify all API endpoints are working
- [ ] Test on multiple devices (iOS and Android)
- [ ] Monitor user feedback and crash reports
