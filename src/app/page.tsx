
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Skeleton } from '@/components/ui/skeleton';

function PageContent() {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const { isMobile, setOpenMobile } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('laundryUser');
    if (!user) {
      router.push('/login');
    } else {
      setCurrentUser(user);
    }
  }, [router]);

  const handleBuildingSelect = (buildingId: string) => {
    setSelectedBuilding(buildingId);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background p-4 md:p-8">
        <Skeleton className="h-16 w-full mb-4" />
        <div className="flex gap-8">
          <Skeleton className="hidden md:block w-64 h-[calc(100vh-100px)]" />
          <div className="flex-1 space-y-8">
            <Skeleton className="h-10 w-1/3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <Header currentUser={currentUser} />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <LaundryDashboard selectedBuildingId={selectedBuilding} currentUser={currentUser} />
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
