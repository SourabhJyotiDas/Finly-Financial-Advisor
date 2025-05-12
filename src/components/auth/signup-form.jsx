'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { Chrome, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function SignupForm() {
  const t = useTranslations('SignupForm');
  const { isLoading: authIsLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);


  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error("Google Sign-Up failed", error);
      toast({
        title: t('signupFailedTitle'),
        description: t('signupFailedGoogle'),
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleCredentialsSignUp = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: 'Error', description: t('passwordsDoNotMatch'), variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('registrationFailed'));
      }

      const signInResult = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.error) {
        toast({ title: t('registrationSuccessfulLoginFailed'), description: signInResult.error, variant: 'destructive' });
        router.push('/login'); 
      } else if (signInResult?.ok) {
        toast({ title: t('accountCreatedTitle'), description: t('accountCreatedDescription') });
        router.push('/dashboard'); 
      }
    } catch (error) {
      console.error("Credentials Sign-Up failed", error);
      toast({
        title: t('signupFailedTitle'),
        description: error.message || t('signupFailedGoogle'), // Assuming general error if not specific
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = authIsLoading || isSubmitting || isGoogleLoading;

  return (
    <Card className="shadow-xl w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <UserPlus className="h-7 w-7 text-primary" /> {t('createAccountTitle')}
        </CardTitle>
        <CardDescription>{t('joinFinlyDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleCredentialsSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('nameLabel')}</Label>
            <Input
              id="name"
              type="text"
              placeholder={t('namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">{t('emailLabel')}</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">{t('passwordLabel')}</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t('confirmPasswordLabel')}</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder={t('passwordPlaceholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            <UserPlus className="mr-2 h-5 w-5" />
            {isSubmitting ? t('creatingAccountButton') : t('createAccountButton')}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t('orSignUpWith')}
            </span>
          </div>
        </div>

        <Button onClick={handleGoogleSignUp} variant="outline" className="w-full" disabled={isLoading}>
          <Chrome className="mr-2 h-5 w-5" />
          {isGoogleLoading ? t('redirectingGoogle') : t('signUpWithGoogle')}
        </Button>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        <p>
          {t('alreadyHaveAccount')}{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            {t('logInLink')}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
