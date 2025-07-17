# iOS Quick Commands for TABU 2

## 🚀 Essential iOS Commands

### Prerequisites Check
```bash
# Check if Xcode is installed
xcode-select -p

# Install Xcode Command Line Tools if needed
xcode-select --install

# Check if CocoaPods is installed
pod --version

# Install CocoaPods if needed
sudo gem install cocoapods
```

### Setup Commands
```bash
# Sync iOS project
npx capacitor sync ios

# Install iOS dependencies
cd ios/App
pod install
cd ../..

# Open in Xcode
npx capacitor open ios
```

### Build & Run Commands
```bash
# Run on iOS simulator
npx capacitor run ios

# Build for iOS
npx capacitor build ios

# List available simulators
xcrun simctl list devices

# Run on specific simulator
npx capacitor run ios --target="iPhone 15 Pro"
```

### Live Reload (Development)
```bash
# Start dev server with live reload
npx capacitor run ios --livereload --external

# Or start dev server separately
npm run dev
# Then in another terminal:
npx capacitor run ios --livereload-url=http://localhost:3000
```

### Troubleshooting Commands
```bash
# Clean iOS build
npx capacitor clean ios

# Re-sync everything
npx capacitor sync ios

# Update iOS dependencies
cd ios/App
pod install --repo-update
cd ../..

# Clean Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData
```

## 📱 Current iOS Status:

✅ **Ready for Development:**
- [x] iOS project structure created
- [x] Custom TABU 2 icons installed
- [x] App name set to "TABU 2"
- [x] Splash screens configured
- [x] All Capacitor plugins configured
- [x] Bundle ready for Xcode

🔄 **Next Steps:**
1. Install Xcode (if on Mac)
2. Install CocoaPods
3. Open project: `npx capacitor open ios`
4. Configure signing in Xcode
5. Build and test!

## 💡 Pro Tips:

- Always open `.xcworkspace` file, not `.xcodeproj`
- Use `pod install` after adding new iOS dependencies
- Test on simulator first, then real device
- Enable "Automatically manage signing" in Xcode for easier setup

Your TABU 2 app is ready for iOS! 🍎📱
