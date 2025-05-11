'use client';

import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';


export function useAuth() {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  const logout = async () => {
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
