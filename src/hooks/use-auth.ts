'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Keep for navigation if needed after actions
import type { Session } from 'next-auth';

interface AuthState {
  session: Session | null;
  user: Session['user'] | null; // Simplified user object from session
  isLoading: boolean; // status === 'loading'
  isAuthenticated: boolean; // status === 'authenticated'
  login: () => Promise<void>; // Simplified login, triggers Google sign-in
  logout: () => Promise<void>;
}

export function useAuth(): AuthState {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  const login = async () => {
    // Redirects to NextAuth's Google sign-in page
    // Callback URL can be configured in NextAuth options or here
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const logout = async () => {
    await signOut({ callbackUrl: '/login' });
  };
  
  return { 
    session, 
    user: session?.user || null,
    isLoading, 
    isAuthenticated,
    login, 
    logout 
  };
}
