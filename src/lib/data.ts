import type { Building } from './types';

export const initialBuildingsData: Building[] = [
  {
    id: 'bldg-58',
    name: 'Building 58',
    machines: [
      { id: 'w1-58', name: 'Washer 1', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null },
      { id: 'w2-58', name: 'Washer 2', type: 'washer', status: 'in-use', timerEnd: Date.now() + 2700000, apartmentUser: 'Apt 101' },
      { id: 'w3-58', name: 'Washer 3', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null },
      { id: 'd1-58', name: 'Dryer 1', type: 'dryer', status: 'available', timerEnd: null, apartmentUser: null },
    ],
  },
  {
    id: 'bldg-60',
    name: 'Building 60',
    machines: [
      { id: 'w1-60', name: 'Washer 1', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null },
      { id: 'w2-60', name: 'Washer 2', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null },
      { id: 'w3-60', name: 'Washer 3', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null },
      { id: 'd1-60', name: 'Dryer 1', type: 'dryer', status: 'in-use', timerEnd: Date.now() + 1800000, apartmentUser: 'Apt 204' },
    ],
  },
  {
    id: 'bldg-62',
    name: 'Building 62',
    machines: [
      { id: 'w1-62', name: 'Washer 1', type: 'washer', status: 'in-use', timerEnd: Date.now() + 600000, apartmentUser: 'Apt 302' },
      { id: 'w2-62', name: 'Washer 2', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null },
      { id: 'w3-62', name: 'Washer 3', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null },
      { id: 'd1-62', name: 'Dryer 1', type: 'dryer', status: 'available', timerEnd: null, apartmentUser: null },
    ],
  },
  {
    id: 'bldg-64',
    name: 'Building 64',
    machines: [
      { id: 'w1-64', name: 'Washer 1', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null },
      { id: 'w2-64', name: 'Washer 2', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null },
      { id: 'w3-64', name: 'Washer 3', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null },
      { id: 'd1-64', name: 'Dryer 1', type: 'dryer', status: 'available', timerEnd: null, apartmentUser: null },
    ],
  },
];
