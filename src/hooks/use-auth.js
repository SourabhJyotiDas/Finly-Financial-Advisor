'use client';

import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation'; // Using next/navigation for basic routing
import { useLocale } from 'next-intl';


export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname(); // Gets current path without locale

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  const logout = async () => {
    // Construct locale-prefixed callback URL
    // next-auth's signOut will navigate, and next-intl middleware will handle the prefix.
    await nextAuthSignOut({ callbackUrl: '/login' }); 
  };
  
  return { 
    session, 
    user: session?.user || null,
    isLoading, 
    isAuthenticated,
    logout 
  };
}
