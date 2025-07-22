'use client';

import { useEffect, useState } from 'react';

// Interface for notification settings
export interface IOSNotificationSettings {
  [serviceId: string]: {
    opening: boolean;
    events: boolean;
  };
}

// Notification service for iOS PWA
export default class IOSPWANotificationService {
  private static instance: IOSPWANotificationService;
  private isInitialized = false;
  private settings: IOSNotificationSettings = {};
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  
  // Get singleton instance
  public static getInstance(): IOSPWANotificationService {
    if (!IOSPWANotificationService.instance) {
      IOSPWANotificationService.instance = new IOSPWANotificationService();
    }
    return IOSPWANotificationService.instance;
  }
  
  // Private constructor for singleton
  private constructor() {
    if (typeof window !== 'undefined') {
      this.loadSettings();
    }
  }

  // Initialize notifications for iOS PWA
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }
    
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported in this browser');
      return false;
    }
    
    try {
      // Register service worker - directly in the root for better iOS compatibility
      this.serviceWorkerRegistration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      console.log('iOS PWA service worker registered successfully');
      
      // Request permission - explicitly show the browser permission dialog
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        this.isInitialized = true;
        console.log('iOS PWA notification permissions granted');
        return true;
      } else {
        console.warn('iOS PWA notification permissions denied');
        return false;
      }
    } catch (error) {
      console.error('Error initializing iOS PWA notifications:', error);
      return false;
    }
  }
  
  // Check if browser supports notifications
  supportsNotifications(): boolean {
    return typeof window !== 'undefined' && 
           'Notification' in window && 
           'serviceWorker' in navigator && 
           'PushManager' in window;
  }
  
  // Check if this is an iOS device
  isIOS(): boolean {
    return typeof window !== 'undefined' && 
           /iPad|iPhone|iPod/.test(navigator.userAgent) && 
           !(window as any).MSStream;
  }
  
  // Check if this is running as an installed PWA
  isPWA(): boolean {
    return typeof window !== 'undefined' && 
           (window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true);
  }
  
  // Load notification settings from localStorage
  private loadSettings() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('iosPwaNotificationSettings');
      if (saved) {
        this.settings = JSON.parse(saved);
      } else {
        // Default settings
        this.settings = {
          fitness: { opening: false, events: false },
          tea: { opening: false, events: false },
          cafeteria: { opening: false, events: false },
          bar: { opening: false, events: false },
        };
        this.saveSettings();
      }
    }
  }
  
  // Save notification settings to localStorage
  private saveSettings() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('iosPwaNotificationSettings', JSON.stringify(this.settings));
    }
  }
  
  // Update notification settings
  setNotificationSettings(settings: IOSNotificationSettings) {
    this.settings = { ...settings };
    this.saveSettings();
  }
  
  // Get current notification settings
  getNotificationSettings(): IOSNotificationSettings {
    return this.settings;
  }
  
  // Send a test notification
  async sendTestNotification(title: string, options: NotificationOptions = {}): Promise<boolean> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) return false;
    }
    
    try {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        return false;
      }
      
      const mergedOptions = {
        body: 'This is a test notification from TABU',
        icon: '/tabu.png',
        badge: '/icons/icon-96.webp',
        ...options
      };
      
      // Use the service worker to show a notification if available
      if (this.serviceWorkerRegistration) {
        await this.serviceWorkerRegistration.showNotification(title, mergedOptions);
        console.log('Sent notification via service worker');
      } else {
        // Fallback to regular Notification API
        new Notification(title, mergedOptions);
        console.log('Sent notification via Notification API');
      }
      
      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  }
}

// React hook for using iOS PWA notifications
export function useIOSPWANotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const notificationService = IOSPWANotificationService.getInstance();
    
    // Check support
    setIsSupported(notificationService.supportsNotifications());
    setIsIOS(notificationService.isIOS());
    setIsPWA(notificationService.isPWA());
    
    // Check permission
    if (notificationService.supportsNotifications() && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
        setIsPermissionGranted(permission === 'granted');
      });
    }
  }, []);
  
  return {
    isSupported,
    isPermissionGranted,
    isIOS,
    isPWA,
    notificationService: IOSPWANotificationService.getInstance()
  };
}
