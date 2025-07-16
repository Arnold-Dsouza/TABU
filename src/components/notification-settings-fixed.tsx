'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { initialBuildingsData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { tabuNotificationService } from '@/lib/tabu-notifications';

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

type TabuNotifSettings = {
    opening: boolean;
    events: boolean;
};

export function NotificationSettings({ open, onOpenChange }: NotificationSettingsProps) {
  const { toast } = useToast();
  
  const [laundryNotifs, setLaundryNotifs] = useState<Record<string, boolean>>({
    'bldg-58': false,
    'bldg-60': true,
    'bldg-62': false,
    'bldg-64': false,
  });
  const [cycleEndNotif, setCycleEndNotif] = useState(true);
  const [tabuNotifs, setTabuNotifs] = useState<Record<string, TabuNotifSettings>>({
    fitness: { opening: true, events: false },
    tea: { opening: false, events: true },
    cafeteria: { opening: true, events: true },
    bar: { opening: false, events: false },
  });

  const [allLaundry, setAllLaundry] = useState(false);
  const [allTabu, setAllTabu] = useState(false);

  useEffect(() => {
    // Initialize TABU notification service and load settings
    const initializeTabuNotifications = async () => {
      await tabuNotificationService.initialize();
      const savedTabuSettings = tabuNotificationService.getNotificationSettings();
      setTabuNotifs(savedTabuSettings);
    };
    
    initializeTabuNotifications();
  }, []);

  useEffect(() => {
    const laundryValues = Object.values(laundryNotifs);
    setAllLaundry(laundryValues.every(v => v) && cycleEndNotif);
  }, [laundryNotifs, cycleEndNotif]);

  useEffect(() => {
    const tabuValues = Object.values(tabuNotifs).flatMap(s => [s.opening, s.events]);
    setAllTabu(tabuValues.every(v => v));
  }, [tabuNotifs]);

  const handleLaundryToggle = (buildingId: string) => {
    setLaundryNotifs(prev => ({ ...prev, [buildingId]: !prev[buildingId] }));
  };

  const handleTabuToggle = (serviceId: string, type: keyof TabuNotifSettings) => {
    const newTabuNotifs = {
        ...tabuNotifs,
        [serviceId]: {
            ...tabuNotifs[serviceId],
            [type]: !tabuNotifs[serviceId][type]
        }
    };
    setTabuNotifs(newTabuNotifs);
    
    // Save to TABU notification service
    tabuNotificationService.setNotificationSettings(newTabuNotifs);
    
    // Show a toast to confirm the change
    toast({
      title: "Notification Settings Updated",
      description: `${type === 'events' ? 'Events' : 'Opening'} notifications for ${tabuServices.find(s => s.id === serviceId)?.name} ${newTabuNotifs[serviceId][type] ? 'enabled' : 'disabled'}.`,
    });
  };
  
  const handleAllLaundryToggle = (checked: boolean) => {
      setCycleEndNotif(checked);
      const newLaundryNotifs: Record<string, boolean> = {};
      initialBuildingsData.forEach(b => newLaundryNotifs[b.id] = checked);
      setLaundryNotifs(newLaundryNotifs);
  };

  const handleAllTabuToggle = (checked: boolean) => {
      const newTabuNotifs: Record<string, TabuNotifSettings> = {};
      tabuServices.forEach(s => {
        newTabuNotifs[s.id] = { opening: checked, events: checked };
      });
      setTabuNotifs(newTabuNotifs);
      
      // Save to TABU notification service
      tabuNotificationService.setNotificationSettings(newTabuNotifs);
      
      // Show a toast to confirm the change
      toast({
        title: "All TABU Notifications Updated",
        description: `All TABU notifications have been ${checked ? 'enabled' : 'disabled'}.`,
      });
  };

  // Handle test notification
  const handleTestNotification = async (serviceId: string, type: 'opening' | 'events') => {
    const service = tabuServices.find(s => s.id === serviceId);
    if (!service) return;

    try {
      await tabuNotificationService.sendTestNotification(
        serviceId, 
        service.name, 
        type === 'events' ? 'event' : 'opening'
      );
      
      toast({
        title: "Test Notification Sent! 🔔",
        description: `A test ${type === 'events' ? 'event' : 'opening'} notification for ${service.name} will appear in 2 seconds.`,
      });
    } catch (error) {
      toast({
        title: "Error Sending Test Notification",
        description: "Please make sure notifications are enabled for this app.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
          <DialogDescription>
            Manage your notification preferences here. Changes are saved automatically for this device.
          </DialogDescription>
        </DialogHeader>
        
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="laundry">
            <div className="flex items-center justify-between w-full">
                <AccordionTrigger className="flex-1 pr-2">
                    <span className="text-lg font-medium">Laundry</span>
                </AccordionTrigger>
                <Switch
                  id="all-laundry"
                  checked={allLaundry}
                  onCheckedChange={handleAllLaundryToggle}
                  aria-label="Toggle all laundry notifications"
                  disabled
                />
            </div>
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
                    disabled
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
                      disabled
                    />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="tabu2">
            <div className="flex items-center justify-between w-full">
                <AccordionTrigger className="flex-1 pr-2">
                    <span className="text-lg font-medium">TABU 2</span>
                </AccordionTrigger>
                <Switch
                  id="all-tabu"
                  checked={allTabu}
                  onCheckedChange={handleAllTabuToggle}
                  aria-label="Toggle all TABU 2 notifications"
                />
            </div>
            <AccordionContent>
                <Accordion type="multiple" className="w-full pl-4 border-l-2">
                 {tabuServices.map(service => (
                  <AccordionItem value={service.id} key={service.id}>
                    <AccordionTrigger>
                      <Label className="font-semibold">{service.name}</Label>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <Label htmlFor={`notif-${service.id}-opening`} className="font-normal text-muted-foreground">Opening notification</Label>
                            <div className="flex items-center gap-2">
                              <Switch
                                  id={`notif-${service.id}-opening`}
                                  checked={tabuNotifs[service.id]?.opening || false}
                                  onCheckedChange={() => handleTabuToggle(service.id, 'opening')}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTestNotification(service.id, 'opening')}
                                disabled={!tabuNotifs[service.id]?.opening}
                                className="text-xs px-2 py-1 h-6"
                              >
                                Test
                              </Button>
                            </div>
                        </div>
                         <div className="flex items-center justify-between">
                            <Label htmlFor={`notif-${service.id}-events`} className="font-normal text-muted-foreground">Events notification</Label>
                            <div className="flex items-center gap-2">
                              <Switch
                                  id={`notif-${service.id}-events`}
                                  checked={tabuNotifs[service.id]?.events || false}
                                  onCheckedChange={() => handleTabuToggle(service.id, 'events')}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTestNotification(service.id, 'events')}
                                disabled={!tabuNotifs[service.id]?.events}
                                className="text-xs px-2 py-1 h-6"
                              >
                                Test
                              </Button>
                            </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
