'use client';

import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import IOSPWANotificationService from '../../pwa-ios/ios-notification-service';

// Class to handle notifications across platforms (Android native and iOS PWA)
export class UnifiedNotificationService {
  private static instance: UnifiedNotificationService;
  private isNative: boolean;
  private iosService: IOSPWANotificationService | null = null;
  
  // Get singleton instance
  public static getInstance(): UnifiedNotificationService {
    if (!UnifiedNotificationService.instance) {
      UnifiedNotificationService.instance = new UnifiedNotificationService();
    }
    return UnifiedNotificationService.instance;
  }
  
  // Private constructor for singleton
  private constructor() {
    this.isNative = typeof window !== 'undefined' && Capacitor.isNativePlatform();
    
    // Initialize iOS PWA service if not on native platform
    if (!this.isNative && typeof window !== 'undefined') {
      this.iosService = IOSPWANotificationService.getInstance();
    }
  }
  
  // Initialize notifications
  async initialize(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    try {
      if (this.isNative) {
        // Native Android
        const permission = await LocalNotifications.requestPermissions();
        return permission.display === 'granted';
      } else {
        // iOS PWA
        if (this.iosService) {
          return await this.iosService.initialize();
        }
        return false;
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }
  
  // Check if notifications are supported
  supportsNotifications(): boolean {
    if (typeof window === 'undefined') return false;
    
    if (this.isNative) {
      return true; // Native Android always supports notifications
    } else {
      // iOS PWA
      return this.iosService?.supportsNotifications() || false;
    }
  }
  
  // Send a notification
  async sendNotification(
    title: string, 
    body: string, 
    id = Math.floor(Math.random() * 10000), 
    extraData = {}
  ): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    try {
      if (this.isNative) {
        // Native Android
        await LocalNotifications.schedule({
          notifications: [{
            title,
            body,
            id,
            extra: extraData
          }]
        });
        return true;
      } else {
        // iOS PWA
        if (this.iosService) {
          return await this.iosService.sendTestNotification(title, {
            body,
            data: extraData
          });
        }
        return false;
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }
  
  // Get platform type
  getPlatformType(): 'android-native' | 'ios-pwa' | 'unsupported' {
    if (typeof window === 'undefined') return 'unsupported';
    
    if (this.isNative) {
      return 'android-native';
    } else if (this.iosService?.isIOS() && this.iosService?.isPWA()) {
      return 'ios-pwa';
    } else {
      return 'unsupported';
    }
  }
}

// React hook for using unified notifications
export function useUnifiedNotifications() {
  const service = typeof window !== 'undefined' ? UnifiedNotificationService.getInstance() : null;
  
  return {
    notificationService: service,
    platformType: service?.getPlatformType() || 'unsupported'
  };
}
