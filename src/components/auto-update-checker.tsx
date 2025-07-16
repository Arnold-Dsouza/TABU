'use client';

import { useEffect, useState } from 'react';
import { checkForUpdates } from '@/lib/update-manager';
import { AppUpdateDialog } from '@/components/app-update-dialog';
import type { UpdateInfo } from '@/lib/update-manager';
import { Capacitor } from '@capacitor/core';

export function AutoUpdateChecker() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Only check for updates on native platforms
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    // Check for updates 5 seconds after app loads to avoid blocking UI
    const timeoutId = setTimeout(async () => {
      try {
        const info = await checkForUpdates();
        if (info.isUpdateAvailable) {
          setUpdateInfo(info);
          setShowDialog(true);
        }
      } catch (error) {
        console.log('Auto update check failed:', error);
        // Silently fail - don't bother user with auto-check errors
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <AppUpdateDialog 
      open={showDialog} 
      onOpenChange={setShowDialog}
      initialUpdateInfo={updateInfo}
    />
  );
}
