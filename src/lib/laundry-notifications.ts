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

    // Show initial start notification
    await this.showStartNotification(timer);
    
    // Schedule completion notification
    await this.scheduleCompletionNotification(timer);
    
    // Schedule 5-minute reminder notification (for cycles longer than 5 minutes)
    if (duration > 5) {
      await this.schedule5MinuteReminderNotification(timer);
    }

    // Schedule 1-minute reminder notification (for cycles longer than 1 minute)
    if (duration > 1) {
      await this.schedule1MinuteReminderNotification(timer);
    }

    return timerId;
  }

  private async scheduleCompletionNotification(timer: LaundryTimer) {
    const notificationId = parseInt(timer.id.replace(/\D/g, '')) % 10000; // Convert to number

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: `Machine Cycle Completed! 🧺`,
            body: `Collect your clothes as soon as possible.`,
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

  // Show initial start notification
  private async showStartNotification(timer: LaundryTimer) {
    const notificationId = parseInt(timer.id.replace(/\D/g, '')) % 10000 + 100; // Start notification ID
    const totalTimeText = this.formatTimeDisplay(timer.duration * 60 * 1000); // Convert minutes to milliseconds

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: `Machine Started 🚀`,
            body: totalTimeText,
            id: notificationId,
            schedule: { at: new Date(Date.now() + 100) }, // Show immediately
            sound: 'default',
            extra: {
              timerId: timer.id,
              machineNumber: timer.machineNumber,
              cycleType: timer.cycleType,
              isStart: true
            }
          }
        ]
      });

      console.log(`Showed start notification for timer ${timer.id}`);
    } catch (error) {
      console.error('Error showing start notification:', error);
    }
  }

  private async schedule5MinuteReminderNotification(timer: LaundryTimer) {
    const reminderTime = new Date(timer.endTime.getTime() - 5 * 60 * 1000); // 5 minutes before
    const notificationId = parseInt(timer.id.replace(/\D/g, '')) % 10000 + 5000; // Different ID for 5-min reminder

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: `Machine Cycle Almost Done! ⏰`,
            body: `00:05:00`,
            id: notificationId,
            schedule: { at: reminderTime },
            sound: 'default',
            extra: {
              timerId: timer.id,
              machineNumber: timer.machineNumber,
              cycleType: timer.cycleType,
              isReminder5Min: true
            }
          }
        ]
      });

      console.log(`Scheduled 5-minute reminder notification for timer ${timer.id}`);
    } catch (error) {
      console.error('Error scheduling 5-minute reminder notification:', error);
    }
  }

  private async schedule1MinuteReminderNotification(timer: LaundryTimer) {
    const reminderTime = new Date(timer.endTime.getTime() - 1 * 60 * 1000); // 1 minute before
    const notificationId = parseInt(timer.id.replace(/\D/g, '')) % 10000 + 1000; // Different ID for 1-min reminder

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: `Machine Cycle Finishing Soon! 🔔`,
            body: `00:01:00`,
            id: notificationId,
            schedule: { at: reminderTime },
            sound: 'default',
            extra: {
              timerId: timer.id,
              machineNumber: timer.machineNumber,
              cycleType: timer.cycleType,
              isReminder1Min: true
            }
          }
        ]
      });

      console.log(`Scheduled 1-minute reminder notification for timer ${timer.id}`);
    } catch (error) {
      console.error('Error scheduling 1-minute reminder notification:', error);
    }
  }

  async cancelTimer(timerId: string) {
    const timer = this.timers.get(timerId);
    if (!timer) return;

    try {
      const notificationId = parseInt(timerId.replace(/\D/g, '')) % 10000;
      const startNotificationId = notificationId + 100;
      const reminder5MinNotificationId = notificationId + 5000;
      const reminder1MinNotificationId = notificationId + 1000;

      // Cancel all notifications for this timer
      await LocalNotifications.cancel({
        notifications: [
          { id: notificationId }, // Completion notification
          { id: startNotificationId }, // Start notification (if still showing)
          { id: reminder5MinNotificationId }, // 5-minute reminder
          { id: reminder1MinNotificationId } // 1-minute reminder
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

  // Format time for display in HH:MM:SS format
  private formatTimeDisplay(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
