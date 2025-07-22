'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AndroidPWAServiceWorkerRegistration() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAndroidPWA, setIsAndroidPWA] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if this is Android and running as a PWA
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  window.navigator.standalone === true;
    
    setIsAndroidPWA(isAndroid && isPWA);

    // Only proceed if this is Android PWA
    if (!(isAndroid && isPWA)) return;
    
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported in this browser.');
      return;
    }

    const registerServiceWorker = async () => {
      try {
        // Register the service worker
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/'
        });
        
        setIsRegistered(true);
        console.log('Android PWA service worker registered successfully:', registration);
        
        // Check for controller change (indicates the service worker is active)
        if (navigator.serviceWorker.controller) {
          console.log('Service worker is already controlling the page');
        } else {
          console.log('Service worker is not yet controlling the page');
          // Listen for controller change
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service worker now controlling the page');
          });
        }
      } catch (error) {
        console.error('Error registering Android PWA service worker:', error);
      }
    };

    registerServiceWorker();
  }, []);

  // This is a headless component that doesn't render anything
  return null;
}
