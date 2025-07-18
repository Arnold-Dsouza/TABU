import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { adminAccess } from './admins';

type PageType = 'fitnessRoom' | 'teaRoom' | 'tabuCafeteria' | 'tabuBar';

export const useAdminAccess = (pageType: PageType) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userApartment, setUserApartment] = useState<string>('');
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const apartmentNumber = userData.apartmentNumber || '';
            setUserApartment(apartmentNumber);
            
            // Check if user has admin access for this page
            const hasAccess = adminAccess[pageType].includes(apartmentNumber);
            setIsAdmin(hasAccess);
            
            console.log(`Admin check for ${pageType}:`, {
              apartment: apartmentNumber,
              allowedApartments: adminAccess[pageType],
              hasAccess
            });
          }
        } catch (error) {
          console.error('Error fetching user data for admin check:', error);
        }
      }
    };

    if (!loading) {
      fetchUserData();
    }
  }, [user, loading, pageType]);

  return { isAdmin, userApartment, loading };
};
