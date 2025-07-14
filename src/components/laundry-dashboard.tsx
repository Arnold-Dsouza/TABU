
"use client";

import { useState, useEffect } from 'react';
import type { Building } from '@/lib/types';
import { initialBuildingsData } from '@/lib/data';
import MachineCard from './machine-card';
import { useToast } from "@/hooks/use-toast";


const initializeTimers = (buildings: Building[]): Building[] => {
  const now = Date.now();
  return buildings.map(building => ({
    ...building,
    machines: building.machines.map(machine => {
      if (machine.status === 'in-use' && machine.timerEnd !== null) {
        // The data is a duration in ms, not a future timestamp
        return {
          ...machine,
          timerEnd: now + machine.timerEnd, 
        };
      }
      return machine;
    }),
  }));
};

interface LaundryDashboardProps {
  selectedBuildingId: string;
}

export default function LaundryDashboard({ selectedBuildingId }: LaundryDashboardProps) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  
  // Simulate a logged-in user
  const currentUser = 'Apt 101';

  useEffect(() => {
    setBuildings(initializeTimers(initialBuildingsData));
    setIsClient(true);
  }, []);

  const machinesInUseByUser = buildings
    .flatMap(b => b.machines)
    .filter(m => m.status === 'in-use' && m.apartmentUser === currentUser).length;

  const handleStartMachine = (machineId: string, durationMinutes: number) => {
    if (machinesInUseByUser >= 2) {
      toast({
        title: "Machine Limit Reached",
        description: "You can only use a maximum of 2 machines at a time.",
        variant: "destructive",
      });
      return;
    }

    setBuildings(currentBuildings => {
      return currentBuildings.map(building => ({
        ...building,
        machines: building.machines.map(machine => {
          if (machine.id === machineId) {
            return {
              ...machine,
              status: 'in-use',
              timerEnd: Date.now() + durationMinutes * 60 * 1000,
              apartmentUser: currentUser,
            };
          }
          return machine;
        }),
      }));
    });
  };

  const handleMachineFinish = (machineId: string) => {
    setBuildings(currentBuildings => {
      return currentBuildings.map(building => ({
        ...building,
        machines: building.machines.map(machine => {
          if (machine.id === machineId) {
            return {
              ...machine,
              status: 'available',
              timerEnd: null,
              apartmentUser: null,
            };
          }
          return machine;
        }),
      }));
    });
  };
  
  if (!isClient) {
    // Render a placeholder or nothing on the server to avoid hydration mismatch
    return null; 
  }
  
  const filteredBuildings = selectedBuildingId === 'all'
    ? buildings
    : buildings.filter(b => b.id === selectedBuildingId);

  return (
    <div className="space-y-8">
      {filteredBuildings.map(building => (
        <section key={building.id}>
          <h2 className="text-3xl font-bold tracking-tight mb-4 font-headline">{building.name}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {building.machines.map(machine => (
              <MachineCard 
                key={machine.id} 
                machine={machine} 
                currentUser={currentUser}
                onStart={handleStartMachine}
                onFinish={handleMachineFinish}
                canStartNewMachine={machinesInUseByUser < 2}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
