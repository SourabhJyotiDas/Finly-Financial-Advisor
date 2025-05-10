// Mock authentication functions using localStorage
// In a real app, this would interact with Firebase or another auth provider.

import { AUTH_KEY } from './types';

export interface MockUser {
  id: string;
  email: string;
}

export const login = (email: string): MockUser => {
  const user = { id: Date.now().toString(), email };
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }
  return user;
};

export const signup = (email: string): MockUser => {
  // In a real app, signup might have more logic (e.g., password)
  return login(email);
};

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
};

export const getAuthenticatedUser = (): MockUser | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(AUTH_KEY);
  return userStr ? JSON.parse(userStr) : null;
};
