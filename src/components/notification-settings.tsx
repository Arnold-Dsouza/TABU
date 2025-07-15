
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { initialBuildingsData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tabuServices = [
    { id: 'fitness', name: 'Fitness Room' },
    { id: 'tea', name: 'Tea Room' },
    { id: 'cafeteria', name: 'Tabu Cafeteria' },
    { id: 'bar', name: 'Tabu Bar' },
];

export function NotificationSettings({ open, onOpenChange }: NotificationSettingsProps) {
  const { toast } = useToast();
  // In a real app, these values would come from user preferences storage
  const [laundryNotifs, setLaundryNotifs] = useState<Record<string, boolean>>({
    'bldg-58': false,
    'bldg-60': true,
    'bldg-62': false,
    'bldg-64': false,
  });
  const [tabuNotifs, setTabuNotifs] = useState<Record<string, boolean>>({
    fitness: true,
    tea: false,
    cafeteria: true,
    bar: false,
  });

  const handleLaundryToggle = (buildingId: string) => {
    setLaundryNotifs(prev => ({ ...prev, [buildingId]: !prev[buildingId] }));
  };

  const handleTabuToggle = (serviceId: string) => {
    setTabuNotifs(prev => ({ ...prev, [serviceId]: !prev[serviceId] }));
  };
  
  const handleSaveChanges = () => {
    // Here you would save the settings to localStorage or a backend service
    console.log('Saving notification settings:', { laundryNotifs, tabuNotifs });
    toast({
      title: 'Settings Saved',
      description: 'Your notification preferences have been updated.',
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
          <DialogDescription>
            Manage your notification preferences here. Changes will be saved for this device.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <h3 className="mb-4 text-lg font-medium">Laundry</h3>
            <div className="space-y-4">
              {initialBuildingsData.map(building => (
                <div key={building.id} className="flex items-center justify-between">
                  <Label htmlFor={`notif-${building.id}`} className="flex-1">
                    Notify when machine is available in {building.name}
                  </Label>
                  <Switch
                    id={`notif-${building.id}`}
                    checked={laundryNotifs[building.id] || false}
                    onCheckedChange={() => handleLaundryToggle(building.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-4 text-lg font-medium">TABU</h3>
            <div className="space-y-4">
               {tabuServices.map(service => (
                <div key={service.id} className="flex items-center justify-between">
                  <Label htmlFor={`notif-${service.id}`} className="flex-1">
                    {service.name} updates & events
                  </Label>
                  <Switch
                    id={`notif-${service.id}`}
                    checked={tabuNotifs[service.id] || false}
                    onCheckedChange={() => handleTabuToggle(service.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
