'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth'; // Will be our new useAuth
import { Chrome } from 'lucide-react'; // Using Chrome icon for Google
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      await login();
      // signIn will redirect, toast might not be seen unless login fails before redirect
    } catch (error) {
      console.error("Google Sign-In failed", error);
      toast({
        title: 'Login Failed',
        description: 'Could not sign in with Google. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        <CardDescription>Sign in with your Google account to access Finly.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={handleGoogleSignIn} className="w-full" disabled={isLoading}>
          <Chrome className="mr-2 h-5 w-5" />
          {isLoading ? 'Redirecting...' : 'Sign in with Google'}
        </Button>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Access your financial dashboard securely with Google.
        </p>
         <p className="mt-2 text-center text-sm text-muted-foreground">
          Don&apos;t have an account? Signing in with Google will create one for you.
        </p>
      </CardContent>
    </Card>
  );
}
