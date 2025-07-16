'use client';

import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export interface TabuNotificationSettings {
  [serviceId: string]: {
    opening: boolean;
    events: boolean;
  };
}

export interface TabuEvent {
  id: string;
  serviceId: string;
  serviceName: string;
  title: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  type: 'opening' | 'event';
}

class TabuNotificationService {
  private isInitialized = false;
  private settings: TabuNotificationSettings = {};

  async initialize() {
    if (this.isInitialized || !Capacitor.isNativePlatform()) {
      return;
    }

    try {
      // Request permission for notifications
      const permission = await LocalNotifications.requestPermissions();
      
      if (permission.display === 'granted') {
        console.log('TABU notification permissions granted');
        this.isInitialized = true;
        
        // Listen for notification actions
        LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
          console.log('TABU notification action performed:', notification);
          this.handleNotificationAction(notification);
        });

        // Listen for notification received (when app is in foreground)
        LocalNotifications.addListener('localNotificationReceived', (notification) => {
          console.log('TABU notification received:', notification);
        });

        // Load settings
        this.loadSettings();
      } else {
        console.warn('TABU notification permissions denied');
      }
    } catch (error) {
      console.error('Error initializing TABU notifications:', error);
    }
  }

  // Load settings from localStorage
  private loadSettings() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tabuNotificationSettings');
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

  // Save settings to localStorage
  private saveSettings() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tabuNotificationSettings', JSON.stringify(this.settings));
    }
  }

  // Update notification settings
  setNotificationSettings(settings: TabuNotificationSettings) {
    this.settings = { ...settings };
    this.saveSettings();
  }

  // Get current settings
  getNotificationSettings(): TabuNotificationSettings {
    return this.settings;
  }

  // Schedule a TABU event notification
  async scheduleEventNotification(event: TabuEvent) {
    if (!this.isInitialized || !Capacitor.isNativePlatform()) {
      return;
    }

    // Check if notifications are enabled for this service and type
    const serviceSettings = this.settings[event.serviceId];
    const notificationKey = event.type === 'event' ? 'events' : event.type;
    if (!serviceSettings || !serviceSettings[notificationKey as keyof typeof serviceSettings]) {
      console.log(`Notifications disabled for ${event.serviceId} ${event.type}`);
      return;
    }

    try {
      const notificationId = this.generateNotificationId(event.id);
      
      await LocalNotifications.schedule({
        notifications: [
          {
            title: this.getNotificationTitle(event),
            body: this.getNotificationBody(event),
            id: notificationId,
            schedule: { at: event.startTime },
            sound: 'default',
            extra: {
              eventId: event.id,
              serviceId: event.serviceId,
              eventType: event.type,
              isTabuEvent: true
            }
          }
        ]
      });

      console.log(`Scheduled TABU notification for ${event.serviceName} ${event.type}: ${event.title}`);
    } catch (error) {
      console.error('Error scheduling TABU notification:', error);
    }
  }

  // Cancel a scheduled notification
  async cancelEventNotification(eventId: string) {
    if (!this.isInitialized || !Capacitor.isNativePlatform()) {
      return;
    }

    try {
      const notificationId = this.generateNotificationId(eventId);
      
      await LocalNotifications.cancel({
        notifications: [{ id: notificationId }]
      });

      console.log(`Cancelled TABU notification for event: ${eventId}`);
    } catch (error) {
      console.error('Error cancelling TABU notification:', error);
    }
  }

  // Generate notification ID from event ID
  private generateNotificationId(eventId: string): number {
    // Convert event ID to a number for notification ID
    // Use a hash-like approach to avoid collisions
    let hash = 0;
    for (let i = 0; i < eventId.length; i++) {
      const char = eventId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Ensure positive number and in valid range (adding 20000 to avoid collision with laundry notifications)
    return Math.abs(hash % 10000) + 20000;
  }

  // Get notification title based on event type
  private getNotificationTitle(event: TabuEvent): string {
    switch (event.type) {
      case 'opening':
        return `${event.serviceName} is Now Open! 🎉`;
      case 'event':
        return `${event.serviceName} Event Starting! 📅`;
      default:
        return `${event.serviceName} Notification`;
    }
  }

  // Get notification body
  private getNotificationBody(event: TabuEvent): string {
    switch (event.type) {
      case 'opening':
        return `${event.serviceName} is now open. Come and enjoy!`;
      case 'event':
        return event.description || `${event.title} is starting now at ${event.serviceName}`;
      default:
        return event.description || event.title;
    }
  }

  // Handle notification actions
  private async handleNotificationAction(notification: any) {
    const { actionId, notification: notif } = notification;
    const eventId = notif.extra?.eventId;
    const serviceId = notif.extra?.serviceId;

    console.log(`TABU notification action: ${actionId} for service: ${serviceId}`);
    
    // You can add specific actions here if needed
    // For now, we'll just log the action
  }

  // Manually trigger a test notification (for testing purposes)
  async sendTestNotification(serviceId: string, serviceName: string, type: 'opening' | 'event') {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const testEvent: TabuEvent = {
      id: `test-${serviceId}-${Date.now()}`,
      serviceId,
      serviceName,
      title: type === 'opening' ? 'Test Opening' : 'Test Event',
      description: type === 'opening' 
        ? `${serviceName} is now open for testing!`
        : `Test event at ${serviceName}`,
      startTime: new Date(Date.now() + 2000), // 2 seconds from now
      type
    };

    await this.scheduleEventNotification(testEvent);
  }

  // Check if notifications are enabled
  async areNotificationsEnabled(): Promise<boolean> {
    try {
      const permission = await LocalNotifications.checkPermissions();
      return permission.display === 'granted';
    } catch {
      return false;
    }
  }

  // Request notification permissions
  async requestNotificationPermissions(): Promise<boolean> {
    try {
      const permission = await LocalNotifications.requestPermissions();
      return permission.display === 'granted';
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const tabuNotificationService = new TabuNotificationService();
