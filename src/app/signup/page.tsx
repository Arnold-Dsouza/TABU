
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const apartment = formData.get('apartment') as string;

    try {
      // Create account with random password (user will reset it via email)
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email, 
        Math.random().toString(36).slice(-8)
      );
      
      // Store user info in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        apartmentNumber: apartment,
        isLoggedIn: false, // Initially false, they need to login after setting password
        createdAt: new Date(),
      });
      
      // Send email to set the password
      await sendPasswordResetEmail(auth, email);

      toast({
        title: 'Success!',
        description: 'Account created! Please check your email to set your password.',
      });
      
      router.push('/login');
    } catch (error: any) {
      let message = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already in use.';
      }
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <UserPlus className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold font-headline">TABU 2</span>
            </div>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>Enter your details to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="abc@gmail.com" 
                required 
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apartment">Apartment Number (5 digits)</Label>
              <Input
                id="apartment"
                name="apartment"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 42101"
                pattern="\d{5}"
                title="Apartment number must be exactly 5 digits."
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="underline hover:text-primary">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
