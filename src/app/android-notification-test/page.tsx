'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Bell, CheckCircle2, XCircle, Smartphone, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Capacitor } from '@capacitor/core';
import Link from 'next/link';

// Remove metadata export from client component

export default function AndroidNotificationTestPage() {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>(
    'default'
  );
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [platform, setPlatform] = useState<'android-pwa' | 'android-native' | 'other'>('other');
  const [isClient, setIsClient] = useState(false);
  const [serviceWorkerActive, setServiceWorkerActive] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Detect platform
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                 (window.navigator as any).standalone === true;
    const isNative = Capacitor.isNativePlatform();

    if (isAndroid && isPWA) {
      setPlatform('android-pwa');
    } else if (isAndroid && isNative) {
      setPlatform('android-native');
    } else {
      setPlatform('other');
    }

    // Check current permission status
    if (typeof Notification !== 'undefined') {
      setPermissionStatus(Notification.permission);
    } else {
      setPermissionStatus('unsupported');
    }

    // Check if service worker is active
    if ('serviceWorker' in navigator) {
      setServiceWorkerActive(!!navigator.serviceWorker.controller);
    }
  }, []);

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
      // First check if we can use the service worker for better notification support
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification('TABU Android Test Notification', {
            body: 'This is a test notification from TABU!',
            icon: '/tabu.png',
            badge: '/icons/icon-96.webp',
            tag: 'test',
            ...(({
              vibrate: [200, 100, 200],
              requireInteraction: true,
              actions: [
                {
                  action: 'open',
                  title: 'Open App'
                },
                {
                  action: 'dismiss',
                  title: 'Dismiss'
                }
              ]
            } as any))
          });
        });
      } else {
        // Fallback to basic notification
        const notification = new Notification('TABU Android Test Notification', {
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
      }

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

  const testServiceWorker = () => {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      setTestResult({
        success: false,
        message: 'No active service worker found. Try refreshing the page.'
      });
      return;
    }

    try {
      // Send a message to the service worker to show a test notification
      navigator.serviceWorker.controller.postMessage({
        type: 'TEST_NOTIFICATION'
      });

      setTestResult({
        success: true,
        message: 'Service worker notification test initiated.'
      });
    } catch (error) {
      console.error('Error testing service worker:', error);
      setTestResult({
        success: false,
        message: `Service worker error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) {
      setTestResult({
        success: false,
        message: 'Service workers are not supported in this browser.'
      });
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });

      setTestResult({
        success: true,
        message: 'Service worker registered successfully!'
      });

      // Force service worker activation if it's waiting
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      // Update service worker active status
      setServiceWorkerActive(!!navigator.serviceWorker.controller);
    } catch (error) {
      console.error('Error registering service worker:', error);
      setTestResult({
        success: false,
        message: `Registration error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  if (!isClient) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Android Notification Test
          </CardTitle>
          <CardDescription>
            Test notifications on your Android device
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-md bg-muted">
            <div className="font-medium">Platform:</div>
            <div className="font-medium">
              {platform === 'android-pwa' && 'Android PWA'}
              {platform === 'android-native' && 'Android Native App'}
              {platform === 'other' && 'Other Platform'}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-md bg-muted">
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
          
          <div className="flex items-center justify-between p-3 rounded-md bg-muted">
            <div className="font-medium">Service Worker:</div>
            {serviceWorkerActive ? (
              <span className="flex items-center text-green-500">
                <CheckCircle2 className="h-4 w-4 mr-1" /> Active
              </span>
            ) : (
              <span className="flex items-center text-amber-500">
                <AlertCircle className="h-4 w-4 mr-1" /> Not Active
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
              <Bell className="mr-2 h-4 w-4" />
              Request Permission
            </Button>
          )}
          
          {permissionStatus === 'granted' && (
            <>
              <Button 
                className="w-full" 
                onClick={sendTestNotification}
                variant="default"
              >
                <Bell className="mr-2 h-4 w-4" />
                Send Test Notification
              </Button>
              
              <Button 
                className="w-full" 
                onClick={testServiceWorker}
                variant="outline"
                disabled={!serviceWorkerActive}
              >
                Test Service Worker Notification
              </Button>
            </>
          )}
          
          {!serviceWorkerActive && (
            <Button 
              className="w-full" 
              onClick={registerServiceWorker}
              variant="outline"
            >
              Register Service Worker
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
