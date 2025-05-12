'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Using next/navigation for basic routing
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';
// import { usePathname } from 'next-intl/client'; // For locale-aware pathname if needed // Removed as it's unused and causing error

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations('HomePage');
  // const pathname = usePathname(); // Removed as it's unused

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // next-intl middleware will handle prefixing based on current locale
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="space-y-4 p-4 w-full max-w-sm">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-10 w-1/2 mx-auto" />
        <p className="text-center text-muted-foreground">{t('loadingFinly')}</p>
      </div>
    </div>
  );
}
