export interface Expense {
  _id?: string; // MongoDB ID
  id?: string; // Could be same as _id or a separate client-generated ID if needed before save
  userId: string; // Foreign key to User
  description: string;
  amount: number;
  category: 'food' | 'rent' | 'transport' | 'entertainment' | 'utilities' | 'other';
  date: string; // ISO string date
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserProfile {
  _id?: string; // MongoDB ID
  userId: string; // Foreign key to NextAuth User ID
  email: string; // Usually synced from NextAuth user
  name?: string;
  income?: number;
  financialGoals?: string;
  createdAt?: Date;
  updatedAt?: Date;
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

// localStorage keys are no longer needed
// export const AUTH_KEY = 'finly_auth_user';
// export const EXPENSES_KEY = 'finly_expenses';
// export const USER_PROFILE_KEY = 'finly_user_profile';
