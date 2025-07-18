import { Capacitor } from '@capacitor/core';

export const initializeMobileApp = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Mobile app initialized successfully
      console.log('Mobile app initialized on platform:', Capacitor.getPlatform());
    } catch (error) {
      console.error('Error initializing mobile app:', error);
    }
  }
};

export const isMobileApp = () => {
  return Capacitor.isNativePlatform();
};

export const getPlatform = () => {
  return Capacitor.getPlatform();
};
