'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { Chrome, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Separator } from '../ui/separator';

export function LoginForm() {
  const { isLoading: authIsLoading } = useAuth(); 
  const { toast } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true); 
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error("Google Sign-In failed", error);
      toast({
        title: "Login Failed",
        description: "Could not sign in with Google. Please try again.",
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleCredentialsSignIn = async (event) => {
    event.preventDefault();
    setIsCredentialsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false, 
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
      router.push('/dashboard'); 
      toast({ title: "Login Successful", description: "Welcome back!" });
      
    } catch (error) {
      console.error("Credentials Sign-In failed", error);
      toast({
        title: "Login Failed",
        description: error.message.includes("No user found") || error.message.includes("Incorrect password") ? "Invalid email or password. Please try again." : (error.message || "An unknown error occurred during login."),
        variant: 'destructive',
      });
    } finally {
      setIsCredentialsLoading(false);
    }
  };
  
  const isLoading = authIsLoading || isCredentialsLoading || isGoogleLoading;

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
          <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
            <LogIn className="mr-2 h-5 w-5" />
            {isCredentialsLoading ? "Signing In..." : "Sign In"}
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

        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={isLoading || isCredentialsLoading}>
          <Chrome className="mr-2 h-5 w-5" />
          {isGoogleLoading ? "Redirecting..." : "Sign in with Google"}
        </Button>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        <p>
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
