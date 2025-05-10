'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton'; 

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth(); // Using new useAuth
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
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
        <p className="text-center text-muted-foreground">Loading Finly...</p>
      </div>
    </div>
  );
}
