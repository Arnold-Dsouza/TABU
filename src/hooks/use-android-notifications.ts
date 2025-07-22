'use client';

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { usePushNotifications } from './use-push-notifications';

export default function TabuAndroidNotificationService() {
  const { token, isRegistered } = usePushNotifications();
  
  const sendTestNotification = async () => {
    if (!isRegistered || !token) {
      console.error('Push notifications not registered');
      return false;
    }
    
    // In a real app, you would send this token to your server
    // which would then use FCM to send a notification to this device
    console.log('Would send test notification to token:', token);
    
    // For testing purposes, simulate a notification with a local notification
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      await LocalNotifications.schedule({
        notifications: [{
          title: 'TABU Test Notification',
          body: 'This is a test notification for Android',
          id: Math.floor(Math.random() * 10000),
          schedule: { at: new Date(Date.now() + 1000) },
        }]
      });
      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  };
  
  return {
    token,
    isRegistered,
    sendTestNotification
  };
}
