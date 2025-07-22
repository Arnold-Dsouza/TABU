# App Icon Setup Guide for TABU 2 APK

## Quick Setup (Using your tabu.png image)

### Step 1: Prepare Your Icon
1. Take your `public/tabu.png` image
2. Convert it to PNG format if needed
3. Make sure it's square (1:1 aspect ratio)
4. Recommended base size: 1024x1024 pixels

### Step 2: Generate Different Sizes
You need to create these sizes from your base image:

**mipmap-mdpi (48x48):**
- ic_launcher.png
- ic_launcher_round.png

**mipmap-hdpi (72x72):**
- ic_launcher.png
- ic_launcher_round.png

**mipmap-xhdpi (96x96):**
- ic_launcher.png
- ic_launcher_round.png

**mipmap-xxhdpi (144x144):**
- ic_launcher.png
- ic_launcher_round.png

**mipmap-xxxhdpi (192x192):**
- ic_launcher.png
- ic_launcher_round.png

### Step 3: Replace the Icons
Replace the files in these directories:
- `android/app/src/main/res/mipmap-mdpi/`
- `android/app/src/main/res/mipmap-hdpi/`
- `android/app/src/main/res/mipmap-xhdpi/`
- `android/app/src/main/res/mipmap-xxhdpi/`
- `android/app/src/main/res/mipmap-xxxhdpi/`

## Option 2: Automated Setup with Capacitor

### Method A: Using Capacitor Assets Generator
1. Install the capacitor assets plugin:
   ```bash
   npm install @capacitor/assets --save-dev
   ```

2. Create an `assets` folder in your project root
3. Add your icon as `icon.png` (1024x1024)
4. Run: `npx capacitor-assets generate`

### Method B: Using Android Asset Studio
1. Go to: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
2. Upload your tabu.png image
3. Download the generated icon pack
4. Extract and copy all the mipmap folders to `android/app/src/main/res/`

## Current Icon Configuration
The app icon is configured in:
- `android/app/src/main/AndroidManifest.xml`
- Look for: `android:icon="@mipmap/ic_launcher"`

## Build Commands After Icon Update
After updating icons, run:
```bash
npx capacitor sync android
npx capacitor build android
```

## Quick Online Tools for Icon Generation
1. **Android Asset Studio**: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
2. **App Icon Generator**: https://appicon.co/
3. **Icon Kitchen**: https://icon.kitchen/

## Testing Your Icon
1. Build the APK
2. Install on device/emulator
3. Check the app drawer and home screen
4. Verify the icon appears correctly in different contexts
