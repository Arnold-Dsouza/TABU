"use client";

import { useState, useEffect } from 'react';
import type { Building } from '@/lib/types';
import { initialBuildingsData } from '@/lib/data';
import MachineCard from './machine-card';

const initializeTimers = (buildings: Building[]): Building[] => {
  const now = Date.now();
  return buildings.map(building => ({
    ...building,
    machines: building.machines.map(machine => {
      if (machine.status === 'in-use' && machine.timerEnd !== null) {
        return {
          ...machine,
          timerEnd: now + machine.timerEnd,
        };
      }
      return machine;
    }),
  }));
};

export default function LaundryDashboard() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setBuildings(initializeTimers(initialBuildingsData));
    setIsClient(true);
  }, []);

  const handleStartMachine = (machineId: string, durationMinutes: number) => {
    setBuildings(currentBuildings => {
      return currentBuildings.map(building => ({
        ...building,
        machines: building.machines.map(machine => {
          if (machine.id === machineId) {
            return {
              ...machine,
              status: 'in-use',
              timerEnd: Date.now() + durationMinutes * 60 * 1000,
              apartmentUser: 'Apt 101', // Mock user
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

  return (
    <div className="space-y-8">
      {buildings.map(building => (
        <section key={building.id}>
          <h2 className="text-3xl font-bold tracking-tight mb-4 font-headline">{building.name}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {building.machines.map(machine => (
              <MachineCard 
                key={machine.id} 
                machine={machine} 
                onStart={handleStartMachine}
                onFinish={handleMachineFinish}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
