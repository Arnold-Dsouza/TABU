'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { BellIcon, XIcon } from 'lucide-react';

export default function IOSNotificationPermissionPrompt() {
  const [open, setOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission | 'unsupported' | null>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                 (window.navigator as any).standalone === true;
    setIsPWA(isPWA);

    // Check if notifications are supported
    const notificationsSupported = 'Notification' in window;

    if (notificationsSupported) {
      // Check current permission state
      setPermissionState(Notification.permission);
      
      // Show prompt if on iOS, running as PWA, and permission is not granted or denied
      if (iOS && isPWA && Notification.permission === 'default') {
        // Delay showing to not interrupt initial load
        const timer = setTimeout(() => setOpen(true), 2000);
        return () => clearTimeout(timer);
      }
    } else {
      setPermissionState('unsupported');
    }
  }, []);

  const handleRequestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      
      if (permission === 'granted') {
        // Show a sample notification to confirm it works
        setTimeout(() => {
          new Notification('Notifications Enabled!', {
            body: 'You will now receive notifications from TABU',
            icon: '/tabu.jpg'
          });
        }, 500);
      }
      
      setOpen(false);
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setPermissionState('denied');
      setOpen(false);
    }
  };

  // Only show for iOS devices running as PWA with default permission
  if (!isIOS || !isPWA || permissionState !== 'default') {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BellIcon className="h-5 w-5" />
            Enable Notifications
          </DialogTitle>
          <DialogDescription>
            Would you like to receive notifications from TABU? This will let you know about 
            important events and updates.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4 bg-muted rounded-md my-2">
          <p className="text-sm">
            Notifications are especially useful for:
          </p>
          <ul className="text-sm mt-2 list-disc pl-5 space-y-1">
            <li>Laundry completion alerts</li>
            <li>TABU facility opening hours</li>
            <li>Special events in cafeteria, bar and other spaces</li>
          </ul>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="sm:w-auto w-full"
          >
            Not Now
          </Button>
          <Button 
            type="button" 
            onClick={handleRequestPermission}
            className="sm:w-auto w-full"
          >
            Enable Notifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
