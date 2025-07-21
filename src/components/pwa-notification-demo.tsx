'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useUnifiedNotifications } from '@/lib/unified-notification-service';
import { Badge } from './ui/badge';

export default function PWANotificationDemo() {
  const { notificationService, platformType } = useUnifiedNotifications();
  const [isSupported, setIsSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
  
  // Check notification support on mount
  useEffect(() => {
    if (!notificationService) return;
    
    const checkSupport = async () => {
      const supported = notificationService.supportsNotifications();
      setIsSupported(supported);
      
      if (supported) {
        try {
          const initialized = await notificationService.initialize();
          setIsInitialized(initialized);
          setPermissionStatus(initialized ? 'granted' : 'denied');
        } catch (error) {
          console.error('Error initializing notifications:', error);
          setPermissionStatus('error');
        }
      }
    };
    
    checkSupport();
  }, [notificationService]);
  
  const handleRequestPermission = async () => {
    if (!notificationService) return;
    
    try {
      const result = await notificationService.initialize();
      setIsInitialized(result);
      setPermissionStatus(result ? 'granted' : 'denied');
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setPermissionStatus('error');
    }
  };
  
  const handleSendTestNotification = async () => {
    if (isInitialized && notificationService) {
      await notificationService.sendNotification(
        'TABU Notification', 
        'This is a test notification from TABU!',
        Math.floor(Math.random() * 10000)
      );
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Notifications
          <Badge variant={platformType === 'unsupported' ? 'destructive' : 'default'}>
            {platformType === 'android-native' ? 'Android' : 
             platformType === 'ios-pwa' ? 'iOS PWA' : 'Unsupported'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Test and manage notification settings for your device
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isSupported ? (
          <div className="p-4 border rounded-md bg-muted">
            <p className="text-sm">
              Your device does not support notifications in this browser.
              {platformType === 'ios-pwa' && (
                <span> For iOS, make sure you've added this app to your home screen.</span>
              )}
            </p>
          </div>
        ) : !isInitialized ? (
          <div className="p-4 border rounded-md bg-muted">
            <p className="text-sm mb-3">
              Notification permission: <Badge variant="outline">{permissionStatus}</Badge>
            </p>
            <Button onClick={handleRequestPermission}>
              Request Permission
            </Button>
          </div>
        ) : (
          <div className="p-4 border rounded-md bg-muted">
            <p className="text-sm mb-3">
              Notification permission: <Badge variant="default" className="bg-green-500">Granted</Badge>
            </p>
            <p className="text-sm mb-3">
              You can now receive notifications from TABU.
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSendTestNotification}
          disabled={!isInitialized}
        >
          Send Test Notification
        </Button>
      </CardFooter>
    </Card>
  );
}
