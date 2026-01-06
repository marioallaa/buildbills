#!/bin/bash

# BuildBills Quick Start Script
# This script helps you get started testing BuildBills

set -e

echo "🏗️  BuildBills Quick Start"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the BuildBills root directory"
    exit 1
fi

echo -e "${BLUE}📦 Verifying dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo -e "${BLUE}🔧 What would you like to test?${NC}"
echo ""
echo "1) 🔥 Start Firebase Emulators (Backend testing)"
echo "2) 📱 Start Mobile App Metro Bundler"
echo "3) 🏗️  Build Firebase Functions"
echo "4) 🧪 Run Firebase Functions Lint"
echo "5) 🧪 Run Mobile App Lint"
echo "6) 📊 View System Status"
echo "7) 📖 Open Testing Guide"
echo "8) 🚀 Start Everything (Emulators + Mobile)"
echo "9) ❌ Exit"
echo ""
read -p "Enter your choice (1-9): " choice

case $choice in
    1)
        echo -e "${GREEN}Starting Firebase Emulators...${NC}"
        echo ""
        echo "Emulators will be available at:"
        echo "  • Emulator UI:  http://localhost:4000"
        echo "  • Firestore:    http://localhost:8080"
        echo "  • Functions:    http://localhost:5001"
        echo "  • Auth:         http://localhost:9099"
        echo "  • Storage:      http://localhost:9199"
        echo ""
        echo "Press Ctrl+C to stop emulators"
        echo ""
        cd packages/firebase-functions
        npm run emulator
        ;;
    2)
        echo -e "${GREEN}Starting Mobile App Metro Bundler...${NC}"
        echo ""
        echo "Metro bundler will start. Then:"
        echo "  • For iOS: Run 'npm run ios' in apps/mobile"
        echo "  • For Android: Run 'npm run android' in apps/mobile"
        echo ""
        echo "Press Ctrl+C to stop Metro"
        echo ""
        cd apps/mobile
        npm start
        ;;
    3)
        echo -e "${GREEN}Building Firebase Functions...${NC}"
        cd packages/firebase-functions
        npm run build
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Build successful!${NC}"
        else
            echo ""
            echo -e "${YELLOW}❌ Build failed. Check errors above.${NC}"
        fi
        ;;
    4)
        echo -e "${GREEN}Running Firebase Functions Lint...${NC}"
        cd packages/firebase-functions
        npm run lint
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Lint passed!${NC}"
        else
            echo ""
            echo -e "${YELLOW}⚠️  Lint completed with warnings/errors. Check output above.${NC}"
        fi
        ;;
    5)
        echo -e "${GREEN}Running Mobile App Lint...${NC}"
        cd apps/mobile
        npm run lint
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Lint passed!${NC}"
        else
            echo ""
            echo -e "${YELLOW}⚠️  Lint completed with warnings/errors. Check output above.${NC}"
        fi
        ;;
    6)
        echo -e "${GREEN}System Status Check...${NC}"
        echo ""
        echo "🔍 Node.js Version:"
        node --version
        echo ""
        echo "🔍 npm Version:"
        npm --version
        echo ""
        echo "📦 Dependencies:"
        if [ -d "node_modules" ]; then
            echo "  ✅ Root dependencies installed"
        else
            echo "  ❌ Root dependencies NOT installed"
        fi
        if [ -d "apps/mobile/node_modules" ]; then
            echo "  ✅ Mobile dependencies installed"
        else
            echo "  ❌ Mobile dependencies NOT installed"
        fi
        if [ -d "packages/firebase-functions/node_modules" ]; then
            echo "  ✅ Firebase functions dependencies installed"
        else
            echo "  ❌ Firebase functions dependencies NOT installed"
        fi
        echo ""
        echo "🏗️  Build Status:"
        if [ -d "packages/firebase-functions/lib" ]; then
            echo "  ✅ Firebase functions built"
        else
            echo "  ⚠️  Firebase functions not built (run option 3)"
        fi
        echo ""
        echo "🔥 Firebase CLI:"
        if command -v firebase &> /dev/null; then
            firebase --version
            echo "  ✅ Firebase CLI installed"
        else
            echo "  ❌ Firebase CLI NOT installed"
            echo "     Install with: npm install -g firebase-tools"
        fi
        echo ""
        echo "For detailed testing instructions, see TESTING_GUIDE.md"
        ;;
    7)
        echo -e "${GREEN}Opening Testing Guide...${NC}"
        if command -v code &> /dev/null; then
            code TESTING_GUIDE.md
        elif [ -f "TESTING_GUIDE.md" ]; then
            cat TESTING_GUIDE.md
        else
            echo "TESTING_GUIDE.md not found"
        fi
        ;;
    8)
        echo -e "${GREEN}Starting Everything...${NC}"
        echo ""
        echo "This will open multiple terminal windows/tabs:"
        echo "  1. Firebase Emulators"
        echo "  2. Mobile Metro Bundler"
        echo ""
        
        # Try to detect terminal and open multiple tabs/windows
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            osascript -e 'tell application "Terminal" to do script "cd '"$PWD"' && cd packages/firebase-functions && npm run emulator"'
            osascript -e 'tell application "Terminal" to do script "cd '"$PWD"' && cd apps/mobile && npm start"'
            echo "✅ Opened in separate Terminal windows"
        else
            echo "Starting Firebase Emulators in background..."
            cd packages/firebase-functions
            npm run emulator &
            FIREBASE_PID=$!
            echo "Firebase Emulators PID: $FIREBASE_PID"
            echo ""
            echo "Waiting 10 seconds for emulators to start..."
            sleep 10
            echo ""
            echo "Starting Mobile Metro Bundler..."
            cd ../../apps/mobile
            npm start
        fi
        ;;
    9)
        echo "Goodbye! 👋"
        exit 0
        ;;
    *)
        echo "Invalid choice. Please run the script again and select 1-9."
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Done!${NC}"
