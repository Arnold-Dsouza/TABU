'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

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

export default function PWAClientComponents() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <PWAInstallPrompt />
      <ServiceWorkerRegistration />
      <IOSNotificationPermissionPrompt />
    </>
  );
}
