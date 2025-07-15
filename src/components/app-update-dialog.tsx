
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { checkForUpdates, downloadUpdate } from '@/lib/update-manager';
import type { UpdateInfo } from '@/lib/update-manager';
import { RefreshCw, Download, X } from 'lucide-react';

interface AppUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialUpdateInfo?: UpdateInfo | null;
}

export function AppUpdateDialog({ open, onOpenChange, initialUpdateInfo = null }: AppUpdateDialogProps) {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(initialUpdateInfo);
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'error'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      if (initialUpdateInfo?.isUpdateAvailable) {
        setUpdateInfo(initialUpdateInfo);
        setStatus('available');
      } else {
        handleCheckForUpdates();
      }
    } else {
      // Reset state when dialog is closed
      setStatus('idle');
      setUpdateInfo(null);
      setDownloadProgress(0);
    }
  }, [open, initialUpdateInfo]);

  const handleCheckForUpdates = async () => {
    setStatus('checking');
    try {
      const info = await checkForUpdates();
      setUpdateInfo(info);
      setStatus(info.isUpdateAvailable ? 'available' : 'not-available');
    } catch (error) {
      console.error('Update check failed:', error);
      setStatus('error');
      toast({
        title: 'Error',
        description: 'Could not check for updates. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadUpdate = async () => {
    if (!updateInfo?.downloadUrl) return;

    setStatus('downloading');
    setDownloadProgress(0);

    try {
      await downloadUpdate(updateInfo.downloadUrl, (progress) => {
        setDownloadProgress(progress);
      });
      toast({
        title: 'Download Complete',
        description: 'The update is ready. Please confirm to install.',
      });
      // The installation is prompted by the native layer in downloadUpdate
      onOpenChange(false); // Close dialog on success
    } catch (error) {
      console.error('Download failed:', error);
      setStatus('error');
      toast({
        title: 'Download Failed',
        description: 'The update could not be downloaded. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'checking':
        return (
          <>
            <DialogHeader>
                <DialogTitle>Checking for Updates</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <RefreshCw className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Searching for the latest version...</p>
            </div>
          </>
        );
      case 'available':
        return (
          <>
            <DialogHeader>
                <DialogTitle>Update Available</DialogTitle>
                <DialogDescription>
                  A new version ({updateInfo?.latestVersion}) is available! You are currently on version {updateInfo?.currentVersion}.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-4">
              <Button onClick={handleDownloadUpdate}>
                <Download className="mr-2 h-4 w-4" />
                Update
              </Button>
            </DialogFooter>
          </>
        );
      case 'not-available':
        return (
          <>
            <DialogHeader>
                <DialogTitle>No Update Available</DialogTitle>
                <DialogDescription>
                You are on the latest version ({updateInfo?.currentVersion}).
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                <Button onClick={handleCheckForUpdates}><RefreshCw className="h-4 w-4 mr-2" />Check Again</Button>
            </DialogFooter>
          </>
        );
      case 'downloading':
        return (
            <>
            <DialogHeader>
                <DialogTitle>Downloading Update</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">Downloading update... {Math.round(downloadProgress)}%</p>
                <Progress value={downloadProgress} />
            </div>
            </>
        );
      case 'error':
        return (
          <>
            <DialogHeader>
                <DialogTitle className="text-destructive">Update Error</DialogTitle>
                <DialogDescription>
                Something went wrong. Please close this window and try again.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-4">
                 <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            </DialogFooter>
          </>
        );
      default:
         return (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <p className="text-muted-foreground">Initializing...</p>
            </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
