'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstallPromptDismissed, setIsInstallPromptDismissed] = useState(false);

  useEffect(() => {
    // Check if running in a browser environment
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      // Detect iOS device
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      setIsIOS(iOS);
      
      // Check if already installed as PWA
      const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);
      
      // Check if prompt was previously dismissed
      const dismissed = localStorage.getItem('pwaInstallPromptDismissed') === 'true';
      setIsInstallPromptDismissed(dismissed);
      
      // Show prompt if on iOS, not in standalone mode, and not previously dismissed
      if (iOS && !standalone && !dismissed) {
        // Delay showing the prompt to not interrupt initial user experience
        const timer = setTimeout(() => setShowPrompt(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember that user dismissed the prompt
    if (typeof window !== 'undefined') {
      localStorage.setItem('pwaInstallPromptDismissed', 'true');
    }
    setIsInstallPromptDismissed(true);
  };

  const handleRemindLater = () => {
    setShowPrompt(false);
    // Set a reminder to show again after 3 days
    if (typeof window !== 'undefined') {
      const threeDay = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
      localStorage.setItem('pwaInstallPromptReminder', (Date.now() + threeDay).toString());
    }
  };

  if (!isIOS || isStandalone || !showPrompt) {
    return null;
  }

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Install TABU on your iPhone</DialogTitle>
          <DialogDescription>
            Get the full app experience by adding TABU to your home screen.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div className="flex flex-col space-y-2">
            <p className="text-sm">Follow these steps:</p>
            <ol className="list-decimal list-inside text-sm pl-2 space-y-2">
              <li>Tap the <span className="inline-flex items-center px-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
              </span> Share button</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
              <li>Tap <strong>Add</strong> in the top right corner</li>
            </ol>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <Button variant="outline" onClick={handleRemindLater}>
              Remind me later
            </Button>
            <Button onClick={handleDismiss}>
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
