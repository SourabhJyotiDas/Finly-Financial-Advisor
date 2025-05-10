export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: 'food' | 'rent' | 'transport' | 'entertainment' | 'utilities' | 'other';
  date: string; // ISO string date
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  income?: number;
  financialGoals?: string;
}

export interface AISavingTip {
  tip: string;
  category?: string; // Optional category the tip relates to
}

export interface AISpendingAlert {
  category: string;
  spikeAmount: number;
  message: string;
}

export const AUTH_KEY = 'finly_auth_user';
export const EXPENSES_KEY = 'finly_expenses';
export const USER_PROFILE_KEY = 'finly_user_profile';
