# Android Notification Guide

## Understanding Android Notifications: PWA vs Native App

There are two different ways to use TABU on Android:

1. **Native Android App** (APK installation)
2. **Progressive Web App** (Add to Home Screen from browser)

Each has a different notification permission flow:

### Native Android App (APK)
- Uses Firebase Cloud Messaging (FCM)
- Notification permissions are requested during first app launch
- Provides better system integration and background notifications

### Android Progressive Web App (PWA)
- Uses Web Push API with Service Workers
- Permission dialog is shown when you add the app to home screen
- **Important:** You need to manually allow notifications when prompted

## How to Enable Notifications on Android PWA

1. Add TABU to your home screen (from Chrome menu)
2. Launch TABU from the home screen icon
3. You'll see a notification permission banner at the top
4. Tap "Enable Notifications" 
5. When the browser permission dialog appears, select "Allow"

## Troubleshooting Android PWA Notifications

If you don't see the notification permission dialog:

1. Open TABU from your home screen
2. Look for the notification banner at the top
3. If you don't see it, try refreshing the app
4. If you've previously denied permissions, you'll need to:
   - Open Chrome settings
   - Go to Site Settings > Notifications
   - Find TABU and enable notifications

## Technical Background

Android PWAs use a different notification system than native apps:

- Native apps use Firebase Cloud Messaging (FCM)
- PWAs use the Web Push API via Service Workers

The components we've added to handle this:
- `android-notification-helper.tsx` - Prompts for notification permission in PWAs
- `android-pwa-service-worker.tsx` - Registers the service worker for PWAs
- `android-push-notification-initializer.tsx` - Handles native Android notifications

These components are automatically included based on your platform detection.
