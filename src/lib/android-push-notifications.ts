'use client';

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

// Function to initialize push notifications on Android
async function initPushNotifications() {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') return null;
  
  try {
    // Request permission
    const permission = await PushNotifications.requestPermissions();
    if (permission.receive !== 'granted') {
      console.log('Push notification permission not granted');
      return null;
    }
    
    // We'll resolve with the token once it's received
    const tokenPromise = new Promise<string>((resolve) => {
      PushNotifications.addListener('registration', (tokenData) => {
        console.log('FCM token received:', tokenData.value);
        resolve(tokenData.value);
      });
    });
    
    // Register with FCM
    await PushNotifications.register();
    
    // Set up other listeners
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error:', error);
    });
    
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received:', notification);
    });
    
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Push notification action performed:', action);
    });
    
    // Wait for token
    const token = await Promise.race([
      tokenPromise,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)) // 5 second timeout
    ]);
    
    return token;
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return null;
  }
}

// Hook to use push notifications in components
export function useAndroidPushNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const isAndroid = Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
  
  useEffect(() => {
    if (!isAndroid) return;
    
    let mounted = true;
    
    const init = async () => {
      const fcmToken = await initPushNotifications();
      if (mounted) {
        setToken(fcmToken);
        setInitialized(!!fcmToken);
      }
    };
    
    init();
    
    return () => {
      mounted = false;
      // In a real app, you might want to clean up listeners here
    };
  }, [isAndroid]);
  
  return { token, initialized, isAndroid };
}

// Export the initialization function for use in service files
export { initPushNotifications };
