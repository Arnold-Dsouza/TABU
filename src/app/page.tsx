
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
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from '@/components/ui/sidebar';
import { initialBuildingsData } from '@/lib/data';
import { Building, Home as HomeIcon } from 'lucide-react';

function PageContent() {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const { isMobile, setOpenMobile } = useSidebar();

  const handleBuildingSelect = (buildingId: string) => {
    setSelectedBuilding(buildingId);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader></SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarGroup>
                <SidebarGroupLabel>Buildings</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => handleBuildingSelect('all')}
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
                        onClick={() => handleBuildingSelect(building.id)}
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
    </>
  );
}

export default function Home() {
  return (
    <SidebarProvider>
      <PageContent />
    </SidebarProvider>
  );
}
