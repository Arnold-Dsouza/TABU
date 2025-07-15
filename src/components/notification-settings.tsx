
'use client';

import { useState, useEffect } from 'react';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
  const [cycleEndNotif, setCycleEndNotif] = useState(true);
  const [tabuNotifs, setTabuNotifs] = useState<Record<string, boolean>>({
    fitness: true,
    tea: false,
    cafeteria: true,
    bar: false,
  });

  const [allLaundry, setAllLaundry] = useState(false);
  const [allTabu, setAllTabu] = useState(false);

  useEffect(() => {
    const laundryValues = Object.values(laundryNotifs);
    setAllLaundry(laundryValues.every(v => v) && cycleEndNotif);
  }, [laundryNotifs, cycleEndNotif]);

  useEffect(() => {
    const tabuValues = Object.values(tabuNotifs);
    setAllTabu(tabuValues.every(v => v));
  }, [tabuNotifs]);


  const handleLaundryToggle = (buildingId: string) => {
    setLaundryNotifs(prev => ({ ...prev, [buildingId]: !prev[buildingId] }));
  };

  const handleTabuToggle = (serviceId: string) => {
    setTabuNotifs(prev => ({ ...prev, [serviceId]: !prev[serviceId] }));
  };
  
  const handleAllLaundryToggle = (checked: boolean) => {
      setCycleEndNotif(checked);
      const newLaundryNotifs: Record<string, boolean> = {};
      initialBuildingsData.forEach(b => newLaundryNotifs[b.id] = checked);
      setLaundryNotifs(newLaundryNotifs);
  };

  const handleAllTabuToggle = (checked: boolean) => {
      const newTabuNotifs: Record<string, boolean> = {};
      tabuServices.forEach(s => newTabuNotifs[s.id] = checked);
      setTabuNotifs(newTabuNotifs);
  };

  const handleSaveChanges = () => {
    // Here you would save the settings to localStorage or a backend service
    console.log('Saving notification settings:', { cycleEndNotif, laundryNotifs, tabuNotifs });
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
        
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="laundry">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full">
                <span className="text-lg font-medium">Laundry</span>
                <Switch
                  id="all-laundry"
                  checked={allLaundry}
                  onCheckedChange={handleAllLaundryToggle}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2 pl-4 border-l-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notif-cycle-end" className="flex-1">
                    Notify 5 mins before my cycle ends
                  </Label>
                  <Switch
                    id="notif-cycle-end"
                    checked={cycleEndNotif}
                    onCheckedChange={setCycleEndNotif}
                  />
                </div>
                <Separator />
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
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="tabu2">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full">
                <span className="text-lg font-medium">TABU 2</span>
                 <Switch
                  id="all-tabu"
                  checked={allTabu}
                  onCheckedChange={handleAllTabuToggle}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
               <div className="space-y-4 pt-2 pl-4 border-l-2">
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <DialogFooter className="sm:justify-end pt-4">
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
