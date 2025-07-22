# TABU Android Notification Fix

## Summary of the Issue

Your app's notifications are working correctly on iOS but not on Android. This is because:

1. **iOS PWA Notifications**: These are properly configured using the standard Web Push API and Service Worker
2. **Android Push Notifications**: These require Firebase Cloud Messaging (FCM) which isn't set up in your project

## Solution Steps

To fix Android notifications, follow these steps:

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Add an Android app with package name `com.tabu2.app`
4. Download the `google-services.json` file and place it in `android/app/`

### 2. Gradle Updates

Update your Gradle files with the Firebase dependencies:

1. Edit `android/build.gradle` to add:
   ```gradle
   buildscript {
       dependencies {
           classpath 'com.google.gms:google-services:4.3.15'
       }
   }
   ```

2. Edit `android/app/build.gradle` to add:
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   
   dependencies {
       implementation platform('com.google.firebase:firebase-bom:32.6.0')
       implementation 'com.google.firebase:firebase-messaging'
   }
   ```

### 3. Code Implementation

The following files have been created/updated for you:

- `src/hooks/use-push-notifications.ts` - Hook to manage push notification registration
- `android/app/src/main/java/com/tabu2/app/TabuMessagingService.java` - Firebase Messaging Service 
- `android/app/src/main/AndroidManifest.xml` - Updated with FCM service registration

### 4. Testing

After completing the setup:

1. Rebuild your Android app: `npm run mobile:sync`
2. Test notifications using the notification test feature
3. For production, you'll need to send the FCM token to your server

## Reference Files

Refer to these files for detailed implementation:

- `ANDROID_NOTIFICATION_SETUP.md` - Setup guide
- `ANDROID_PUSH_NOTIFICATION_GUIDE.md` - Technical implementation guide
- `android/build.gradle.updated` and `android/app/build.gradle.updated` - Updated Gradle files to copy from

---

Note: The existing notification components are already designed to work with FCM - you just need to complete the Firebase setup and rebuild the app.
