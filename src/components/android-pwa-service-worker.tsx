'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AndroidPWAServiceWorkerRegistration() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAndroidPWA, setIsAndroidPWA] = useState(false);
  const [isPushSubscribed, setIsPushSubscribed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if this is Android and running as a PWA
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator as any).standalone === true;
    
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
          
          // Force activation if needed
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        } else {
          console.log('Service worker is not yet controlling the page');
          // Listen for controller change
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service worker now controlling the page');
          });
        }

        // Subscribe to push notifications if permission is granted
        await trySubscribeToPush(registration);
      } catch (error) {
        console.error('Error registering Android PWA service worker:', error);
      }
    };

    registerServiceWorker();
  }, []);

  // Helper function to convert base64 to Uint8Array for applicationServerKey
  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Try to subscribe to push notifications
  async function trySubscribeToPush(registration: ServiceWorkerRegistration) {
    try {
      // Check if push is supported and permission is granted
      if ('pushManager' in registration && Notification.permission === 'granted') {
        // Check for existing subscription
        let subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
          console.log('Already subscribed to push notifications:', subscription);
          setIsPushSubscribed(true);
        } else {
          console.log('Attempting to subscribe to push notifications...');
          
          // This is a placeholder VAPID key for development - in production use your own key
          const applicationServerKey = urlBase64ToUint8Array(
            'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
          );
          
          try {
            subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey
            });
            
            console.log('Successfully subscribed to push notifications:', subscription);
            setIsPushSubscribed(true);
            
            // You would typically send this subscription to your server
            // sendSubscriptionToServer(subscription);
            
            // Show success toast
            toast({
              title: "Notifications Ready",
              description: "You'll now receive notifications on your Android device",
            });
            
            // Send a test notification after subscription
            setTimeout(() => {
              registration.showNotification("TABU Notifications Active!", {
                body: "Your Android device is now set up to receive TABU notifications",
                icon: "/tabu.png",
                badge: "/icons/icon-96.webp"
              });
            }, 2000);
          } catch (err) {
            console.error('Failed to subscribe to push notifications:', err);
          }
        }
      } else {
        console.log('Push notifications not supported or permission not granted');
      }
    } catch (error) {
      console.error('Error checking push subscription:', error);
    }
  }

  // This is a headless component that doesn't render anything
  return null;
}
