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
import { useTranslations } from 'next-intl';

export function LoginForm() {
  const t = useTranslations('LoginForm');
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
      // next-intl middleware handles locale for callbackUrl
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error("Google Sign-In failed", error);
      toast({
        title: t('loginFailedTitle'),
        description: t('loginFailedGoogle'),
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
      // next-intl middleware handles locale for callbackUrl
      router.push('/dashboard'); 
      toast({ title: t('loginSuccessfulTitle'), description: t('loginSuccessfulDescription') });
      
    } catch (error) {
      console.error("Credentials Sign-In failed", error);
      toast({
        title: t('loginFailedTitle'),
        description: error.message.includes("No user found") || error.message.includes("Incorrect password") ? t('loginFailedCredentials') : (error.message || t('loginUnknownError')),
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
        <CardTitle className="text-2xl">{t('welcomeBack')}</CardTitle>
        <CardDescription>{t('signInToAccess')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('emailLabel')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('passwordLabel')}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
            <LogIn className="mr-2 h-5 w-5" />
            {isCredentialsLoading ? t('signingInButton') : t('signInButton')}
          </Button>
        </form>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t('orContinueWith')}
            </span>
          </div>
        </div>

        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={isLoading || isCredentialsLoading}>
          <Chrome className="mr-2 h-5 w-5" />
          {isGoogleLoading ? t('redirectingGoogle') : t('signInWithGoogle')}
        </Button>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        <p>
          {t('dontHaveAccount')}{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            {t('signUpLink')}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
