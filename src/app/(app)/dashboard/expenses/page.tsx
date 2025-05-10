'use client';

import { useState, useEffect } from 'react';
import { ExpenseForm } from '@/components/dashboard/expense-form';
import { RecentExpenses } from '@/components/dashboard/recent-expenses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Expense } from '@/lib/types';
import { ListChecks } from 'lucide-react';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const storedExpenses = localStorage.getItem('finpath_expenses');
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    } else {
      // Initialize with some mock expenses if none are stored for demo purposes
      const mockExpenses: Expense[] = [
        { id: '1', description: 'Lunch', amount: 12.00, category: 'food', date: new Date(Date.now() - 86400000 * 1).toISOString() },
      ];
      setExpenses(mockExpenses);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('finpath_expenses', JSON.stringify(expenses));
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

        <Card className="shadow-lg md:col-span-2"> {/* Make recent expenses take full width on larger screens or span 2 cols if preferred */}
          <CardHeader>
            <CardTitle>All Expenses</CardTitle>
            <CardDescription>View and manage all your tracked expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentExpenses expenses={expenses} onDeleteExpense={handleDeleteExpense} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
