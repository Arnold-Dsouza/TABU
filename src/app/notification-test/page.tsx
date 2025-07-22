'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Bell, CheckCircle2, XCircle } from 'lucide-react';

export default function NotificationTestPage() {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') {
      setPermissionStatus('unsupported');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        setTestResult({
          success: true,
          message: 'Permission granted! You can now receive notifications.'
        });
      } else {
        setTestResult({
          success: false,
          message: permission === 'denied' 
            ? 'Permission denied. Please enable notifications in your browser settings.'
            : 'Permission prompt closed without a decision.'
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setTestResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const sendTestNotification = () => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
      return;
    }

    try {
      const notification = new Notification('TABU Test Notification', {
        body: 'This is a test notification from TABU!',
        icon: '/tabu.png',
        badge: '/icons/icon-96.webp',
        tag: 'test'
      });

      notification.onclick = () => {
        console.log('Notification clicked');
        window.focus();
        notification.close();
      };

      setTestResult({
        success: true,
        message: 'Test notification sent successfully!'
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      setTestResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Test
          </CardTitle>
          <CardDescription>
            Test if notifications are working on your device
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-md bg-muted">
            <div className="font-medium">Permission Status:</div>
            {permissionStatus === 'granted' ? (
              <span className="flex items-center text-green-500">
                <CheckCircle2 className="h-4 w-4 mr-1" /> Granted
              </span>
            ) : permissionStatus === 'denied' ? (
              <span className="flex items-center text-red-500">
                <XCircle className="h-4 w-4 mr-1" /> Denied
              </span>
            ) : permissionStatus === 'default' ? (
              <span className="flex items-center text-amber-500">
                <AlertCircle className="h-4 w-4 mr-1" /> Not decided
              </span>
            ) : (
              <span className="flex items-center text-gray-500">
                <XCircle className="h-4 w-4 mr-1" /> Not supported
              </span>
            )}
          </div>
          
          {testResult && (
            <div className={`p-3 rounded-md ${testResult.success ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
              <p className={testResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
                {testResult.message}
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {permissionStatus !== 'granted' 
                ? 'You need to grant notification permission before you can receive notifications.' 
                : 'You can now send a test notification to verify it works.'}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex-col gap-2">
          {permissionStatus !== 'granted' && permissionStatus !== 'unsupported' && (
            <Button 
              className="w-full" 
              onClick={requestPermission}
            >
              Request Permission
            </Button>
          )}
          
          {permissionStatus === 'granted' && (
            <Button 
              className="w-full" 
              onClick={sendTestNotification}
              variant="default"
            >
              Send Test Notification
            </Button>
          )}
          
          {permissionStatus === 'denied' && (
            <p className="text-xs text-center text-muted-foreground">
              You need to enable notifications in your browser settings for this site
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
