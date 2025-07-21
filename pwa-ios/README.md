# iOS PWA (Progressive Web App) Implementation

This folder contains the necessary files and configurations to enable PWA functionality for iOS devices.

## Why PWA for iOS?

Unlike Android where APK installation is possible, iOS has stricter limitations on app distribution:

1. iOS apps typically require App Store approval and distribution
2. Enterprise certificates are expensive and have limitations
3. PWAs provide a viable alternative with many native-like capabilities

## Features Supported by iOS PWAs

- Home screen installation
- Offline functionality
- Push notifications (with limitations)
- Access to some device features
- App-like experience with full-screen mode

## iOS-Specific PWA Requirements

1. **Web App Manifest**: Properly configured with iOS-specific metadata
2. **Service Worker**: For offline functionality and push notifications
3. **iOS Meta Tags**: Specific meta tags in the HTML head
4. **Splash Screens**: Multiple sizes for different iOS devices
5. **Icons**: Multiple sizes with proper iOS support

## Push Notifications on iOS

As of iOS 16.4+, Safari supports web push notifications for PWAs added to the home screen, with these requirements:

1. The PWA must be added to the home screen
2. The app must request notification permissions after being launched from the home screen
3. The app must use a service worker for notification handling

## Installation Instructions for iOS Users

1. Open the TABU app in Safari browser
2. Tap the Share button at the bottom of the screen
3. Scroll down and tap "Add to Home Screen"
4. Name the app and tap "Add"
5. Launch the app from the home screen icon
6. When prompted, allow notifications

## Using This Implementation

This folder contains:

- `service-worker.js`: Service worker for offline support and push notifications
- `pwa-install-prompt.tsx`: Component to prompt iOS users to install the PWA
- `ios-notification-service.tsx`: iOS-specific notification service

To test PWA functionality locally:

1. Run `start-https-dev-server.bat` to start an HTTPS server (required for testing PWAs)
2. Access the app via `https://localhost:9002`
3. Use Safari on iOS to test the full experience

## Implementation Details

### Key Files

- **Client Wrapper**: The `pwa-client-wrapper.tsx` component handles all client-side PWA functionality
- **Layout Integration**: PWA components are integrated in `layout.tsx` through the client wrapper
- **Service Worker**: Registered via the client wrapper component
- **Web Manifest**: Enhanced in `/public/manifest.webmanifest`
- **Unified Notifications**: Created in `src/lib/unified-notification-service.tsx`

### Testing Notifications

Use the `PWANotificationDemo` component to test push notifications across platforms.

## Developer Notes

- iOS PWA support varies by iOS version - best support is on iOS 16.4+
- Test on actual iOS devices as simulators don't fully represent the PWA experience
- iOS PWAs have some limitations compared to native apps, especially regarding background processing
- HTTPS is required for service workers and PWA features, use the provided HTTPS dev server script

## Next.js and PWA Integration

When integrating PWA functionality with Next.js (especially in the App Router), be aware of these important considerations:

1. **Server vs Client Components**: 
   - Next.js App Router uses React Server Components by default
   - PWA features require client-side JavaScript (localStorage, service workers, etc.)
   - Always use the `'use client'` directive for components that use browser APIs

2. **Dynamic Imports**:
   - `ssr: false` cannot be used directly in Server Components
   - Create a client component wrapper (`pwa-client-wrapper.tsx`) to handle dynamic imports

3. **Browser APIs**:
   - Always check for browser environment with `typeof window !== 'undefined'` 
   - Wrap browser API calls in useEffect hooks to ensure they only run on the client

4. **Service Worker Registration**:
   - Must be handled on the client side
   - Use a dedicated client component for registration

## Resources

- [Apple Web Apps Documentation](https://developer.apple.com/documentation/webkit/promoting_apps_with_smart_app_banners/)
- [Web Push for Web Apps on iOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)
- [PWA on iOS Guidelines](https://firt.dev/ios-pwa-guideline/)
