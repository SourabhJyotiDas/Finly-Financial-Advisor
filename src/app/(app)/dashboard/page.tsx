'use client';

import { useState, useEffect } from 'react';
import { FinancialSummaryCard } from '@/components/dashboard/financial-summary-card';
import { ExpenseForm } from '@/components/dashboard/expense-form';
import { RecentExpenses } from '@/components/dashboard/recent-expenses';
import { SavingTips } from '@/components/dashboard/saving-tips';
import { DollarSign, TrendingDown, PiggyBank, Landmark } from 'lucide-react';
import type { Expense, UserProfile } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { USER_PROFILE_KEY, EXPENSES_KEY } from '@/lib/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedExpenses = localStorage.getItem(EXPENSES_KEY);
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    } else {
      const mockExpenses: Expense[] = [
        { id: '1', description: 'Groceries', amount: 75.50, category: 'food', date: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: '2', description: 'Netflix Subscription', amount: 15.99, category: 'entertainment', date: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: '3', description: 'Gasoline', amount: 40.00, category: 'transport', date: new Date(Date.now() - 86400000 * 1).toISOString() },
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

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savings = (userProfile?.income || 0) - totalExpenses;
  const savingsRate = (userProfile?.income && userProfile.income > 0) ? (savings / userProfile.income) * 100 : 0;

  return (
    <div className="container mx-auto px-0 py-0">
      <div className="mb-6 p-6 bg-gradient-to-r from-primary to-teal-600 rounded-lg shadow-xl text-primary-foreground">
        <h1 className="text-3xl font-bold">Welcome back, {userProfile?.name || user?.email}!</h1>
        <p className="text-teal-100">Here&apos;s your financial overview. Let&apos;s make today financially productive!</p>
      </div>

      {/* Financial Summaries */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <FinancialSummaryCard
          title="Monthly Income"
          value={userProfile?.income !== undefined ? userProfile.income : 'Set in Settings'}
          icon={<Landmark className="h-5 w-5" />}
          description="Your estimated monthly earnings."
          className="bg-green-50 dark:bg-green-900/30 border-green-500"
          valueClassName="text-green-600 dark:text-green-400"
        />
        <FinancialSummaryCard
          title="Total Expenses"
          value={totalExpenses}
          icon={<TrendingDown className="h-5 w-5" />}
          description="Sum of all tracked expenses."
          className="bg-red-50 dark:bg-red-900/30 border-red-500"
          valueClassName="text-red-600 dark:text-red-400"
        />
        <FinancialSummaryCard
          title="Net Savings"
          value={savings}
          icon={<DollarSign className="h-5 w-5" />}
          description="Income minus expenses."
          className={savings >= 0 ? "bg-sky-50 dark:bg-sky-900/30 border-sky-500" : "bg-orange-50 dark:bg-orange-900/30 border-orange-500"}
          valueClassName={savings >= 0 ? "text-sky-600 dark:text-sky-400" : "text-orange-600 dark:text-orange-400"}
        />
        <FinancialSummaryCard
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          icon={<PiggyBank className="h-5 w-5" />}
          description="Percentage of income saved."
           className="bg-purple-50 dark:bg-purple-900/30 border-purple-500"
           valueClassName="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Main Content Area: Expenses and AI Tools */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Column 1: Expense Form & Recent Expenses */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Track New Expense</CardTitle>
              <CardDescription>Log your spending to stay on top of your budget.</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseForm onAddExpense={handleAddExpense} />
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>A quick look at your latest transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentExpenses expenses={expenses} onDeleteExpense={handleDeleteExpense} />
            </CardContent>
          </Card>
        </div>

        {/* Column 2: AI Advisor Tools */}
        <div className="lg:col-span-1 space-y-6">
          <SavingTips expenses={expenses} userProfile={userProfile} />
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Financial Wellness</CardTitle>
            </CardHeader>
            <CardContent>
              <Image 
                src="https://picsum.photos/400/200" 
                alt="Calm finance illustration"
                data-ai-hint="finance wellness" 
                width={400} 
                height={200} 
                className="rounded-md object-cover" 
              />
              <p className="mt-4 text-sm text-muted-foreground">
                Stay positive and focused on your financial journey. Small steps lead to big results!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
