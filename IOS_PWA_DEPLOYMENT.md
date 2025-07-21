# iOS PWA Deployment Guide

This guide covers how to deploy the TABU app as a Progressive Web App (PWA) for iOS users.

## Prerequisites

- Web hosting with HTTPS support
- Configured manifest.webmanifest file
- Service worker implementation
- iOS-specific meta tags
- Client-side components for browser API interactions

## Deployment Steps

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Deploy the `out` directory to your web hosting**:
   - Ensure all files from the `out` directory are copied to your web hosting
   - Make sure the `manifest.webmanifest` file is accessible from the root
   - Make sure the service worker file is accessible from the root

3. **Verify HTTPS**:
   - Ensure your domain has valid HTTPS certificates
   - Without HTTPS, PWA features like service workers won't function

4. **Testing on iOS Devices**:
   - Open Safari on iOS and navigate to your website
   - Add to Home Screen using the Share button
   - Launch from the Home Screen icon
   - Verify that notifications can be requested and received
   - Test offline functionality

## Troubleshooting

### PWA Not Installing

- Ensure `manifest.webmanifest` is properly configured
- Verify iOS meta tags in the HTML head
- Make sure you're using Safari (not Chrome) on iOS

### Push Notifications Not Working

- iOS version must be 16.4+ for push notification support
- App must be launched from Home Screen, not Safari
- Permissions must be requested after launch from Home Screen
- Ensure service worker is registered properly

### Next.js App Router Issues

- Make sure all browser API interactions are in client components (with 'use client' directive)
- Dynamic imports with `ssr: false` must be in client components
- Use the client component wrapper pattern for PWA features
- Check that the service worker is being registered correctly by client code

### Offline Mode Issues

- Check service worker registration
- Verify cache configuration in service worker
- Make sure important assets are included in the cache

## iOS PWA Limitations

- Limited background processing
- No access to some native APIs
- Push notifications only work when added to Home Screen
- Storage limitations compared to native apps

## Resources

- [Apple Web Apps Documentation](https://developer.apple.com/documentation/webkit/promoting_apps_with_smart_app_banners/)
- [Web Push for Web Apps on iOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)
- [PWA on iOS Guidelines](https://firt.dev/ios-pwa-guideline/)
