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
import { useTranslations } from "next-intl";

export default function ExpensesPage() {
  const t = useTranslations("ExpensesPage");
  const tDashboard = useTranslations("DashboardPage"); // For shared translations like error messages
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
        description: t("errorLoadingData"),
        variant: "destructive",
      });
    } finally {
      setIsFetchingData(false);
    }
  }, [user, toast, t]);

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
        title: tDashboard("expenseAdded"),
        description: tDashboard("expenseAddedDesc", {description: newExpense.description }),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: tDashboard("errorAddExpense"),
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
        title: tDashboard("expenseDeleted"),
        description: tDashboard("expenseDeletedDesc"),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: tDashboard("errorDeleteExpense"),
        variant: "destructive",
      });
    }
  };

  if (authLoading || isFetchingData) {
    return (
      <div className="container mx-auto px-0 py-0 space-y-6">
        <div className="flex items-center gap-4">
          <ListChecks className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{t("manageExpenses")}</h1>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t("loadingData")}</CardTitle>
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
        <h1 className="text-3xl font-bold">{t("manageExpenses")}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t("addNewExpense")}</CardTitle>
            <CardDescription>
              {t("addNewExpenseDesc")}
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
          <CardTitle>{t("allExpenses")}</CardTitle>
          <CardDescription>
            {t("allExpensesDesc")}
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
