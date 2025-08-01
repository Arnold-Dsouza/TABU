
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import LaundryDashboard from '@/components/laundry-dashboard';
import FitnessRoom from '@/components/fitness-room';
import TabuCafeteria from '@/components/tabu-cafeteria';
import TabuBar from '@/components/tabu-bar';
import TeaRoom from '@/components/tea-room';
import PropertyManagement from '@/components/property-management';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { initializeMobileApp } from '@/lib/mobile-utils';

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
import { Building, Home as HomeIcon, Dumbbell, Coffee, Utensils, Martini } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type View = 'laundry' | 'fitness' | 'tea' | 'cafeteria' | 'bar' | 'propertyManagement';

function PageContent() {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [activeView, setActiveView] = useState<View>('laundry');
  const [userApartment, setUserApartment] = useState<string>('');
  const { isMobile, setOpenMobile } = useSidebar();
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  
  const currentUserApartment = userApartment || "Temp Apt"; // Use fetched apartment or fallback

  // Initialize mobile app settings
  useEffect(() => {
    initializeMobileApp();
  }, []);

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated and loading is complete
    if (!loading && !user) {
      // Add a small delay to ensure auth state is properly synchronized
      const timer = setTimeout(() => {
        router.push('/login');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  // Fetch user's apartment number from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserApartment(userData.apartmentNumber || '');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);


  const handleBuildingSelect = (buildingId: string) => {
    setSelectedBuilding(buildingId);
    setActiveView('laundry');
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  
  const handleViewSelect = (view: View) => {
    setActiveView(view);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const isTabu2View = ['fitness', 'tea', 'cafeteria', 'bar', 'propertyManagement'].includes(activeView);
  const headerTitle = isTabu2View ? 'TABU 2' : 'LaundryView';


  if (loading || !user) {
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
                <SidebarGroupLabel>Laundry</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => handleBuildingSelect('all')}
                      isActive={activeView === 'laundry' && selectedBuilding === 'all'}
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
                        isActive={activeView === 'laundry' && selectedBuilding === building.id}
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
            <SidebarMenuItem>
                <SidebarGroup>
                    <SidebarGroupLabel>TABU 2</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="Fitness room" onClick={() => handleViewSelect('fitness')} isActive={activeView === 'fitness'}>
                                <Dumbbell />
                                <span>Fitness room</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="Tea Room" onClick={() => handleViewSelect('tea')} isActive={activeView === 'tea'}>
                                <Coffee />
                                <span>Tea Room</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="Tabu Cafeteria" onClick={() => handleViewSelect('cafeteria')} isActive={activeView === 'cafeteria'}>
                                <Utensils />
                                <span>Tabu Cafeteria</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="Tabu Bar" onClick={() => handleViewSelect('bar')} isActive={activeView === 'bar'}>
                                <Martini />
                                <span>Tabu Bar</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarGroup>
                    <SidebarGroupLabel>Property Management</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="View Contacts" onClick={() => handleViewSelect('propertyManagement')} isActive={activeView === 'propertyManagement'}>
                                <Building />
                                <span>Contacts</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen min-h-[100dvh] w-full flex-col bg-background">
          <Header currentUser={userApartment} title={headerTitle} />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 pb-[env(safe-area-inset-bottom)]">
             {activeView === 'laundry' && <LaundryDashboard selectedBuildingId={selectedBuilding} currentUser={currentUserApartment} />}
             {activeView === 'fitness' && <FitnessRoom />}
             {activeView === 'cafeteria' && <TabuCafeteria />}
             {activeView === 'bar' && <TabuBar />}
             {activeView === 'tea' && <TeaRoom />}
             {activeView === 'propertyManagement' && <PropertyManagement />}
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
