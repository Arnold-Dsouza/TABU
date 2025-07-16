'use client';

import { Capacitor } from '@capacitor/core';
import { registerPlugin } from '@capacitor/core';

// Define the plugin interface
export interface AndroidTimerPlugin {
  startTimer(options: { 
    durationSeconds: number; 
    message: string; 
    skipUI?: boolean; 
  }): Promise<{ success: boolean; message?: string; error?: string }>;
  
  openClockApp(): Promise<{ success: boolean; message?: string; error?: string }>;
  
  openTimersPage(): Promise<{ success: boolean; message?: string; error?: string }>;
  
  setAlarm(options: { 
    hour: number; 
    minutes: number; 
    message: string; 
    skipUI?: boolean; 
  }): Promise<{ success: boolean; message?: string; error?: string }>;
}

// Register the plugin
const AndroidTimer = registerPlugin<AndroidTimerPlugin>('AndroidTimer');

export interface AndroidTimerService {
  startNativeTimer: (durationMinutes: number, label: string) => Promise<boolean>;
  openClockApp: () => Promise<boolean>;
  openTimersPage: () => Promise<boolean>;
  setAlarm: (hour: number, minutes: number, message: string) => Promise<boolean>;
}

class AndroidNativeTimerService implements AndroidTimerService {
  
  /**
   * Start Android's built-in timer with a specific duration and label
   */
  async startNativeTimer(durationMinutes: number, label: string): Promise<boolean> {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
      console.log('Native timer only available on Android');
      return false;
    }

    try {
      const durationSeconds = durationMinutes * 60;
      
      const result = await AndroidTimer.startTimer({
        durationSeconds,
        message: label,
        skipUI: false // Show the timer UI so user can see it
      });

      if (result.success) {
        console.log(`Started Android timer: ${durationMinutes} minutes for "${label}"`);
        return true;
      } else {
        console.error('Failed to start timer:', result.error);
        
        // Fallback: Open timers page
        const fallbackResult = await AndroidTimer.openTimersPage();
        return fallbackResult.success;
      }
      
    } catch (error) {
      console.error('Error starting native timer:', error);
      
      // Final fallback: Open clock app
      try {
        const clockResult = await AndroidTimer.openClockApp();
        return clockResult.success;
      } catch (clockError) {
        console.error('Error opening clock app:', clockError);
        return false;
      }
    }
  }

  /**
   * Open Android's clock app directly
   */
  async openClockApp(): Promise<boolean> {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
      console.log('Clock app only available on Android');
      return false;
    }

    try {
      const result = await AndroidTimer.openClockApp();
      
      if (result.success) {
        console.log('Opened clock app successfully');
        return true;
      } else {
        console.error('Failed to open clock app:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error opening clock app:', error);
      return false;
    }
  }

  /**
   * Open timers page specifically
   */
  async openTimersPage(): Promise<boolean> {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
      console.log('Timers page only available on Android');
      return false;
    }

    try {
      const result = await AndroidTimer.openTimersPage();
      
      if (result.success) {
        console.log('Opened timers page successfully');
        return true;
      } else {
        console.error('Failed to open timers page:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error opening timers page:', error);
      return false;
    }
  }

  /**
   * Set an alarm for a specific time
   */
  async setAlarm(hour: number, minutes: number, message: string): Promise<boolean> {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
      console.log('Alarm setting only available on Android');
      return false;
    }

    try {
      const result = await AndroidTimer.setAlarm({
        hour,
        minutes,
        message,
        skipUI: false
      });

      if (result.success) {
        console.log(`Set alarm for ${hour}:${minutes.toString().padStart(2, '0')} - "${message}"`);
        return true;
      } else {
        console.error('Failed to set alarm:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error setting alarm:', error);
      return false;
    }
  }
}

// Create and export singleton instance
export const androidTimerService = new AndroidNativeTimerService();

/**
 * React hook for using Android native timers
 */
export function useAndroidTimer() {
  const isAndroid = Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';

  const startTimer = async (durationMinutes: number, label: string): Promise<boolean> => {
    if (!isAndroid) {
      console.log('Android timer not available on this platform');
      return false;
    }

    return await androidTimerService.startNativeTimer(durationMinutes, label);
  };

  const openClockApp = async (): Promise<boolean> => {
    if (!isAndroid) {
      console.log('Clock app not available on this platform');
      return false;
    }

    return await androidTimerService.openClockApp();
  };

  const openTimers = async (): Promise<boolean> => {
    if (!isAndroid) {
      console.log('Timer app not available on this platform');
      return false;
    }

    return await androidTimerService.openTimersPage();
  };

  const setAlarm = async (hour: number, minutes: number, message: string): Promise<boolean> => {
    if (!isAndroid) {
      console.log('Alarm setting not available on this platform');
      return false;
    }

    return await androidTimerService.setAlarm(hour, minutes, message);
  };

  return {
    isAndroid,
    startTimer,
    openClockApp,
    openTimers,
    setAlarm
  };
}
