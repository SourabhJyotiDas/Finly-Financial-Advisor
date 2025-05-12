"use client";

import { useState, useEffect, useCallback } from "react";
import { ExpenseForm } from "@/components/dashboard/expense-form";
import { RecentExpenses } from "@/components/dashboard/recent-expenses";
import { SpendingAlerts } from "@/components/dashboard/spending-alerts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListChecks, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function ExpensesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsFetchingData(true);
    try {
      const profileResponse = await fetch("/api/profile");
      if (!profileResponse.ok) throw new Error("Failed to fetch profile");
      const profileData = await profileResponse.json();
      setUserProfile(profileData);

      const expensesResponse = await fetch("/api/expenses");
      if (!expensesResponse.ok) throw new Error("Failed to fetch expenses");
      const expensesData = await expensesResponse.json();
      setExpenses(expensesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Could not load your financial data.",
        variant: "destructive",
      });
    } finally {
      setIsFetchingData(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user && !authLoading) {
      fetchData();
    }
  }, [user, authLoading, fetchData]);

  const handleAddExpense = async (expenseData) => {
    if (!user) return;
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });
      if (!response.ok) {
        throw new Error("Failed to add expense");
      }
      const newExpense = await response.json();
      setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
      toast({
        title: "Expense Added",
        description: `${newExpense.description} added.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not add expense.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!user) return;
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }
      setExpenses((prevExpenses) =>
        prevExpenses.filter((exp) => (exp._id || exp.id) !== expenseId)
      );
      toast({
        title: "Expense Deleted",
        description: "Expense removed successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not delete expense.",
        variant: "destructive",
      });
    }
  };

  if (authLoading || isFetchingData) {
    return (
      <div className="container mx-auto px-0 py-0 space-y-6">
        <div className="flex items-center gap-4">
          <ListChecks className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Manage Your Expenses</h1>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Loading Data...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <CardDescription>
              Keep a detailed record of your spending.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseForm onAddExpense={handleAddExpense} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <SpendingAlerts expenses={expenses} user={userProfile} />
        </div>
      </div>

      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>
            View and manage all your tracked expenses.
          </CardDescription>
        </CardHeader>

        <CardContent className=" overflow-x-auto w-screen md:w-auto">
          <RecentExpenses
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
          />
        </CardContent>
      </Card>
    </div>
  );
}
