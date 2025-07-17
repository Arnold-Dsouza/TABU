
'use server';

import { auth, db } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export async function signUpAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const apartment = formData.get('apartment') as string;
  
  try {
    // Note: No password is provided here, so the account is created but not usable for login yet.
    const userCredential = await createUserWithEmailAndPassword(auth, email, Math.random().toString(36).slice(-8));
    
    // Store user info in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: userCredential.user.email,
      apartmentNumber: apartment,
      createdAt: new Date(),
    });
    
    // Send email to set the password
    await sendPasswordResetEmail(auth, email);

    return { success: true, message: 'Account created! Please check your email to set your password.' };
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      return { success: false, message: 'This email is already in use.' };
    }
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
}

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true, message: 'Login successful!' };
    } catch (error: any) {
        if (error.code === 'auth/invalid-credential') {
            return { success: false, message: 'Invalid email or password.' };
        }
        return { success: false, message: 'An unexpected error occurred. Please try again.' };
    }
}
