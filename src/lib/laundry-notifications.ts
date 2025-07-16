'use client';

import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export interface LaundryTimer {
  id: string;
  machineNumber: number;
  cycleType: 'wash' | 'dry';
  duration: number; // in minutes
  startTime: Date;
  endTime: Date;
}

class LaundryNotificationService {
  private timers: Map<string, LaundryTimer> = new Map();
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized || !Capacitor.isNativePlatform()) {
      return;
    }

    try {
      // Request permission for notifications
      const permission = await LocalNotifications.requestPermissions();
      
      if (permission.display === 'granted') {
        console.log('Notification permissions granted');
        this.isInitialized = true;
        
        // Listen for notification actions
        LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
          console.log('Notification action performed:', notification);
          this.handleNotificationAction(notification);
        });

        // Listen for notification received (when app is in foreground)
        LocalNotifications.addListener('localNotificationReceived', (notification) => {
          console.log('Notification received:', notification);
        });

      } else {
        console.warn('Notification permissions denied');
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  async startLaundryCycle(machineNumber: number, cycleType: 'wash' | 'dry', duration: number): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const timerId = `laundry-${machineNumber}-${cycleType}-${Date.now()}`;
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    const timer: LaundryTimer = {
      id: timerId,
      machineNumber,
      cycleType,
      duration,
      startTime,
      endTime
    };

    this.timers.set(timerId, timer);

    // Schedule notification for cycle completion
    await this.scheduleCompletionNotification(timer);
    
    // Schedule reminder notification (5 minutes before completion for long cycles)
    if (duration > 10) {
      await this.scheduleReminderNotification(timer);
    }

    return timerId;
  }

  private async scheduleCompletionNotification(timer: LaundryTimer) {
    const notificationId = parseInt(timer.id.replace(/\D/g, '')) % 10000; // Convert to number

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: `${timer.cycleType === 'wash' ? 'Washing' : 'Drying'} Complete! 🧺`,
            body: `Machine ${timer.machineNumber} has finished the ${timer.cycleType} cycle. Your laundry is ready!`,
            id: notificationId,
            schedule: { at: timer.endTime },
            sound: 'beep.wav',
            attachments: undefined,
            actionTypeId: 'LAUNDRY_COMPLETE',
            extra: {
              timerId: timer.id,
              machineNumber: timer.machineNumber,
              cycleType: timer.cycleType
            }
          }
        ]
      });

      console.log(`Scheduled completion notification for timer ${timer.id}`);
    } catch (error) {
      console.error('Error scheduling completion notification:', error);
    }
  }

  private async scheduleReminderNotification(timer: LaundryTimer) {
    const reminderTime = new Date(timer.endTime.getTime() - 5 * 60 * 1000); // 5 minutes before
    const notificationId = parseInt(timer.id.replace(/\D/g, '')) % 10000 + 5000; // Different ID for reminder

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: `${timer.cycleType === 'wash' ? 'Washing' : 'Drying'} Almost Done! ⏰`,
            body: `Machine ${timer.machineNumber} will finish in 5 minutes. Get ready to collect your laundry!`,
            id: notificationId,
            schedule: { at: reminderTime },
            sound: 'default',
            extra: {
              timerId: timer.id,
              machineNumber: timer.machineNumber,
              cycleType: timer.cycleType,
              isReminder: true
            }
          }
        ]
      });

      console.log(`Scheduled reminder notification for timer ${timer.id}`);
    } catch (error) {
      console.error('Error scheduling reminder notification:', error);
    }
  }

  async cancelTimer(timerId: string) {
    const timer = this.timers.get(timerId);
    if (!timer) return;

    try {
      const notificationId = parseInt(timerId.replace(/\D/g, '')) % 10000;
      const reminderNotificationId = notificationId + 5000;

      // Cancel both completion and reminder notifications
      await LocalNotifications.cancel({
        notifications: [
          { id: notificationId },
          { id: reminderNotificationId }
        ]
      });

      this.timers.delete(timerId);
      console.log(`Cancelled timer ${timerId}`);
    } catch (error) {
      console.error('Error cancelling timer:', error);
    }
  }

  private async handleNotificationAction(notification: any) {
    const { actionId, notification: notif } = notification;
    const timerId = notif.extra?.timerId;

    switch (actionId) {
      case 'mark_collected':
        if (timerId) {
          this.cancelTimer(timerId);
          // You can emit an event here to update the UI
          this.onLaundryCollected?.(timerId);
        }
        break;

      case 'snooze_5min':
        if (timerId) {
          // Schedule another notification in 5 minutes
          await this.scheduleSnoozeNotification(timerId);
        }
        break;
    }
  }

  private async scheduleSnoozeNotification(timerId: string) {
    const timer = this.timers.get(timerId);
    if (!timer) return;

    const snoozeTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    const notificationId = parseInt(timerId.replace(/\D/g, '')) % 10000 + 9000; // Different ID for snooze

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: `Don't Forget Your Laundry! 🔔`,
            body: `Machine ${timer.machineNumber} finished ${timer.cycleType}ing. Please collect your laundry.`,
            id: notificationId,
            schedule: { at: snoozeTime },
            sound: 'default',
            extra: {
              timerId: timer.id,
              machineNumber: timer.machineNumber,
              cycleType: timer.cycleType,
              isSnooze: true
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error scheduling snooze notification:', error);
    }
  }

  // Get all active timers
  getActiveTimers(): LaundryTimer[] {
    return Array.from(this.timers.values()).filter(timer => 
      timer.endTime.getTime() > Date.now()
    );
  }

  // Get remaining time for a timer
  getRemainingTime(timerId: string): number {
    const timer = this.timers.get(timerId);
    if (!timer) return 0;
    
    const remaining = timer.endTime.getTime() - Date.now();
    return Math.max(0, Math.floor(remaining / 1000 / 60)); // in minutes
  }

  // Event callback for when laundry is collected
  onLaundryCollected?: (timerId: string) => void;

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
export const laundryNotificationService = new LaundryNotificationService();
