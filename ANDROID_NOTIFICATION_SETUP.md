# Android Notification Setup

## Firebase Setup for Android Push Notifications

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Add an Android app to your Firebase project:
   - Use package name: `com.tabu2.app` (match your `appId` in capacitor.config.ts)
   - Register the app

4. Download the `google-services.json` file and place it in the `android/app/` directory

## Adding Firebase to your Android app

The Firebase configuration files have been added to your project. You need to sync the project with Capacitor:

```bash
npm run mobile:sync
```

## Testing Push Notifications

After completing the setup, push notifications should work on Android. Use the notification test feature in the app to verify.
