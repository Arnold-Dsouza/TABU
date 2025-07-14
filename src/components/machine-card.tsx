"use client";

import { useState, useEffect } from 'react';
import { WashingMachine, Wind, Timer, User } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Machine } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MachineCardProps {
  machine: Machine;
  onStart: (machineId: string, durationMinutes: number) => void;
  onFinish: (machineId: string) => void;
}

const formatTime = (totalSeconds: number) => {
  if (totalSeconds <= 0) return '00:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function MachineCard({ machine, onStart, onFinish }: MachineCardProps) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [durationInput, setDurationInput] = useState('45');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (machine.status === 'in-use' && machine.timerEnd) {
      const updateTimer = () => {
        const secondsLeft = Math.round((machine.timerEnd! - Date.now()) / 1000);
        if (secondsLeft > 0) {
          setRemainingSeconds(secondsLeft);
        } else {
          setRemainingSeconds(0);
          onFinish(machine.id);
        }
      };
      
      updateTimer();
      const intervalId = setInterval(updateTimer, 1000);
      return () => clearInterval(intervalId);
    }
  }, [machine.status, machine.timerEnd, machine.id, onFinish]);

  const handleStartClick = () => {
    const duration = parseInt(durationInput, 10);
    if (!isNaN(duration) && duration > 0) {
      onStart(machine.id, duration);
      setIsDialogOpen(false);
    }
  };
  
  const isAvailable = machine.status === 'available';
  const MachineIcon = machine.type === 'washer' ? WashingMachine : Wind;

  return (
    <Card className={cn(
      "flex flex-col transition-all shadow-sm hover:shadow-md", 
      isAvailable && "border-accent/80"
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium font-headline">{machine.name}</CardTitle>
        <MachineIcon className={cn("h-6 w-6", isAvailable ? "text-accent-foreground" : "text-muted-foreground")} />
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center py-4">
        {isAvailable ? (
          <Badge variant="outline" className="text-base px-4 py-2 border-accent text-accent-foreground bg-accent/20">Available</Badge>
        ) : (
          <div className="space-y-2 text-center">
            <div className="text-5xl font-bold font-headline tabular-nums flex items-center justify-center gap-2">
              <Timer className="h-10 w-10 text-primary" />
              {formatTime(remainingSeconds)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <User className="h-3 w-3" />
              In use by {machine.apartmentUser}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" disabled={!isAvailable}>
              Start Cycle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Start {machine.name}</DialogTitle>
              <DialogDescription>
                Set the cycle duration in minutes. The machine will be marked as in-use.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={durationInput}
                  onChange={(e) => setDurationInput(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., 45"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={handleStartClick}>Start</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
