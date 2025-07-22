'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Capacitor } from '@capacitor/core';

// Dynamically import the PWA install prompt
const PWAInstallPrompt = dynamic(() => import('../../pwa-ios/pwa-install-prompt'), {
  ssr: false
});

// Dynamically import the service worker registration
const ServiceWorkerRegistration = dynamic(
  () => import('@/components/service-worker-registration').then(mod => mod.ServiceWorkerRegistration),
  { ssr: false }
);

// Dynamically import the iOS notification permission prompt
const IOSNotificationPermissionPrompt = dynamic(
  () => import('@/components/ios-notification-permission-prompt'),
  { ssr: false }
);

// Dynamically import Android notification components
const AndroidPWANotificationHelper = dynamic(
  () => import('@/components/android-notification-helper'),
  { ssr: false }
);

const AndroidPWAServiceWorker = dynamic(
  () => import('@/components/android-pwa-service-worker'),
  { ssr: false }
);

// Import native Android notification initializer
const AndroidPushNotificationInitializer = dynamic(
  () => import('@/components/android-push-notification-initializer'),
  { ssr: false }
);

export default function PWAClientComponents() {
  const [mounted, setMounted] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if we're on Android
    if (typeof window !== 'undefined') {
      setIsAndroid(/Android/i.test(navigator.userAgent));
      setIsNative(Capacitor.isNativePlatform());
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <PWAInstallPrompt />
      <ServiceWorkerRegistration />
      <IOSNotificationPermissionPrompt />
      
      {/* Android PWA notification helper */}
      {isAndroid && !isNative && <AndroidPWANotificationHelper />}
      {isAndroid && !isNative && <AndroidPWAServiceWorker />}
      
      {/* Native Android notification initializer */}
      {isAndroid && isNative && <AndroidPushNotificationInitializer />}
    </>
  );
}
