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
import { useTranslations } from 'next-intl';

export function SavingTips({ expenses, userProfile }) {
  const t = useTranslations('SavingTips');
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
      toast({ title: t('errorIncomeRequired'), description: t('errorIncomeRequiredDesc'), variant: 'destructive' });
      return;
    }
    if (!financialGoals.trim()) {
      toast({ title: t('errorGoalsRequired'), description: t('errorGoalsRequiredDesc'), variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setTips(null);

    const defaultSpendingPatterns = expenses.length > 0 
      ? `User spends on categories like ${[...new Set(expenses.map(e => e.category))].join(', ')}.` // This part is not translated, AI will process it.
      : 'User has not logged any expenses yet.'; // This part is not translated

    const input = {
      income,
      expenses: totalExpenses,
      financialGoals,
      spendingPatterns: spendingPatterns.trim() || defaultSpendingPatterns,
    };

    try {
      const result = await getPersonalizedSavingTips(input);
      setTips(result.savingTips); // AI output is not translated here
      toast({ title: t('tipsGeneratedTitle'), description: t('tipsGeneratedDesc') });
    } catch (error) {
      console.error('Error getting saving tips:', error);
      toast({ title: 'Error', description: t('errorGenerateTips'), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-accent" />
          {t('cardTitle')}
        </CardTitle>
        <CardDescription>{t('cardDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="income">{t('incomeLabel')}</Label>
          <Input
            id="income"
            type="number"
            placeholder={t('incomePlaceholder')}
            value={income === undefined ? '' : income}
            onChange={(e) => setIncome(e.target.value ? parseFloat(e.target.value) : undefined)}
          />
           {userProfile?.income === undefined && <p className="text-xs text-muted-foreground pt-1">{t('incomeTip')}</p>}
        </div>
        <div>
          <Label htmlFor="financialGoals">{t('goalsLabel')}</Label>
          <Textarea
            id="financialGoals"
            placeholder={t('goalsPlaceholder')}
            value={financialGoals}
            onChange={(e) => setFinancialGoals(e.target.value)}
          />
          {userProfile?.financialGoals === undefined && <p className="text-xs text-muted-foreground pt-1">{t('goalsTip')}</p>}
        </div>
        <div>
          <Label htmlFor="spendingPatterns">{t('spendingPatternsLabel')}</Label>
          <Textarea
            id="spendingPatterns"
            placeholder={t('spendingPatternsPlaceholder')}
            value={spendingPatterns}
            onChange={(e) => setSpendingPatterns(e.target.value)}
          />
           <p className="text-xs text-muted-foreground pt-1">{t('spendingPatternsTip')}</p>
        </div>
        
        {tips && (
          <div className="mt-4 p-4 bg-accent/10 border border-accent/30 rounded-md">
            <h4 className="font-semibold text-accent-foreground mb-2">{t('yourPersonalizedTips')}</h4>
            <p className="text-sm whitespace-pre-line">{tips}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGetTips} disabled={isLoading} className="w-full">
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('generatingTipsButton')}</>
          ) : (
            t('getTipsButton')
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
