
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WashingMachine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptNumber.trim()) {
      toast({
        title: 'Error',
        description: 'Apartment number cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Simulate a check if the user is already logged in elsewhere.
    // In a real app, this would be a check against a database.
    // For this simulation, we'll just log the user in.
    setTimeout(() => {
      localStorage.setItem('laundryUser', `Apt ${aptNumber}`);
      toast({
        title: 'Login Successful',
        description: `Welcome, Apt ${aptNumber}!`,
      });
      router.push('/');
      setIsLoading(false);
    }, 1000);
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
              <Label htmlFor="apt-number">Apartment Number</Label>
              <Input
                id="apt-number"
                type="number"
                placeholder="e.g., 101"
                value={aptNumber}
                onChange={(e) => setAptNumber(e.target.value)}
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
