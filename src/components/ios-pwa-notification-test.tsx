'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useIOSPWANotifications } from '../../pwa-ios/ios-notification-service';

export default function PWANotificationTest() {
  const { isSupported, isPermissionGranted, isIOS, isPWA, notificationService } = useIOSPWANotifications();
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);

  const handleTestNotification = async () => {
    try {
      // Initialize if not already initialized
      if (!isPermissionGranted) {
        await notificationService.initialize();
      }
      
      // Send test notification
      const result = await notificationService.sendTestNotification(
        'TABU Test Notification',
        {
          body: 'This is a test notification to verify iOS PWA notifications are working correctly.',
          icon: '/tabu.jpg',
          tag: 'test-notification',
          data: { test: true, timestamp: Date.now() }
        }
      );
      
      setTestResult({
        success: result,
        message: result 
          ? 'Test notification sent successfully! You should see it appear shortly.'
          : 'Failed to send test notification. Please check browser console for errors.'
      });
    } catch (error) {
      console.error('Error testing notification:', error);
      setTestResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>iOS PWA Notification Test</CardTitle>
        <CardDescription>
          Test PWA notifications on your iOS device
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="font-medium">iOS Device:</div>
          <div>{isIOS ? '✅ Yes' : '❌ No'}</div>
          
          <div className="font-medium">Installed as PWA:</div>
          <div>{isPWA ? '✅ Yes' : '❌ No'}</div>
          
          <div className="font-medium">Notifications Supported:</div>
          <div>{isSupported ? '✅ Yes' : '❌ No'}</div>
          
          <div className="font-medium">Permission Granted:</div>
          <div>{isPermissionGranted ? '✅ Yes' : '❌ No'}</div>
        </div>
        
        {testResult && (
          <Alert variant={testResult.success ? "default" : "destructive"}>
            <AlertTitle>{testResult.success ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>
              {testResult.message}
            </AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={handleTestNotification} 
          disabled={!isSupported}
          className="w-full"
        >
          Send Test Notification
        </Button>
        
        {!isPermissionGranted && isSupported && (
          <Button 
            variant="outline"
            onClick={() => notificationService.initialize()}
            className="w-full"
          >
            Request Notification Permission
          </Button>
        )}
        
        {!isPWA && isIOS && (
          <Alert>
            <AlertTitle>Not installed as PWA</AlertTitle>
            <AlertDescription>
              For the best experience with notifications, please install this app to your home screen.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
