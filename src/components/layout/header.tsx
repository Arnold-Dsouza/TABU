
"use client";

import { useState } from 'react';
import { WashingMachine } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FeedbackForm } from '../feedback-form';
import { SidebarTrigger } from '../ui/sidebar';

export default function Header() {
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur px-4 md:px-6 z-50">
        {/* Left side */}
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>

        {/* Center */}
        <div className="flex-1 flex justify-center">
            <a href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                <WashingMachine className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline">LaundryView</span>
            </a>
        </div>
        
        {/* Right side */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="person portrait" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Apt 101</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Settings</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Change Language</DropdownMenuItem>
                    <DropdownMenuItem>About</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">Delete Account</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem onSelect={() => setIsFeedbackFormOpen(true)}>Feedback</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <FeedbackForm open={isFeedbackFormOpen} onOpenChange={setIsFeedbackFormOpen} />
    </>
  );
}
