'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { MockUser } from '@/lib/auth';
import { getAuthenticatedUser, login as apiLogin, logout as apiLogout, signup as apiSignup } from '@/lib/auth';

interface AuthState {
  user: MockUser | null;
  isLoading: boolean;
  loginUser: (email: string) => Promise<MockUser | null>;
  signupUser: (email: string) => Promise<MockUser | null>;
  logoutUser: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getAuthenticatedUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const loginUser = useCallback(async (email: string): Promise<MockUser | null> => {
    setIsLoading(true);
    try {
      const loggedInUser = apiLogin(email);
      setUser(loggedInUser);
      router.push('/dashboard');
      return loggedInUser;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const signupUser = useCallback(async (email: string): Promise<MockUser | null> => {
    setIsLoading(true);
    try {
      const signedUpUser = apiSignup(email);
      setUser(signedUpUser);
      router.push('/dashboard');
      return signedUpUser;
    } catch (error) {
      console.error("Signup failed:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logoutUser = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    apiLogout();
    setUser(null);
    router.push('/login');
    setIsLoading(false);
  }, [router]);
  
  return { user, isLoading, loginUser, signupUser, logoutUser };
}
