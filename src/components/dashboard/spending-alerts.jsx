'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { spendingSpikeAlerts } from '@/ai/flows/spending-spike-alerts';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, BellRing, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function SpendingAlerts({ expenses, user }) {
  const t = useTranslations('SpendingAlerts');
  const tCategories = useTranslations('ExpenseForm.categories');
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getCategoryDisplayName = (categoryKey) => {
    return tCategories(categoryKey.toLowerCase()) || categoryKey;
  };

  const handleCheckSpikes = async () => {
    if (!user || !user._id) { 
      toast({ title: t('errorUserNotFound'), description: t('errorUserNotFoundDesc'), variant: 'destructive'});
      return;
    }
    if (expenses.length < 3) { 
        toast({ title: t('errorNotEnoughData'), description: t('errorNotEnoughDataDesc'), variant: 'default' });
        return;
    }

    setIsLoading(true);
    setAlerts([]);

    const input = {
      userId: user._id, 
      expenses: expenses.map(e => ({ category: e.category, amount: e.amount, date: e.date })),
    };

    try {
      const result = await spendingSpikeAlerts(input);
      setAlerts(result.alerts); // AI result, message content might not be translated directly
      if (result.alerts.length > 0) {
        toast({ title: t('spikesDetectedTitle'), description: t('spikesDetectedDesc'), variant: 'destructive' });
      } else {
        toast({ title: t('noSpikesTitle'), description: t('noSpikesDesc') });
      }
    } catch (error) {
      console.error('Error getting spending alerts:', error);
      toast({ title: 'Error', description: t('errorCheckSpikes'), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-6 w-6 text-primary" />
          {t('cardTitle')}
        </CardTitle>
        <CardDescription>{t('cardDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleCheckSpikes} disabled={isLoading || expenses.length < 1} className="w-full">
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('checkingSpikesButton')}</>
          ) : (
            t('checkSpikesButton')
          )}
        </Button>
        
        {alerts.length > 0 && (
          <div className="mt-4 space-y-2">
            {alerts.map((alert, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{t('alertSpikeIn', { category: getCategoryDisplayName(alert.category) })}</AlertTitle>
                <AlertDescription>
                  {/* AI message might not be fully translatable here, but we template part of it. */}
                  {t('alertMessage', { message: alert.message, spikeAmount: alert.spikeAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) })}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
        {!isLoading && alerts.length === 0 && expenses.length > 0 && (
            <p className="text-sm text-muted-foreground text-center pt-2">{t('noSpikesOrAnalyze')}</p>
        )}
         { expenses.length === 0 && !isLoading && (
            <p className="text-sm text-muted-foreground text-center pt-2">{t('addExpensesFirst')}</p>
        )}
      </CardContent>
    </Card>
  );
}
