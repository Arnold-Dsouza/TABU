
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Settings, Trash2, WashingMachine, MessageSquare, Languages, Sun, Moon, Laptop, AppWindow, Bell, Users, Download } from 'lucide-react';
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


interface HeaderProps {
  currentUser: string | null;
  title?: string;
}

export default function Header({ currentUser, title = 'LaundryView' }: HeaderProps) {
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const { setTheme } = useTheme();

  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('isLoggedIn', '==', true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // This part might need to be re-evaluated with Firebase Auth
      // setOnlineUsersCount(snapshot.size); 
    }, (error) => {
      console.error("Error fetching online users count:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
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

  const getInitials = (email: string | null) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
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
                  <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="person portrait" />
                  <AvatarFallback>{getInitials(currentUser)}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{currentUser || 'Guest'}</DropdownMenuLabel>
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
    </>
  );
}
