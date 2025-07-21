'use client';

import IOSPWANotificationTest from '@/components/ios-pwa-notification-test';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PWATestPage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>PWA Notification Test Page</CardTitle>
          <CardDescription>
            Use this page to test and troubleshoot iOS PWA notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IOSPWANotificationTest />
        </CardContent>
      </Card>
    </div>
  );
}
