"use client";

import { useState, useEffect, useCallback } from "react";
import { FinancialSummaryCard } from "@/components/dashboard/financial-summary-card";
import { ExpenseForm } from "@/components/dashboard/expense-form";
import { RecentExpenses } from "@/components/dashboard/recent-expenses";
import { SavingTips } from "@/components/dashboard/saving-tips";
import {
  DollarSign,
  TrendingDown,
  PiggyBank,
  Landmark,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsFetchingData(true);
    try {
      // Fetch User Profile
      const profileResponse = await fetch("/api/profile");
      if (!profileResponse.ok) throw new Error("Failed to fetch profile");
      const profileData = await profileResponse.json();
      setUserProfile(profileData);

      // Fetch Expenses
      const expensesResponse = await fetch("/api/expenses");
      if (!expensesResponse.ok) throw new Error("Failed to fetch expenses");
      const expensesData = await expensesResponse.json();
      setExpenses(expensesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error fetching data",
        description: error.message,
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
      setExpenses((prevExpenses) =>
        [newExpense, ...prevExpenses].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
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
      <div className="container mx-auto px-0 py-0 flex flex-col items-center justify-center min-h-[calc(100vh-theme(space.32))]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savings = (userProfile?.income ?? 0) - totalExpenses; // Use ?? for income
  const savingsRate =
    userProfile?.income && userProfile.income > 0
      ? (savings / userProfile.income) * 100
      : 0;

  return (
    <div className="container mx-auto px-0 py-0">
      <div className="mb-6 p-6 bg-gradient-to-r from-primary to-teal-600 rounded-lg shadow-xl text-primary-foreground">
        <h1 className="text-3xl font-bold">
          Welcome back, {userProfile?.name || user?.name || user?.email}!
        </h1>
        <p className="text-teal-100">
          Here&apos;s your financial overview. Let&apos;s make today financially
          productive!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <FinancialSummaryCard
          title="Monthly Income"
          value={
            userProfile?.income !== undefined
              ? userProfile.income
              : "Set in Settings"
          }
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
          className={
            savings >= 0
              ? "bg-sky-50 dark:bg-sky-900/30 border-sky-500"
              : "bg-orange-50 dark:bg-orange-900/30 border-orange-500"
          }
          valueClassName={
            savings >= 0
              ? "text-sky-600 dark:text-sky-400"
              : "text-orange-600 dark:text-orange-400"
          }
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Track New Expense</CardTitle>
              <CardDescription>
                Log your spending to stay on top of your budget.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseForm onAddExpense={handleAddExpense} />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>
                A quick look at your latest transactions.
              </CardDescription>
            </CardHeader>
            <CardContent className=" overflow-x-auto w-screen">
              <RecentExpenses
                expenses={expenses}
                onDeleteExpense={handleDeleteExpense}
              />
            </CardContent>
          </Card>
        </div>

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
                Stay positive and focused on your financial journey. Small steps
                lead to big results!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
