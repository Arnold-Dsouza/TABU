
"use client";

import { useState, useEffect } from 'react';
import { WashingMachine, Wind, Timer, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Machine } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MachineCardProps {
  machine: Machine;
  currentUser: string;
  onStart: (machineId: string, durationMinutes: number) => void;
  onFinish: (machineId: string) => void;
  canStartNewMachine: boolean;
}

const formatTime = (totalSeconds: number) => {
  if (totalSeconds <= 0) return '00:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function MachineCard({ machine, currentUser, onStart, onFinish, canStartNewMachine }: MachineCardProps) {
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

  const handleStopClick = () => {
    onFinish(machine.id);
  };
  
  const isAvailable = machine.status === 'available';
  const isUserMachine = machine.status === 'in-use' && machine.apartmentUser === currentUser;
  const MachineIcon = machine.type === 'washer' ? WashingMachine : Wind;

  return (
    <div className={cn(
      "relative flex flex-col justify-between w-full max-w-sm mx-auto bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md transition-all hover:shadow-lg p-4 space-y-4",
      isAvailable ? "border-2 border-green-500" : "border-2 border-transparent"
    )}>
      {/* Control Panel */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg font-headline">{machine.name}</h3>
        <MachineIcon className={cn("h-6 w-6", isAvailable ? "text-green-600" : "text-muted-foreground")} />
      </div>

      {/* Machine Window */}
      <div className="relative flex items-center justify-center w-48 h-48 lg:w-56 lg:h-56 mx-auto bg-gray-300 dark:bg-gray-700 rounded-full border-8 border-gray-400 dark:border-gray-600 shadow-inner">
        <div className={cn(
          "flex items-center justify-center w-full h-full rounded-full backdrop-blur-sm",
          isAvailable ? "bg-green-500/80" : "bg-orange-500/80"
        )}>
          {isAvailable ? (
            <span className="text-2xl font-bold text-white tracking-wider">Available</span>
          ) : (
            <div className="text-center text-white">
              <div className="text-4xl lg:text-5xl font-bold font-headline tabular-nums flex items-center justify-center gap-2">
                <Timer className="h-8 w-8 lg:h-10 lg:w-10" />
                {formatTime(remainingSeconds)}
              </div>
              <p className="text-xs text-gray-200 flex items-center justify-center gap-1.5 mt-2">
                <User className="h-3 w-3" />
                {machine.apartmentUser}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      {isUserMachine ? (
        <Button className="w-full" variant="destructive" onClick={handleStopClick}>
          Stop Cycle
        </Button>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" disabled={!isAvailable || !canStartNewMachine}>
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
      )}
    </div>
  );
}
