'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';
import { USER_PROFILE_KEY } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Settings as SettingsIcon, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState<string>('');
  const [income, setIncome] = useState<number | ''>('');
  const [financialGoals, setFinancialGoals] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (user) {
      const storedProfileStr = localStorage.getItem(USER_PROFILE_KEY);
      if (storedProfileStr) {
        const storedProfile: UserProfile = JSON.parse(storedProfileStr);
        // Ensure profile belongs to current user or initialize
        if (storedProfile.id === user.id) {
          setName(storedProfile.name ?? user.email.split('@')[0]);
          setIncome(storedProfile.income ?? '');
          setFinancialGoals(storedProfile.financialGoals ?? '');
        } else {
          // Profile mismatch, initialize for current user
          initializeProfile(user.id, user.email);
        }
      } else {
        // No profile, initialize
        initializeProfile(user.id, user.email);
      }
    }
  }, [user]);

  const initializeProfile = (userId: string, userEmail: string) => {
    const defaultName = userEmail.split('@')[0];
    setName(defaultName);
    setIncome('');
    setFinancialGoals('');
    // Optionally save this initial profile to localStorage here
    // or wait for the first save action by the user.
    // For now, we'll let user explicitly save.
  };

  const handleInputChange = <T extends string | number | ''>(setter: React.Dispatch<React.SetStateAction<T>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value as T);
    setIsDirty(true);
  };
  
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncome(e.target.value === '' ? '' : parseFloat(e.target.value));
    setIsDirty(true);
  };


  const handleSaveSettings = () => {
    if (!user) {
      toast({ title: 'Error', description: 'User not authenticated.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    const newProfile: UserProfile = {
      id: user.id,
      email: user.email,
      name: name || user.email.split('@')[0],
      income: typeof income === 'number' ? income : undefined,
      financialGoals: financialGoals,
    };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newProfile));
    toast({ title: 'Settings Saved', description: 'Your profile has been updated.' });
    setIsLoading(false);
    setIsDirty(false);
  };

  return (
    <div className="container mx-auto px-0 py-0 space-y-6">
      <div className="flex items-center gap-4">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Manage your personal information and financial settings. Your changes will be saved locally in your browser.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={handleInputChange(setName)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="income">Monthly Income ($)</Label>
            <Input
              id="income"
              type="number"
              placeholder="e.g., 3500"
              value={income}
              onChange={handleIncomeChange}
              step="any"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="financialGoals">Financial Goals</Label>
            <Textarea
              id="financialGoals"
              placeholder="e.g., Save for a vacation, build emergency fund"
              value={financialGoals}
              onChange={handleInputChange(setFinancialGoals)}
              rows={3}
            />
          </div>
          <Button onClick={handleSaveSettings} disabled={isLoading || !isDirty} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
