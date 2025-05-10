'use client';

import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import type { Session } from 'next-auth';
// No need for signIn here, as components will call it directly with provider specifics.

interface AuthState {
  session: Session | null;
  user: Session['user'] | null;
  isLoading: boolean; // status === 'loading'
  isAuthenticated: boolean; // status === 'authenticated'
  // login: () => Promise<void>; // Removed, components will call signIn directly
  logout: () => Promise<void>;
}

export function useAuth(): AuthState {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  // Login function is removed. Components will call `signIn('google', ...)` or 
  // `signIn('credentials', { email, password, ... })` directly.

  const logout = async () => {
    // Specify callbackUrl to ensure user is redirected after logout
    await nextAuthSignOut({ callbackUrl: '/login' });
  };
  
  return { 
    session, 
    user: session?.user || null,
    isLoading, 
    isAuthenticated,
    // login, // Removed
    logout 
  };
}
