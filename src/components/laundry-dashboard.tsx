
"use client";

import { useState, useEffect } from 'react';
import type { Building, Machine } from '@/lib/types';
import MachineCard from './machine-card';
import { useToast } from "@/hooks/use-toast";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, runTransaction, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface LaundryDashboardProps {
  selectedBuildingId: string;
  currentUser: string;
}

export default function LaundryDashboard({ selectedBuildingId, currentUser }: LaundryDashboardProps) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'buildings'), (snapshot) => {
      const buildingsData: Building[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          machines: data.machines.map((machine: any) => ({
            ...machine,
            // Convert Firestore Timestamps to JS Date objects then to numbers
            timerEnd: machine.timerEnd instanceof Timestamp ? machine.timerEnd.toMillis() : null,
          })) as Machine[],
        };
      });
      setBuildings(buildingsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching buildings:", error);
      toast({
        title: "Error",
        description: "Could not fetch laundry data. Please try again later.",
        variant: "destructive",
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const machinesInUseByUser = buildings
    .flatMap(b => b.machines)
    .filter(m => m.status === 'in-use' && m.apartmentUser === currentUser).length;

  const handleStartMachine = async (machineId: string, durationMinutes: number) => {
    if (machinesInUseByUser >= 2) {
      toast({
        title: "Machine Limit Reached",
        description: "You can only use a maximum of 2 machines at a time.",
        variant: "destructive",
      });
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const { building, buildingRef, machineIndex } = await findMachineLocation(transaction, machineId);
        if (machineIndex === -1) throw new Error("Machine not found");

        const machine = building.machines[machineIndex];
        if (machine.status !== 'available') {
          throw new Error("Machine is not available to start.");
        }

        const newMachines = [...building.machines];
        newMachines[machineIndex] = {
          ...machine,
          status: 'in-use',
          timerEnd: Date.now() + durationMinutes * 60 * 1000,
          apartmentUser: currentUser,
        };
        transaction.update(buildingRef, { machines: newMachines });
      });
    } catch (error) {
      console.error("Error starting machine:", error);
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleMachineFinish = async (machineId: string) => {
    try {
      await runTransaction(db, async (transaction) => {
        const { building, buildingRef, machineIndex } = await findMachineLocation(transaction, machineId);
        if (machineIndex === -1) throw new Error("Machine not found");

        const newMachines = [...building.machines];
        newMachines[machineIndex] = {
          ...newMachines[machineIndex],
          status: 'available',
          timerEnd: null,
          apartmentUser: null,
        };
        transaction.update(buildingRef, { machines: newMachines });
      });
    } catch (error) {
      console.error("Error finishing machine:", error);
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleReport = async (machineId: string, issue: string) => {
    try {
      await runTransaction(db, async (transaction) => {
        const { building, buildingRef, machineIndex } = await findMachineLocation(transaction, machineId);
        if (machineIndex === -1) throw new Error("Machine not found");
        
        const machine = building.machines[machineIndex];
        const newReports = [...machine.reports, { userId: currentUser, issue }];
        const newMachines = [...building.machines];
        newMachines[machineIndex] = {
          ...machine,
          reports: newReports,
          status: newReports.length >= 5 ? 'out-of-order' : machine.status,
        };
        transaction.update(buildingRef, { machines: newMachines });
      });
    } catch (error) {
      console.error("Error reporting issue:", error);
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleWarning = async (machineId: string, message: string) => {
     try {
      await runTransaction(db, async (transaction) => {
        const { building, buildingRef, machineIndex } = await findMachineLocation(transaction, machineId);
        if (machineIndex === -1) throw new Error("Machine not found");
        
        const machine = building.machines[machineIndex];
        const newWarnings = [...machine.warnings, { userId: currentUser, message }];
        const newMachines = [...building.machines];
        newMachines[machineIndex] = {
          ...machine,
          warnings: newWarnings,
        };
        transaction.update(buildingRef, { machines: newMachines });
      });
    } catch (error) {
      console.error("Error sending warning:", error);
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  const findMachineLocation = async (transaction: any, machineId: string) => {
    let buildingDoc, buildingRef, machineIndex = -1;

    for (const b of buildings) {
      const tempIndex = b.machines.findIndex(m => m.id === machineId);
      if (tempIndex !== -1) {
        buildingRef = doc(db, 'buildings', b.id);
        const buildingDocSnap = await transaction.get(buildingRef);
        if (!buildingDocSnap.exists()) {
            throw new Error(`Building ${b.id} not found in database.`);
        }
        buildingDoc = buildingDocSnap.data() as Building;
        machineIndex = buildingDoc.machines.findIndex(m => m.id === machineId);
        break;
      }
    }
    
    if (!buildingDoc || !buildingRef || machineIndex === -1) {
      throw new Error("Could not find the machine in any building.");
    }
    
    return { building: buildingDoc, buildingRef, machineIndex };
  };

  if (isLoading) {
    return (
       <div className="space-y-8 p-4 md:p-8">
         <section>
          <Skeleton className="h-10 w-1/3 mb-4" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </section>
      </div>
    );
  }

  const filteredBuildings = selectedBuildingId === 'all'
    ? buildings
    : buildings.filter(b => b.id === selectedBuildingId);

  if (filteredBuildings.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-semibold">No Machines Found</h2>
        <p className="text-muted-foreground mt-2">
          {selectedBuildingId === 'all' 
            ? "There are no buildings or machines configured in the database." 
            : "This building has no machines configured or does not exist."}
        </p>
      </div>
    )
  }

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
                onReport={handleReport}
                onWarning={handleWarning}
                canStartNewMachine={machinesInUseByUser < 2}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
