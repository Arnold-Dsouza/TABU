export type MachineStatus = 'available' | 'in-use';

export interface Machine {
  id: string;
  name: string;
  type: 'washer' | 'dryer';
  status: MachineStatus;
  timerEnd: number | null;
  apartmentUser: string | null;
}

export interface Building {
  id: string;
  name: string;
  machines: Machine[];
}
