'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Chrome, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SignupForm() {
  const { login, isLoading } = useAuth(); // login function now handles Google sign-in/sign-up
  const { toast } = useToast();

  const handleGoogleSignUp = async () => {
    try {
      await login(); 
      // signIn will redirect and handle new user creation via NextAuth events/callbacks
    } catch (error) {
      console.error("Google Sign-Up failed", error);
      toast({
        title: 'Signup Failed',
        description: 'Could not sign up with Google. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <UserPlus className="h-7 w-7 text-primary" /> Create your Finly Account
        </CardTitle>
        <CardDescription>Join Finly by signing up with your Google account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={handleGoogleSignUp} className="w-full" disabled={isLoading}>
          <Chrome className="mr-2 h-5 w-5" />
          {isLoading ? 'Redirecting...' : 'Sign up with Google'}
        </Button>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
