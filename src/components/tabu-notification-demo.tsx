'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { tabuNotificationService } from '@/lib/tabu-notifications';

// Sample TABU events data
const sampleEvents = [
  {
    id: 'fitness-morning-yoga',
    serviceId: 'fitness',
    serviceName: 'Fitness Room',
    title: 'Morning Yoga Session',
    description: 'Start your day with a relaxing yoga session!',
    startTime: new Date(Date.now() + 10000), // 10 seconds from now
    type: 'event' as const,
  },
  {
    id: 'tea-afternoon-special',
    serviceId: 'tea',
    serviceName: 'Tea Room',
    title: 'Afternoon Tea Special',
    description: 'Special blend available this afternoon!',
    startTime: new Date(Date.now() + 15000), // 15 seconds from now
    type: 'event' as const,
  },
  {
    id: 'cafeteria-opening',
    serviceId: 'cafeteria',
    serviceName: 'Tabu Cafeteria',
    title: 'Now Open',
    description: 'The cafeteria is now open for service!',
    startTime: new Date(Date.now() + 5000), // 5 seconds from now
    type: 'opening' as const,
  }
];

export function TabuNotificationDemo() {
  const { toast } = useToast();
  const [scheduledEvents, setScheduledEvents] = useState<string[]>([]);

  const scheduleEvent = async (event: typeof sampleEvents[0]) => {
    try {
      await tabuNotificationService.scheduleEventNotification(event);
      setScheduledEvents(prev => [...prev, event.id]);
      
      toast({
        title: "Event Scheduled! 📅",
        description: `Notification for "${event.title}" will appear in ${Math.round((event.startTime.getTime() - Date.now()) / 1000)} seconds.`,
      });
    } catch (error) {
      toast({
        title: "Error Scheduling Event",
        description: "Please make sure notifications are enabled for this app.",
        variant: "destructive",
      });
    }
  };

  const cancelEvent = async (eventId: string) => {
    try {
      await tabuNotificationService.cancelEventNotification(eventId);
      setScheduledEvents(prev => prev.filter(id => id !== eventId));
      
      toast({
        title: "Event Cancelled",
        description: "The notification has been cancelled.",
      });
    } catch (error) {
      toast({
        title: "Error Cancelling Event",
        description: "Could not cancel the notification.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">TABU Notification Demo</h3>
        <p className="text-sm text-muted-foreground">
          Test the TABU notification system with sample events
        </p>
      </div>
      
      <div className="grid gap-4">
        {sampleEvents.map((event) => {
          const isScheduled = scheduledEvents.includes(event.id);
          
          return (
            <Card key={event.id} className="w-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{event.title}</CardTitle>
                    <CardDescription className="text-sm">{event.serviceName}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.type === 'opening' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    }`}>
                      {event.type === 'opening' ? 'Opening' : 'Event'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {event.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Scheduled for: {Math.round((event.startTime.getTime() - Date.now()) / 1000)}s from now
                  </span>
                  <div className="flex gap-2">
                    {!isScheduled ? (
                      <Button
                        size="sm"
                        onClick={() => scheduleEvent(event)}
                        className="text-xs"
                      >
                        Schedule Notification
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelEvent(event.id)}
                        className="text-xs"
                      >
                        Cancel Notification
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground">
          💡 Make sure you have enabled notifications for the respective services in the notification settings!
        </p>
      </div>
    </div>
  );
}
