'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getPersonalizedSavingTips } from '@/ai/flows/personalized-saving-tips';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Loader2 } from 'lucide-react';

export function SavingTips({ expenses, userProfile }) {
  const [income, setIncome] = useState(undefined);
  const [financialGoals, setFinancialGoals] = useState('');
  const [spendingPatterns, setSpendingPatterns] = useState(''); 
  const [tips, setTips] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userProfile) {
      setIncome(userProfile.income); 
      setFinancialGoals(userProfile.financialGoals || ''); 
    }
  }, [userProfile]);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleGetTips = async () => {
    if (income === undefined || income === null || income <= 0) { 
      toast({ title: 'Valid Income Required', description: 'Please enter your monthly income or set a positive value in your profile settings.', variant: 'destructive' });
      return;
    }
    if (!financialGoals.trim()) {
      toast({ title: 'Financial Goals Required', description: 'Please describe your financial goals or set them in your profile settings.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setTips(null);

    const defaultSpendingPatterns = expenses.length > 0 
      ? `User spends on categories like ${[...new Set(expenses.map(e => e.category))].join(', ')}.`
      : 'User has not logged any expenses yet.';

    const input = {
      income,
      expenses: totalExpenses,
      financialGoals,
      spendingPatterns: spendingPatterns.trim() || defaultSpendingPatterns,
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
        <CardDescription>Get personalized advice to reach your financial goals faster. Ensure your profile income and goals are set in Settings for best results.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="income">Monthly Income (₹) (from Profile)</Label>
          <Input
            id="income"
            type="number"
            placeholder="Set in Profile Settings"
            value={income === undefined ? '' : income}
            onChange={(e) => setIncome(e.target.value ? parseFloat(e.target.value) : undefined)}
          />
           {userProfile?.income === undefined && <p className="text-xs text-muted-foreground pt-1">Tip: Set your income in Settings for it to auto-fill here.</p>}
        </div>
        <div>
          <Label htmlFor="financialGoals">Financial Goals (from Profile)</Label>
          <Textarea
            id="financialGoals"
            placeholder="Set in Profile Settings"
            value={financialGoals}
            onChange={(e) => setFinancialGoals(e.target.value)}
          />
          {userProfile?.financialGoals === undefined && <p className="text-xs text-muted-foreground pt-1">Tip: Set your financial goals in Settings for them to auto-fill here.</p>}
        </div>
        <div>
          <Label htmlFor="spendingPatterns">Optional: Further Describe Spending Habits</Label>
          <Textarea
            id="spendingPatterns"
            placeholder="e.g., I tend to overspend on dining out, or trying to reduce subscription costs."
            value={spendingPatterns}
            onChange={(e) => setSpendingPatterns(e.target.value)}
          />
           <p className="text-xs text-muted-foreground pt-1">If left blank, AI will infer from your expense categories.</p>
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
