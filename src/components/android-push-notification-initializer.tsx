'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useAndroidPushNotifications } from '@/lib/android-push-notifications';

// This component initializes Android push notifications
// Include it at the root of your app to ensure push notifications are set up
export default function AndroidPushNotificationInitializer() {
  const { token, initialized, isAndroid } = useAndroidPushNotifications();
  
  useEffect(() => {
    if (isAndroid && initialized && token) {
      console.log('Android push notifications initialized with token:', token);
      // In a production app, you'd send this token to your server
    }
  }, [isAndroid, initialized, token]);
  
  // This is a headless component - it doesn't render anything
  return null;
}
