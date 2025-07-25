'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AndroidPWANotificationHelper() {
  const [isPWA, setIsPWA] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<PermissionState | null>(null);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if this is Android
      setIsAndroid(/Android/i.test(navigator.userAgent));
      
      // Check if this is running as a PWA
      const isPwaCheck = window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true;
      setIsPWA(isPwaCheck);
      
      // Check notification permission
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
        
        // Only show notification prompt for Android PWA with default permission
        setShowNotificationPrompt(
          isPwaCheck && 
          /Android/i.test(navigator.userAgent) && 
          Notification.permission !== 'granted'
        );
      }
    }
  }, []);

  // Only show for Android PWA with no notification permission
  if (!showNotificationPrompt) {
    return null;
  }

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Notifications Not Supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive",
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        setShowNotificationPrompt(false);
        
        toast({
          title: "Notifications Enabled!",
          description: "You'll now receive notifications from TABU",
        });
        
        // Register the service worker if needed
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((registration) => {
            // Send a test notification
            setTimeout(() => {
              registration.showNotification("TABU Notifications Working!", {
                body: "Notifications are now working on your Android device!",
                icon: "/tabu.png",
                badge: "/icons/icon-96.webp"
              });
            }, 1000);
          });
        } else {
          // Fallback to regular notification
          new Notification("TABU Notification Test", {
            body: "Notifications are now working on your Android device!",
            icon: "/tabu.png"
          });
        }
      } else if (permission === 'denied') {
        toast({
          title: "Notifications Blocked",
          description: "Please enable notifications in your browser settings to receive updates.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Permission Error",
        description: "Could not request notification permission. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          Enable Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2 text-sm">
        <p>
          To receive notifications on your Android device, please enable notification permissions.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={requestNotificationPermission}
        >
          <Bell className="mr-2 h-4 w-4" />
          Enable Notifications
        </Button>
      </CardFooter>
    </Card>
  );
}
