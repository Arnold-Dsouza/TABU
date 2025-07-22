# Android Push Notification Setup Guide

Follow this guide to fix Android push notifications in your TABU app.

## 1. Add Firebase Dependencies

First, you need to add Firebase dependencies to your Android app:

1. Edit `android/build.gradle` to add the Firebase dependencies:

```gradle
buildscript {
    repositories {
        google()
        // ...
    }
    dependencies {
        // ...
        classpath 'com.google.gms:google-services:4.3.15'
    }
}
```

2. Edit `android/app/build.gradle` to apply the Google services plugin:

```gradle
plugins {
    id 'com.android.application'
    id 'com.google.gms.google-services'
}

dependencies {
    // Add these lines
    implementation platform('com.google.firebase:firebase-bom:32.6.0')
    implementation 'com.google.firebase:firebase-messaging'
    // ...
}
```

## 2. Set up Firebase and Download Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Add an Android app to your project with package name `com.tabu2.app`
4. Download the `google-services.json` file and place it in `android/app/`

## 3. Initialize Push Notifications in Code

Update your app to properly initialize push notifications on Android:

```typescript
// In your notification initialization code
import { PushNotifications } from '@capacitor/push-notifications';

// Request permissions and register
await PushNotifications.requestPermissions();
await PushNotifications.register();

// Set up listeners
PushNotifications.addListener('registration', (token) => {
  console.log('Push registration success:', token.value);
  // Send this token to your server
});

PushNotifications.addListener('pushNotificationReceived', (notification) => {
  console.log('Push notification received:', notification);
});
```

## 4. Test Push Notifications

After setting up Firebase and implementing the code, you can test push notifications using:

1. Firebase Console - Send test messages
2. Use a test endpoint to send notifications to your FCM token

For detailed steps, check the [Capacitor Push Notifications documentation](https://capacitorjs.com/docs/apis/push-notifications).
