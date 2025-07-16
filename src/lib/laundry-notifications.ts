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

    // Try to set native Android timer first (with user choice)
    try {
      const useNativeTimer = await this.askUserForNativeTimer(timer);
      if (useNativeTimer) {
        await this.setNativeAndroidTimer(timer);
      }
    } catch (error) {
      console.log('Native timer not available or declined:', error);
    }

    // Schedule notification for cycle completion
    await this.scheduleCompletionNotification(timer);
    
    // Schedule reminder notification (5 minutes before completion for long cycles)
    if (duration > 10) {
      await this.scheduleReminderNotification(timer);
    }

    return timerId;
  }

  private async askUserForNativeTimer(timer: LaundryTimer): Promise<boolean> {
    return new Promise((resolve) => {
      // Only ask on Android
      if (Capacitor.getPlatform() !== 'android') {
        resolve(false);
        return;
      }

      const dialog = document.createElement('div');
      dialog.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4';
      dialog.innerHTML = `
        <div class="bg-background border rounded-lg p-6 max-w-sm w-full space-y-4">
          <div class="text-center">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Set Timer in Clock App?</h3>
            <p class="text-sm text-muted-foreground mb-4">
              Would you like to also set a ${timer.duration}-minute timer in your Android Clock app?
            </p>
          </div>
          
          <div class="space-y-2">
            <button id="use-native-btn" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              ⏰ Yes, Open Clock App
            </button>
            <button id="skip-native-btn" class="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              📱 Just Use App Notifications
            </button>
          </div>
          
          <div class="text-xs text-muted-foreground text-center">
            You'll still get notifications from TABU when the cycle completes
          </div>
        </div>
      `;

      document.body.appendChild(dialog);

      const useNativeBtn = dialog.querySelector('#use-native-btn');
      const skipNativeBtn = dialog.querySelector('#skip-native-btn');

      const cleanup = () => {
        document.body.removeChild(dialog);
      };

      useNativeBtn?.addEventListener('click', () => {
        cleanup();
        resolve(true);
      });

      skipNativeBtn?.addEventListener('click', () => {
        cleanup();
        resolve(false);
      });

      // Auto-skip after 10 seconds
      setTimeout(() => {
        if (document.body.contains(dialog)) {
          cleanup();
          resolve(false);
        }
      }, 10000);
    });
  }

  private async setNativeAndroidTimer(timer: LaundryTimer) {
    if (Capacitor.getPlatform() !== 'android') {
      throw new Error('Native timer only available on Android');
    }

    try {
      // Try to open Android Clock app with timer intent using window.open
      const timerUrl = `intent://timer/${timer.duration * 60}?message=${encodeURIComponent(`TABU: Machine ${timer.machineNumber} ${timer.cycleType} cycle`)}#Intent;scheme=timer;package=com.google.android.deskclock;end`;
      
      // This will try to open the default timer app with the timer set
      window.open(timerUrl, '_system');
      
      console.log(`Attempted to set native Android timer for ${timer.duration} minutes`);
    } catch (error) {
      // Fallback: try alternative methods
      try {
        // Try Google Clock app specifically
        const googleClockUrl = `intent://timer/${timer.duration * 60}#Intent;scheme=timer;package=com.google.android.deskclock;S.android.intent.extra.alarm.MESSAGE=TABU Machine ${timer.machineNumber} ${timer.cycleType};end`;
        window.open(googleClockUrl, '_system');
      } catch (fallbackError) {
        // Final fallback: try generic timer intent
        try {
          window.open(`timer:${timer.duration * 60}`, '_system');
        } catch (finalError) {
          console.log('Could not open native timer app:', finalError);
          throw finalError;
        }
      }
    }
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
            sound: 'default',
            attachments: undefined,
            actionTypeId: 'LAUNDRY_COMPLETE',
            extra: {
              timerId: timer.id,
              machineNumber: timer.machineNumber,
              cycleType: timer.cycleType
            },
            // Make it behave like a timer notification
            ongoing: false,
            autoCancel: false,
            largeIcon: 'res://drawable/ic_launcher',
            smallIcon: 'res://drawable/ic_notification'
          }
        ]
      });

      // Also schedule a persistent ongoing notification during the cycle
      await this.scheduleOngoingTimerNotification(timer);

      console.log(`Scheduled completion notification for timer ${timer.id}`);
    } catch (error) {
      console.error('Error scheduling completion notification:', error);
    }
  }

  private async scheduleOngoingTimerNotification(timer: LaundryTimer) {
    const ongoingNotificationId = parseInt(timer.id.replace(/\D/g, '')) % 10000 + 1000;
    
    try {
      // Create multiple notifications to simulate countdown (like Android timer)
      const updateIntervals = [1, 5, 10, 15, 30]; // Update at these minute marks
      
      for (const minutesFromNow of updateIntervals) {
        if (minutesFromNow < timer.duration) {
          const updateTime = new Date(Date.now() + minutesFromNow * 60 * 1000);
          const remainingMinutes = timer.duration - minutesFromNow;
          
          await LocalNotifications.schedule({
            notifications: [
              {
                title: `⏱️ Laundry Timer: ${remainingMinutes}m remaining`,
                body: `Machine ${timer.machineNumber} - ${timer.cycleType === 'wash' ? 'Washing' : 'Drying'} cycle`,
                id: ongoingNotificationId + minutesFromNow,
                schedule: { at: updateTime },
                sound: undefined,
                attachments: undefined,
                extra: {
                  timerId: timer.id,
                  machineNumber: timer.machineNumber,
                  cycleType: timer.cycleType,
                  isOngoing: true,
                  remainingMinutes: remainingMinutes
                },
                ongoing: true,
                autoCancel: false
              }
            ]
          });
        }
      }

      // Initial ongoing notification
      await LocalNotifications.schedule({
        notifications: [
          {
            title: `⏱️ Laundry Timer: ${timer.duration}m`,
            body: `Machine ${timer.machineNumber} - ${timer.cycleType === 'wash' ? 'Washing' : 'Drying'} cycle started`,
            id: ongoingNotificationId,
            schedule: { at: new Date(Date.now() + 1000) },
            sound: undefined,
            attachments: undefined,
            extra: {
              timerId: timer.id,
              machineNumber: timer.machineNumber,
              cycleType: timer.cycleType,
              isOngoing: true
            },
            ongoing: true,
            autoCancel: false
          }
        ]
      });

      console.log(`Scheduled ongoing timer notification for ${timer.id}`);
    } catch (error) {
      console.error('Error scheduling ongoing notification:', error);
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
      const ongoingNotificationId = notificationId + 1000;

      // Cancel all related notifications including timer updates
      const notificationsToCancel = [
        { id: notificationId }, // Completion
        { id: reminderNotificationId }, // Reminder
        { id: ongoingNotificationId }, // Initial ongoing
      ];

      // Add all timer update notifications
      const updateIntervals = [1, 5, 10, 15, 30];
      for (const interval of updateIntervals) {
        notificationsToCancel.push({ id: ongoingNotificationId + interval });
      }

      await LocalNotifications.cancel({
        notifications: notificationsToCancel
      });

      this.timers.delete(timerId);
      console.log(`Cancelled timer ${timerId} and all related notifications`);
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
