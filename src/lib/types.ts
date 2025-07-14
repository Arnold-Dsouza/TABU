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
