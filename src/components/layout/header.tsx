
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Settings, Trash2, WashingMachine, MessageSquare, Languages, Sun, Moon, Laptop, AppWindow, Bell, Users, Download, Info, RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FeedbackForm } from '../feedback-form';
import { NotificationSettings } from '../notification-settings';
import { SidebarTrigger } from '../ui/sidebar';
import { ThemeToggle } from '../theme-toggle';
import { db, auth } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { Capacitor } from '@capacitor/core';

interface HeaderProps {
  currentUser: string | null;
  title?: string;
}

export default function Header({ currentUser, title = 'LaundryView' }: HeaderProps) {
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'checking' | 'uptodate' | 'available' | 'error'>('uptodate');
  const [latestVersion, setLatestVersion] = useState('1.1.3');
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const { setTheme } = useTheme();

  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('isLoggedIn', '==', true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOnlineUsersCount(snapshot.size); 
    }, (error) => {
      console.error("Error fetching online users count:", error);
    });

    return () => unsubscribe();
  }, []);

  const checkForUpdates = async () => {
    setIsCheckingUpdates(true);
    setUpdateStatus('checking');
    
    try {
      // Check GitHub releases for latest APK version
      const response = await fetch('https://api.github.com/repos/Arnold-Dsouza/TABU/releases/latest');
      const data = await response.json();
      
      if (data.tag_name) {
        const latestVer = data.tag_name.replace('v', '');
        setLatestVersion(latestVer);
        
        // Find APK download URL
        const apkAsset = data.assets?.find((asset: any) => 
          asset.name.includes('.apk') || asset.name.includes('android')
        );
        
        if (apkAsset) {
          setDownloadUrl(apkAsset.browser_download_url);
        }
        
        // Compare versions (current APK version vs latest)
        const currentVer = '1.1.8';
        if (latestVer !== currentVer) {
          setUpdateStatus('available');
          toast({
            title: "Update Available! 🎉",
            description: `Version ${latestVer} is ready to download`,
          });
        } else {
          setUpdateStatus('uptodate');
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      setUpdateStatus('error');
      toast({
        title: "Update Check Failed",
        description: "Could not check for updates. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingUpdates(false);
    }
  };

  const handleDownloadAndInstall = async () => {
    if (!downloadUrl) return;
    
    setIsDownloading(true);
    
    try {
      // Create a download link with proper filename
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `TABU-2-v${latestVersion}.apk`;
      
      // For mobile browsers, try to trigger download to Downloads folder
      if (/Android/i.test(navigator.userAgent)) {
        // Android device - try to download and show installation guide
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download Started! 📱",
          description: `TABU-2-v${latestVersion}.apk is downloading to your Downloads folder`,
        });
        
        // Show detailed installation instructions
        setTimeout(() => {
          toast({
            title: "Installation Steps 📋",
            description: "1. Open Downloads folder\n2. Tap the APK file\n3. Allow installation from unknown sources\n4. Install to update your app",
            duration: 10000,
          });
        }, 2000);
        
      } else {
        // Desktop browser - regular download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "APK Downloaded! 💻",
          description: "Transfer to your Android device and install",
        });
      }
      
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed ❌",
        description: "Please try downloading from GitHub releases page",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleLogout = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Update user status to logged out
        await updateDoc(doc(db, 'users', user.uid), {
          isLoggedIn: false,
          lastLogoutAt: new Date(),
        });
      } catch (error) {
        console.error('Error updating user logout status:', error);
      }
    }
    
    await auth.signOut();
    router.push('/login');
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await user.delete();
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      router.push('/login');
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Could not delete account. Please re-authenticate and try again.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (identifier: string | null) => {
    if (!identifier) return 'U';
    // If it's a 5-digit apartment number, use first 2 digits
    if (/^\d{5}$/.test(identifier)) {
      return identifier.substring(0, 2);
    }
    // Otherwise use first character (for email or other formats)
    return identifier.charAt(0).toUpperCase();
  };

  const HeaderIcon = title === 'TABU 2' ? AppWindow : WashingMachine;

  return (
    <>
      <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur px-4 md:px-6 z-50">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>

        <div className="flex-1 flex justify-center">
            <a href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                <HeaderIcon className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline">{title}</span>
            </a>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="/tabu.jpg" alt="User" />
                  <AvatarFallback>{getInitials(currentUser)}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-center">{currentUser ? `Room ${currentUser}` : 'Guest'}</DropdownMenuLabel>
              <div className="px-2 py-1 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">{onlineUsersCount} users online today</span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setIsNotificationSettingsOpen(true)}>
                <Bell className="mr-2" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setIsFeedbackFormOpen(true)}>
                <MessageSquare className="mr-2" />
                Feedback
              </DropdownMenuItem>
               <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Settings className="mr-2" />
                  Settings
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem disabled>
                      <Languages className="mr-2" />
                      Language
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Sun className="mr-2" />
                        Theme
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => setTheme("light")}>
                            <Sun className="mr-2" />
                            Light
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme("dark")}>
                            <Moon className="mr-2" />
                            Dark
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme("system")}>
                            <Laptop className="mr-2" />
                            System
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                     <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setIsDeleteAlertOpen(true)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                      <Trash2 className="mr-2" />
                      Delete Account
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem onSelect={() => setIsAboutDialogOpen(true)}>
                <Info className="mr-2" />
                About
              </DropdownMenuItem>
              {Capacitor.isNativePlatform() && (
                <DropdownMenuItem onSelect={() => setIsUpdateDialogOpen(true)}>
                  <RefreshCw className="mr-2" />
                  Check for Updates
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      <FeedbackForm open={isFeedbackFormOpen} onOpenChange={setIsFeedbackFormOpen} />
      <NotificationSettings open={isNotificationSettingsOpen} onOpenChange={setIsNotificationSettingsOpen} />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isAboutDialogOpen} onOpenChange={setIsAboutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About TABU 2
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 text-left">
              <div>
                <p className="font-semibold">Version 1.1.8</p>
              </div>
              
              <div>
                <p className="font-semibold mb-2">Privacy & Data</p>
                <p className="text-sm">
                  Your privacy is our priority. TABU 2 does not collect, store, or share any personal data beyond what's necessary for app functionality. All data stays secure and private.
                </p>
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground text-center">
                  Made with ❤️ by Arnold Dsouza
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAboutDialogOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {Capacitor.isNativePlatform() && (
        <AlertDialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RefreshCw className={`h-5 w-5 ${isCheckingUpdates ? 'animate-spin' : ''}`} />
              Check for Updates
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 text-left">
              <div>
                <p className="font-semibold mb-2">Current Version: 1.1.8</p>
                {updateStatus === 'checking' && (
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Checking for updates... 🔄
                  </p>
                )}
                {updateStatus === 'uptodate' && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    You are running the latest version! 🎉
                  </p>
                )}
                {updateStatus === 'available' && (
                  <div className="space-y-3">
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      📱 New version {latestVersion} is available!
                    </p>
                    {downloadUrl && (
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium mb-2">📥 Smart Download & Install:</p>
                        <ol className="text-xs space-y-1 text-muted-foreground">
                          <li>1. Click "Download & Install" below</li>
                          <li>2. APK will download to your Downloads folder</li>
                          <li>3. Tap the downloaded file to install</li>
                          <li>4. Allow "Install from unknown sources" if prompted</li>
                          <li>5. Install over current app (data preserved)</li>
                        </ol>
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 rounded text-xs">
                          💡 <strong>Tip:</strong> Look for "TABU-2-v{latestVersion}.apk" in your Downloads folder
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {updateStatus === 'error' && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    ❌ Error checking for updates. Please try again later.
                  </p>
                )}
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">
                  💡 <strong>APK Updates:</strong> Downloads save to your Downloads folder. 
                  Simply tap the APK file to install and update your app automatically.
                </p>
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  Last checked: {new Date().toLocaleString()}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={checkForUpdates}
              disabled={isCheckingUpdates}
              className="w-full sm:w-auto"
            >
              {isCheckingUpdates ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Check Now
                </>
              )}
            </Button>
            {updateStatus === 'available' && downloadUrl && (
              <Button 
                onClick={handleDownloadAndInstall}
                disabled={isDownloading}
                className="w-full sm:w-auto"
              >
                {isDownloading ? (
                  <>
                    <Download className="mr-2 h-4 w-4 animate-bounce" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download & Install v{latestVersion}
                  </>
                )}
              </Button>
            )}
            <AlertDialogAction 
              onClick={() => setIsUpdateDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      )}
    </>
  );
}
