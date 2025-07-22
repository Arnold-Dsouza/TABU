'use client';

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

export function usePushNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Only run on native platforms
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (!isNative) return;
    
    const initPush = async () => {
      try {
        // Request permission
        const permission = await PushNotifications.requestPermissions();
        if (permission.receive === 'granted') {
          // Register with FCM
          await PushNotifications.register();
          setIsRegistered(true);
        }
      } catch (error) {
        console.error('Error initializing push notifications:', error);
      }
    };

    // Set up event listeners first
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success:', token.value);
      setToken(token.value);
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error:', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received:', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Push notification action performed:', action);
    });

    // Initialize
    initPush();

    // Cleanup
    return () => {
      PushNotifications.removeAllListeners();
    };
  }, [isNative]);

  return { token, isRegistered, isNative };
}
