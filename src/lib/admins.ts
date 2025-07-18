
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
  fitnessRoom: ['40211'],
  teaRoom: ['40211'],
  tabuCafeteria: ['40211'],
  tabuBar: ['40211'],
};
