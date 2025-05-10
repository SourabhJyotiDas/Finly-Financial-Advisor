'use client';

import { useState, useEffect } from 'react';
import { SavingTips } from '@/components/dashboard/saving-tips';
import type { Expense, UserProfile } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { USER_PROFILE_KEY, EXPENSES_KEY } from '@/lib/types';

export default function AdvisorPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedExpenses = localStorage.getItem(EXPENSES_KEY);
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
     if (user) {
      const storedProfileStr = localStorage.getItem(USER_PROFILE_KEY);
      let currentProfile: UserProfile;
      if (storedProfileStr) {
        const storedProfile: UserProfile = JSON.parse(storedProfileStr);
        if (storedProfile.id === user.id) {
          currentProfile = storedProfile;
        } else {
           currentProfile = {
            id: user.id,
            email: user.email,
            name: user.email.split('@')[0],
            income: undefined, 
            financialGoals: 'Set your financial goals in Settings.'
          };
          localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(currentProfile));
        }
      } else {
         currentProfile = {
          id: user.id,
          email: user.email,
          name: user.email.split('@')[0],
          income: undefined,
          financialGoals: 'Set your financial goals in Settings.'
        };
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(currentProfile));
      }
      setUserProfile(currentProfile);
    }
  }, [user]);


  return (
    <div className="container mx-auto px-0 py-0 space-y-6">
      <div className="flex items-center gap-4">
        <Sparkles className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">AI Financial Advisor</h1>
      </div>
      <p className="text-muted-foreground">
        Leverage artificial intelligence to get personalized financial insights and saving tips.
      </p>

      <div className="grid gap-6 md:grid-cols-1"> {/* Changed to 1 col as SpendingAlerts is removed */}
        <SavingTips expenses={expenses} userProfile={userProfile} />
      </div>
      
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle>Understanding Your AI Advisor</CardTitle>
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
              Our AI analyzes your spending habits, income, and financial goals to provide tailored advice. 
              The more information you provide and the more consistently you track your expenses, the smarter and more helpful your AI advisor becomes.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Privacy Note:</strong> Your financial data is processed securely. We are committed to protecting your privacy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
