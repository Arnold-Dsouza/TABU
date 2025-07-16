'use client';

import { useState, useEffect, useCallback } from 'react';
import { laundryNotificationService, LaundryTimer } from '@/lib/laundry-notifications';
import { useToast } from '@/hooks/use-toast';
import { Capacitor } from '@capacitor/core';

export function useLaundryTimer() {
  const [activeTimers, setActiveTimers] = useState<LaundryTimer[]>([]);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize the service and check permissions
  useEffect(() => {
    const initializeService = async () => {
      if (!Capacitor.isNativePlatform()) {
        console.log('Not on mobile, notifications not available');
        return;
      }

      try {
        await laundryNotificationService.initialize();
        const enabled = await laundryNotificationService.areNotificationsEnabled();
        setIsNotificationsEnabled(enabled);
        
        // Set up the callback for when laundry is collected via notification
        laundryNotificationService.onLaundryCollected = (timerId: string) => {
          handleTimerComplete(timerId);
          toast({
            title: "Laundry Collected! 🧺",
            description: "Timer has been marked as complete.",
          });
        };

        // Load any existing timers
        refreshActiveTimers();
      } catch (error) {
        console.error('Error initializing laundry timer service:', error);
      }
    };

    initializeService();
  }, []);

  // Refresh active timers
  const refreshActiveTimers = useCallback(() => {
    const timers = laundryNotificationService.getActiveTimers();
    setActiveTimers(timers);
  }, []);

  // Start a new laundry cycle
  const startLaundryCycle = useCallback(async (
    machineNumber: number,
    cycleType: 'wash' | 'dry',
    duration: number
  ): Promise<string | null> => {
    if (!Capacitor.isNativePlatform()) {
      toast({
        title: "Notifications Not Available",
        description: "Timer notifications only work on mobile devices.",
        variant: "destructive"
      });
      return null;
    }

    if (!isNotificationsEnabled) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        toast({
          title: "Notifications Required",
          description: "Please enable notifications to use timer alerts.",
          variant: "destructive"
        });
        return null;
      }
    }

    setIsLoading(true);
    try {
      const timerId = await laundryNotificationService.startLaundryCycle(
        machineNumber,
        cycleType,
        duration
      );
      
      refreshActiveTimers();
      
      toast({
        title: `${cycleType === 'wash' ? 'Washing' : 'Drying'} Timer Started! ⏰`,
        description: `Machine ${machineNumber} - ${duration} minutes. You'll get notified when it's done!`,
      });

      return timerId;
    } catch (error) {
      console.error('Error starting laundry cycle:', error);
      toast({
        title: "Error Starting Timer",
        description: "Could not start the laundry timer. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isNotificationsEnabled, refreshActiveTimers, toast]);

  // Cancel a timer
  const cancelTimer = useCallback(async (timerId: string) => {
    try {
      await laundryNotificationService.cancelTimer(timerId);
      refreshActiveTimers();
      
      toast({
        title: "Timer Cancelled",
        description: "The laundry timer has been stopped.",
      });
    } catch (error) {
      console.error('Error cancelling timer:', error);
      toast({
        title: "Error",
        description: "Could not cancel the timer.",
        variant: "destructive"
      });
    }
  }, [refreshActiveTimers, toast]);

  // Mark timer as complete (called when user manually marks as done)
  const handleTimerComplete = useCallback((timerId: string) => {
    cancelTimer(timerId);
  }, [cancelTimer]);

  // Request notification permissions
  const requestNotificationPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const granted = await laundryNotificationService.requestNotificationPermissions();
      setIsNotificationsEnabled(granted);
      
      if (granted) {
        toast({
          title: "Notifications Enabled! 🔔",
          description: "You'll now receive alerts when your laundry is done.",
        });
      } else {
        toast({
          title: "Notifications Denied",
          description: "You can enable them later in your device settings.",
          variant: "destructive"
        });
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }, [toast]);

  // Get remaining time for a specific timer
  const getRemainingTime = useCallback((timerId: string): number => {
    return laundryNotificationService.getRemainingTime(timerId);
  }, []);

  // Get formatted remaining time string
  const getFormattedRemainingTime = useCallback((timerId: string): string => {
    const minutes = getRemainingTime(timerId);
    if (minutes <= 0) return "Finished";
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }, [getRemainingTime]);

  // Check if running on mobile
  const isMobile = Capacitor.isNativePlatform();

  return {
    // State
    activeTimers,
    isNotificationsEnabled,
    isLoading,
    isMobile,
    
    // Actions
    startLaundryCycle,
    cancelTimer,
    handleTimerComplete,
    requestNotificationPermissions,
    refreshActiveTimers,
    
    // Utilities
    getRemainingTime,
    getFormattedRemainingTime,
  };
}
