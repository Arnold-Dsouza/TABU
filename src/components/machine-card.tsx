
"use client";

import { useState, useEffect } from 'react';
import { WashingMachine, Wind, Timer, User, Info, Flag, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Machine } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface MachineCardProps {
  machine: Machine;
  currentUser: string;
  onStart: (machineId: string, durationMinutes: number) => void;
  onFinish: (machineId: string) => void;
  canStartNewMachine: boolean;
}

const formatTime = (totalSeconds: number) => {
  if (totalSeconds <= 0) return '00:00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function MachineCard({ machine, currentUser, onStart, onFinish, canStartNewMachine }: MachineCardProps) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [durationHours, setDurationHours] = useState('0');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [reportValue, setReportValue] = useState("");
  const [warningSelection, setWarningSelection] = useState("");
  const [otherWarningValue, setOtherWarningValue] = useState("");

  const { toast } = useToast();

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
    const hours = parseInt(durationHours, 10) || 0;
    const minutes = parseInt(durationMinutes, 10) || 0;
    const totalDurationMinutes = (hours * 60) + minutes;

    if (totalDurationMinutes > 0) {
      onStart(machine.id, totalDurationMinutes);
      setIsDialogOpen(false);
    }
  };

  const handleStopClick = () => {
    onFinish(machine.id);
  };
  
  const handleReportSubmit = () => {
    if (!reportValue) return;
    console.log(`Report for ${machine.name}: ${reportValue}`);
    toast({
      title: "Report Submitted",
      description: `Your report for "${reportValue}" has been sent.`,
    });
    setReportValue("");
    setIsPopoverOpen(false);
  };

  const handleWarningSubmit = () => {
    const finalWarning = warningSelection === 'other' ? otherWarningValue : warningSelection;
    if (!finalWarning) return;
    console.log(`Warning for ${machine.name}: ${finalWarning}`);
     toast({
      title: "Warning Submitted",
      description: `Your warning has been sent.`,
    });
    setWarningSelection("");
    setOtherWarningValue("");
    setIsPopoverOpen(false);
  };

  const isAvailable = machine.status === 'available';
  const isUserMachine = machine.status === 'in-use' && machine.apartmentUser === currentUser;
  const MachineIcon = machine.type === 'washer' ? WashingMachine : Wind;

  const cardColor = isAvailable ? 'border-green-500' : 'border-orange-500';
  const cardBgColor = isAvailable ? 'bg-green-500/10' : 'bg-orange-500/10';
  const iconColor = isAvailable ? 'text-green-500' : 'text-orange-500';


  return (
    <div className={cn(
      "relative flex flex-col justify-between w-full mx-auto bg-card rounded-xl shadow-md transition-all hover:shadow-lg p-3 sm:p-4 space-y-3 sm:space-y-4 border",
    )}>
       <div className={cn("absolute top-0 left-0 w-full h-2 rounded-t-xl", isAvailable ? "bg-green-500" : "bg-orange-500")}></div>
       <div className="flex justify-between items-start pt-2">
        <h3 className="font-bold text-lg font-headline">{machine.name}</h3>
        <div className="flex items-center gap-2">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Info className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <Tabs defaultValue="report" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="report">
                      <Flag className="h-4 w-4 mr-2" />
                      Report
                    </TabsTrigger>
                    <TabsTrigger value="warning">
                      <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                      Warning
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="report">
                     <div className="py-4 space-y-4">
                        <Label>Select an issue to report:</Label>
                        <RadioGroup value={reportValue} onValueChange={setReportValue}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Machine not working" id="r1" />
                            <Label htmlFor="r1">Machine not working</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Machine not draining" id="r2" />
                            <Label htmlFor="r2">Machine not draining</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Cycle not starting" id="r3" />
                            <Label htmlFor="r3">Cycle not starting</Label>
                          </div>
                        </RadioGroup>
                        <Button className="w-full" onClick={handleReportSubmit} disabled={!reportValue}>Submit Report</Button>
                     </div>
                  </TabsContent>
                  <TabsContent value="warning">
                    <div className="py-4 space-y-4">
                        <Label>Select a warning:</Label>
                        <RadioGroup value={warningSelection} onValueChange={setWarningSelection}>
                           <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Machine is smelling" id="w1" />
                            <Label htmlFor="w1">Machine is smelling</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Machine not clean" id="w2" />
                            <Label htmlFor="w2">Machine not clean</Label>
                          </div>
                           <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="w3" />
                            <Label htmlFor="w3">Other</Label>
                          </div>
                        </RadioGroup>
                        {warningSelection === 'other' && (
                           <Textarea 
                            id="warning-text-other"
                            placeholder="Please describe the warning..."
                            value={otherWarningValue}
                            onChange={(e) => setOtherWarningValue(e.target.value)}
                          />
                        )}
                         <Button 
                            className="w-full" 
                            onClick={handleWarningSubmit} 
                            disabled={!warningSelection || (warningSelection === 'other' && !otherWarningValue)}>
                              Submit Warning
                          </Button>
                    </div>
                  </TabsContent>
                </Tabs>
            </PopoverContent>
          </Popover>
          <MachineIcon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>

      <div className={cn(
          "relative flex items-center justify-center aspect-square w-full max-w-[150px] sm:max-w-[224px] mx-auto rounded-full border-8 shadow-inner bg-background",
          cardColor
      )}>
        <div className={cn(
          "flex items-center justify-center w-[95%] h-[95%] rounded-full backdrop-blur-sm border-4 border-card",
           cardBgColor
        )}>
          {isAvailable ? (
            <span className="text-xl sm:text-2xl font-bold text-green-600 tracking-wider">Available</span>
          ) : (
            <div className="text-center text-foreground">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-headline tabular-nums flex items-center justify-center gap-1">
                <Timer className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                {formatTime(remainingSeconds)}
              </div>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-2">
                <User className="h-3 w-3" />
                {machine.apartmentUser}
              </p>
            </div>
          )}
        </div>
      </div>

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
                Set the cycle duration. The machine will be marked as in-use.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                  <div>
                    <Label htmlFor="hours" className="text-right">
                      Hours
                    </Label>
                    <Input
                      id="hours"
                      type="number"
                      value={durationHours}
                      onChange={(e) => setDurationHours(e.target.value)}
                      className="w-full"
                      placeholder="e.g., 1"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minutes" className="text-right">
                      Minutes
                    </Label>
                    <Input
                      id="minutes"
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      className="w-full"
                      placeholder="e.g., 30"
                      min="0"
                      max="59"
                    />
                  </div>
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
