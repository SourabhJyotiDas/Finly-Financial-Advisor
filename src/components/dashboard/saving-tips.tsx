'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getPersonalizedSavingTips, type PersonalizedSavingTipsInput } from '@/ai/flows/personalized-saving-tips';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Loader2 } from 'lucide-react';
import type { Expense } from '@/lib/types';

interface SavingTipsProps {
  expenses: Expense[]; // To calculate total monthly expenses
}

export function SavingTips({ expenses }: SavingTipsProps) {
  const [income, setIncome] = useState<number | undefined>(undefined);
  const [financialGoals, setFinancialGoals] = useState('');
  const [spendingPatterns, setSpendingPatterns] = useState(''); // Could be auto-derived too
  const [tips, setTips] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleGetTips = async () => {
    if (!income) {
      toast({ title: 'Income Required', description: 'Please enter your monthly income.', variant: 'destructive' });
      return;
    }
    if (!financialGoals) {
      toast({ title: 'Financial Goals Required', description: 'Please describe your financial goals.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setTips(null);

    const input: PersonalizedSavingTipsInput = {
      income,
      expenses: totalExpenses,
      financialGoals,
      spendingPatterns: spendingPatterns || `User spends on categories like ${[...new Set(expenses.map(e => e.category))].join(', ')}.`,
    };

    try {
      const result = await getPersonalizedSavingTips(input);
      setTips(result.savingTips);
      toast({ title: 'Tips Generated!', description: 'AI has provided personalized saving tips.' });
    } catch (error) {
      console.error('Error getting saving tips:', error);
      toast({ title: 'Error', description: 'Could not generate saving tips.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-accent" />
          AI Powered Saving Tips
        </CardTitle>
        <CardDescription>Get personalized advice to reach your financial goals faster.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="income">Monthly Income ($)</Label>
          <Input
            id="income"
            type="number"
            placeholder="e.g., 3000"
            value={income === undefined ? '' : income}
            onChange={(e) => setIncome(e.target.value ? parseFloat(e.target.value) : undefined)}
          />
        </div>
        <div>
          <Label htmlFor="financialGoals">Financial Goals</Label>
          <Textarea
            id="financialGoals"
            placeholder="e.g., Save for a vacation, pay off student loans"
            value={financialGoals}
            onChange={(e) => setFinancialGoals(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="spendingPatterns">Optional: Describe Spending Habits</Label>
          <Textarea
            id="spendingPatterns"
            placeholder="e.g., I tend to overspend on dining out."
            value={spendingPatterns}
            onChange={(e) => setSpendingPatterns(e.target.value)}
          />
        </div>
        
        {tips && (
          <div className="mt-4 p-4 bg-accent/10 border border-accent/30 rounded-md">
            <h4 className="font-semibold text-accent-foreground mb-2">Your Personalized Tips:</h4>
            <p className="text-sm whitespace-pre-line">{tips}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGetTips} disabled={isLoading} className="w-full">
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
          ) : (
            'Get Saving Tips'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
