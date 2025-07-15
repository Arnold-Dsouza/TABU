
export type MachineStatus = 'available' | 'in-use' | 'out-of-order';

export interface Report {
  id: string;
  userId: string;
  issue: string;
}

export interface Warning {
  id: string;
  userId: string;
  message: string;
}

export interface Machine {
  id: string;
  name: string;
  type: 'washer' | 'dryer';
  status: MachineStatus;
  timerEnd: number | null;
  apartmentUser: string | null;
  reports: Report[];
  warnings: Warning[];
}

export interface Building {
  id: string;
  name: string;
  machines: Machine[];
}

// TABU 2 Types
export interface ScheduleItem {
  day: string;
  hours: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: string;
}

export interface Mentor {
    id: string;
    name: string;
    number: string;
}

export interface MentorBuilding {
    id: string;
    building: string;
    mentors: Mentor[];
}

export interface PageContent {
  id: string;
  schedule?: ScheduleItem[];
  upcomingEvents?: EventItem[];
  passedEvents?: EventItem[];
  specialMenu?: MenuItem[];
  usualMenu?: MenuItem[];
  mentorData?: MentorBuilding[];
  privatePartiesContact?: string;
}
