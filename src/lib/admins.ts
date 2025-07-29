
// src/lib/admins.ts

/**
 * A configuration object for administrative privileges for each TABU 2 page.
 * Add the 5-digit apartment number as a string to the corresponding array to grant edit access.
 * e.g., fitnessRoom: ['12345', '67890']
 */
interface AdminAccess {
  fitnessRoom: string[];
  teaRoom: string[];
  tabuCafeteria: string[];
  tabuBar: string[];
}

export const adminAccess: AdminAccess = {
  fitnessRoom: ['42345'],
  teaRoom: ['42345'],
  tabuCafeteria: ['42345'],
  tabuBar: ['42345'],
};
