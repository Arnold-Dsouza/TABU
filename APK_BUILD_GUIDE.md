# APK Building Guide for TABU Project

## Current Status
✅ **Project Built**: Next.js app successfully compiled to static files  
✅ **Capacitor Configured**: Android platform properly added  
❌ **Java/Android SDK**: Not properly configured  

## Prerequisites for APK Building

To build an APK for your TABU project, you need to install the following:

### 1. Java Development Kit (JDK)
**Required**: JDK 11 or higher (JDK 17 recommended)

**Download and Install:**
1. Go to [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://adoptium.net/)
2. Download JDK 17 for Windows
3. Install and note the installation path (usually `C:\Program Files\Java\jdk-17.x.x`)

**Set Environment Variables:**
```powershell
# Set JAVA_HOME (replace with your actual JDK path)
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-17.0.10", "Machine")

# Add Java to PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
[Environment]::SetEnvironmentVariable("PATH", "$currentPath;%JAVA_HOME%\bin", "Machine")
```

### 2. Android Studio & SDK
**Download and Install Android Studio:**
1. Go to [Android Studio](https://developer.android.com/studio)
2. Download and install Android Studio
3. During setup, make sure to install:
   - Android SDK
   - Android SDK Platform-Tools
   - Android SDK Build-Tools
   - Android SDK Command-line Tools

**Set Environment Variables:**
```powershell
# Set ANDROID_HOME (replace with your actual SDK path)
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\%USERNAME%\AppData\Local\Android\Sdk", "Machine")

# Add Android tools to PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
[Environment]::SetEnvironmentVariable("PATH", "$currentPath;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin", "Machine")
```

## Building the APK (After Prerequisites)

### Method 1: Using Capacitor CLI (Recommended)
```bash
# Build the web app
npm run build

# Sync with Android
npx cap sync android

# Build APK
npx cap run android
```

### Method 2: Using Android Studio (Visual Interface)
```bash
# Open project in Android Studio
npx cap open android

# Then in Android Studio:
# 1. Wait for Gradle sync to complete
# 2. Go to Build > Generate Signed Bundle / APK
# 3. Choose APK
# 4. Select "debug" or create a signing key for "release"
# 5. Build
```

### Method 3: Using Gradle Directly
```bash
# Navigate to android folder
cd android

# Build debug APK
.\gradlew assembleDebug

# Build release APK (unsigned)
.\gradlew assembleRelease
```

## APK Output Locations

After successful build, your APK will be located at:
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`

## Quick Setup Commands (Run After Installing Prerequisites)

```powershell
# Restart PowerShell to load new environment variables
# Then run:

# Verify Java installation
java -version

# Verify Android SDK
adb version

# Build your project
npm run build
npx cap sync android
cd android
.\gradlew assembleDebug
```

## Troubleshooting

### Common Issues:
1. **JAVA_HOME not set**: Install JDK and set environment variables
2. **Android SDK not found**: Install Android Studio and set ANDROID_HOME
3. **Gradle build fails**: Check that both Java and Android SDK are properly configured
4. **Permission denied**: Run PowerShell as Administrator when setting environment variables

### Alternative: Use GitHub Actions
If local setup is challenging, you can use GitHub Actions to build APKs:
1. Push your code to GitHub
2. Set up a GitHub Actions workflow for Android builds
3. Download the built APK from the Actions artifacts

## Current Project Status
Your project is ready for APK building! The Capacitor configuration is correct, and all the web assets are properly built. You just need to set up the Android development environment.

## App Details
- **Package ID**: `com.building.laundryapp`
- **App Name**: LaundryApp
- **Features**: Firebase integration, Push notifications, Splash screen
- **Target**: Android devices
