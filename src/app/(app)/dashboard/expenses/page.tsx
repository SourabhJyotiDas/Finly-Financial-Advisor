'use client';

import { useState, useEffect } from 'react';
import { ExpenseForm } from '@/components/dashboard/expense-form';
import { RecentExpenses } from '@/components/dashboard/recent-expenses';
import { SpendingAlerts } from '@/components/dashboard/spending-alerts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Expense, UserProfile } from '@/lib/types';
import { ListChecks } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { USER_PROFILE_KEY, EXPENSES_KEY } from '@/lib/types';

export default function ExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedExpenses = localStorage.getItem(EXPENSES_KEY);
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    } else {
      const mockExpenses: Expense[] = [
        { id: '1', description: 'Lunch', amount: 12.00, category: 'food', date: new Date(Date.now() - 86400000 * 1).toISOString() },
      ];
      setExpenses(mockExpenses);
    }

    if (user) {
      const storedProfileStr = localStorage.getItem(USER_PROFILE_KEY);
      let currentProfile: UserProfile;
      if (storedProfileStr) {
        const storedProfile: UserProfile = JSON.parse(storedProfileStr);
        if (storedProfile.id === user.id) {
          currentProfile = storedProfile;
        } else {
          currentProfile = {
            id: user.id,
            email: user.email,
            name: user.email.split('@')[0],
            income: undefined,
            financialGoals: 'Set your financial goals in Settings.'
          };
          localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(currentProfile));
        }
      } else {
        currentProfile = {
          id: user.id,
          email: user.email,
          name: user.email.split('@')[0],
          income: undefined,
          financialGoals: 'Set your financial goals in Settings.'
        };
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(currentProfile));
      }
      setUserProfile(currentProfile);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (expense: Expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses((prevExpenses) => prevExpenses.filter(exp => exp.id !== expenseId));
  };

  return (
    <div className="container mx-auto px-0 py-0 space-y-6">
      <div className="flex items-center gap-4">
        <ListChecks className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Manage Your Expenses</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
            <CardDescription>Keep a detailed record of your spending.</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseForm onAddExpense={handleAddExpense} />
          </CardContent>
        </Card>

        <div className="space-y-6">
           <SpendingAlerts expenses={expenses} user={userProfile} />
        </div>
      </div>
      
      <Card className="shadow-lg mt-6"> {/* Recent expenses below form and alerts */}
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>View and manage all your tracked expenses.</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentExpenses expenses={expenses} onDeleteExpense={handleDeleteExpense} />
        </CardContent>
      </Card>

    </div>
  );
}
