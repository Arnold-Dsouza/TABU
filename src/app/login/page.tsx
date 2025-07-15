
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WashingMachine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LoginPage() {
  const [aptNumber, setAptNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (localStorage.getItem('laundryUser')) {
      router.push('/');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aptNumber.length !== 5) {
      toast({
        title: 'Error',
        description: 'Apartment number must be exactly 5 digits.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const userRef = doc(db, 'users', `apt-${aptNumber}`);

    try {
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        if (userDoc.data().isLoggedIn) {
          toast({
            title: 'Login Failed',
            description: 'This apartment is already logged in.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
      }

      // Log the user in
      await setDoc(userRef, { 
        isLoggedIn: true, 
        lastLogin: serverTimestamp(),
        apartmentNumber: aptNumber 
      }, { merge: true });

      localStorage.setItem('laundryUser', `Apt ${aptNumber}`);
      toast({
        title: 'Login Successful',
        description: `Welcome, Apt ${aptNumber}!`,
      });
      router.push('/');

    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast({
        title: 'Error',
        description: `Could not log in. ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
                <WashingMachine className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold font-headline">LaundryView</span>
            </div>
          <CardTitle>Resident Login</CardTitle>
          <CardDescription>Enter your apartment number to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apt-number">Apartment Number (Must be 5 digits)</Label>
              <Input
                id="apt-number"
                type="number"
                placeholder="e.g., 42101"
                value={aptNumber}
                onChange={(e) => setAptNumber(e.target.value.slice(0, 5))}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
