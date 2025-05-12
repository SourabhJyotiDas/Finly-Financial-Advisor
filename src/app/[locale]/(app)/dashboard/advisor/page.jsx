'use client';

import { useState, useEffect, useCallback } from 'react';
import { SavingTips } from '@/components/dashboard/saving-tips';
import { useAuth } from '@/hooks/use-auth';
import { Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

export default function AdvisorPage() {
  const t = useTranslations('AdvisorPage');
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsFetchingData(true);
    try {
      const profileResponse = await fetch('/api/profile');
      if (!profileResponse.ok) throw new Error('Failed to fetch profile');
      const profileData = await profileResponse.json();
      setUserProfile(profileData);

      const expensesResponse = await fetch('/api/expenses');
      if (!expensesResponse.ok) throw new Error('Failed to fetch expenses');
      const expensesData = await expensesResponse.json();
      setExpenses(expensesData);

    } catch (error) {
      console.error("Error fetching data:", error);
      toast({ title: 'Error', description: t('errorLoadingAdvisor'), variant: 'destructive' });
    } finally {
      setIsFetchingData(false);
    }
  }, [user, toast, t]);

  useEffect(() => {
    if (user && !authLoading) {
      fetchData();
    }
  }, [user, authLoading, fetchData]);
  
  if (authLoading || isFetchingData) {
    return (
      <div className="container mx-auto px-0 py-0 space-y-6">
        <div className="flex items-center gap-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{t('aiFinancialAdvisor')}</h1>
        </div>
        <Card className="shadow-lg">
           <CardHeader><CardTitle>{t('loadingAdvisorData')}</CardTitle></CardHeader>
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
        <Sparkles className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">{t('aiFinancialAdvisor')}</h1>
      </div>
      <p className="text-muted-foreground">
        {t('leverageAI')}
      </p>

      <div className="grid gap-6 md:grid-cols-1">
        <SavingTips expenses={expenses} userProfile={userProfile} />
      </div>
      
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle>{t('understandingAdvisor')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          <Image 
            src="https://picsum.photos/300/200" 
            alt="AI interaction illustration" 
            data-ai-hint="AI data"
            width={300} 
            height={200} 
            className="rounded-lg object-cover"
          />
          <div>
            <p className="text-muted-foreground mb-2">
              {t('aiAnalysisDescription')}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>{t('privacyNote').split(':')[0]}:</strong> {t('privacyNote').split(':')[1]}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
