'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { spendingSpikeAlerts } from '@/ai/flows/spending-spike-alerts';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, BellRing, Loader2 } from 'lucide-react';

// Duplicating category labels here as we removed next-intl
const categoryDisplayNames = {
  food: "Food",
  rent: "Rent/Mortgage",
  transport: "Transport",
  entertainment: "Entertainment",
  utilities: "Utilities",
  other: "Other",
};

export function SpendingAlerts({ expenses, user }) {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getCategoryDisplayName = (categoryKey) => {
    return categoryDisplayNames[categoryKey.toLowerCase()] || categoryKey;
  };

  const handleCheckSpikes = async () => {
    if (!user || !user._id) { 
      toast({ title: "User not found", description: "Cannot check for spikes without user data.", variant: 'destructive'});
      return;
    }
    if (expenses.length < 3) { 
        toast({ title: "Not Enough Data", description: "Please add at least 3 expenses to analyze spending spikes effectively.", variant: 'default' });
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
      setAlerts(result.alerts); 
      if (result.alerts.length > 0) {
        toast({ title: "Spending Spikes Detected!", description: "AI has identified unusual spending.", variant: 'destructive' });
      } else {
        toast({ title: "No Spikes Found", description: "Your spending looks normal based on the provided data." });
      }
    } catch (error) {
      console.error('Error getting spending alerts:', error);
      toast({ title: 'Error', description: "Could not check for spending spikes.", variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-6 w-6 text-primary" />
          Spending Spike Alerts
        </CardTitle>
        <CardDescription>Let AI warn you about unusual spending patterns based on your tracked expenses.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleCheckSpikes} disabled={isLoading || expenses.length < 1} className="w-full">
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking for Spikes...</>
          ) : (
            "Check for Spending Spikes"
          )}
        </Button>
        
        {alerts.length > 0 && (
          <div className="mt-4 space-y-2">
            {alerts.map((alert, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Spike in {getCategoryDisplayName(alert.category)}!</AlertTitle>
                <AlertDescription>
                  {alert.message} (Spike of ₹{alert.spikeAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
        {!isLoading && alerts.length === 0 && expenses.length > 0 && (
            <p className="text-sm text-muted-foreground text-center pt-2">No significant spending spikes detected, or click above to analyze.</p>
        )}
         { expenses.length === 0 && !isLoading && (
            <p className="text-sm text-muted-foreground text-center pt-2">Add some expenses first to check for spikes.</p>
        )}
      </CardContent>
    </Card>
  );
}
