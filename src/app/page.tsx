
'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import LaundryDashboard from '@/components/laundry-dashboard';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { initialBuildingsData } from '@/lib/data';
import { Building, Home as HomeIcon } from 'lucide-react';

export default function Home() {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarGroup>
                <SidebarGroupLabel>Buildings</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setSelectedBuilding('all')}
                      isActive={selectedBuilding === 'all'}
                      tooltip="All Buildings"
                    >
                      <HomeIcon />
                      <span>All Buildings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {initialBuildingsData.map((building) => (
                    <SidebarMenuItem key={building.id}>
                      <SidebarMenuButton
                        onClick={() => setSelectedBuilding(building.id)}
                        isActive={selectedBuilding === building.id}
                        tooltip={building.name}
                      >
                        <Building />
                        <span>{building.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col bg-background">
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <LaundryDashboard selectedBuildingId={selectedBuilding} />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
