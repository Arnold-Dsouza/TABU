# TABU 2 APK Build Guide with Custom Icon

## ✅ Icon Setup Complete!

Your custom TABU icon has been successfully configured for the APK! Here's what was done:

### What Was Generated:
- **Android Icons**: All required sizes (ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- **Adaptive Icons**: Modern Android adaptive icon format with foreground and background
- **Round Icons**: For devices that support circular icons
- **Splash Screens**: Custom splash screens for both light and dark themes
- **iOS Icons**: Ready if you want to build for iOS later
- **PWA Icons**: For web app installation

### Icon Locations:
```
android/app/src/main/res/
├── mipmap-ldpi/
├── mipmap-mdpi/
├── mipmap-hdpi/
├── mipmap-xhdpi/
├── mipmap-xxhdpi/
└── mipmap-xxxhdpi/
    ├── ic_launcher.png (your TABU icon)
    ├── ic_launcher_round.png (circular version)
    ├── ic_launcher_foreground.png (adaptive icon foreground)
    └── ic_launcher_background.png (adaptive icon background)
```

## Build Your APK Now!

### Method 1: Using Your Existing Build Script
```bash
./build-apk.bat
```

### Method 2: Manual Build Commands
```bash
# Sync changes
npx capacitor sync android

# Build the app
npm run build

# Open Android Studio (optional for debugging)
npx capacitor open android

# Or build directly with Gradle
cd android
./gradlew assembleRelease
```

### Method 3: Debug APK (for testing)
```bash
cd android
./gradlew assembleDebug
```

## Finding Your APK

After building, your APK will be located at:
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`

## Icon Features

Your TABU 2 app will now have:
- ✅ Custom icon on home screen
- ✅ Custom icon in app drawer
- ✅ Custom icon in recent apps
- ✅ Custom icon in settings
- ✅ Adaptive icon support (Android 8.0+)
- ✅ Round icon support (some launchers)
- ✅ Custom splash screen with your branding

## Testing Your Icon

1. Build and install the APK
2. Check the app icon in:
   - Home screen
   - App drawer
   - Recent apps
   - Settings > Apps
3. Try different launcher apps to see adaptive icon behavior

## Future Icon Updates

To update the icon in the future:
1. Replace `assets/icon.png` with your new icon
2. Run `npx capacitor-assets generate`
3. Run `npx capacitor sync android`
4. Rebuild the APK

Your TABU 2 app is now ready with a professional custom icon! 🎉
