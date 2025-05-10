'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { Chrome, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Separator } from '../ui/separator';

export function LoginForm() {
  const { isLoading: authIsLoading } = useAuth(); // Get general auth loading state
  const { toast } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsCredentialsLoading(true); // Use same loading state or a separate one for Google
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error("Google Sign-In failed", error);
      toast({
        title: 'Login Failed',
        description: 'Could not sign in with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCredentialsLoading(false);
    }
  };

  const handleCredentialsSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setIsCredentialsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false, // Handle redirect manually to show errors
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
      if (result?.ok && result.url) {
         router.push('/dashboard'); // Or result.url if it's dynamic
         toast({ title: 'Login Successful', description: 'Welcome back!' });
      } else if (result?.ok && !result.url) {
        // Should not happen with redirect: false if signIn is successful
        router.push('/dashboard');
        toast({ title: 'Login Successful', description: 'Welcome back!' });
      } else {
        // Handle other cases if necessary, though error should be caught
        throw new Error('An unknown error occurred during login.');
      }
    } catch (error: any) {
      console.error("Credentials Sign-In failed", error);
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCredentialsLoading(false);
    }
  };
  
  const isLoading = authIsLoading || isCredentialsLoading;

  return (
    <Card className="shadow-xl w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        <CardDescription>Sign in to access your Finly dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            <LogIn className="mr-2 h-5 w-5" />
            {isCredentialsLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={isLoading}>
          <Chrome className="mr-2 h-5 w-5" />
          {isCredentialsLoading && !email ? 'Redirecting...' : 'Sign in with Google'}
        </Button>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
