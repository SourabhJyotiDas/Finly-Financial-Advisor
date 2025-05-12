'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth'; 
import { Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const t = useTranslations('SettingsPage');
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({});
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const [financialGoals, setFinancialGoals] = useState('');
  
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    if (!user) return;
    setIsFetchingProfile(true);
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setProfile(data);
      setName(data.name ?? user.name ?? user.email?.split('@')[0] ?? '');
      setIncome(data.income ?? '');
      setFinancialGoals(data.financialGoals ?? '');
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: t('errorLoadProfile'), variant: 'destructive' });
      setName(user.name ?? user.email?.split('@')[0] ?? '');
      setIncome('');
      setFinancialGoals('');
    } finally {
      setIsFetchingProfile(false);
      setIsDirty(false);
    }
  }, [user, toast, t]);

  useEffect(() => {
    if (user && !authLoading) {
      fetchUserProfile();
    }
  }, [user, authLoading, fetchUserProfile]);

  const handleInputChange = (setter) => 
    (e) => {
    setter(e.target.value);
    setIsDirty(true);
  };
  
  const handleIncomeChange = (e) => {
    setIncome(e.target.value === '' ? '' : parseFloat(e.target.value));
    setIsDirty(true);
  };

  const handleSaveSettings = async () => {
    if (!user) {
      toast({ title: 'Error', description: t('errorUserNotAuth'), variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    
    const updatedProfileData = {
      name: name,
      income: typeof income === 'number' ? income : undefined,
      financialGoals: financialGoals,
    };

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }
      
      const savedProfile = await response.json();
      setProfile(savedProfile); 
      setName(savedProfile.name ?? '');
      setIncome(savedProfile.income ?? '');
      setFinancialGoals(savedProfile.financialGoals ?? '');

      toast({ title: t('settingsSaved'), description: t('settingsSavedDesc') });
      setIsDirty(false);
    } catch (error) {
      console.error(error);
      toast({ title: t('errorSavingSettings'), description: error.message || t('errorSavingSettingsDesc'), variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (authLoading || isFetchingProfile) {
    return (
      <div className="container mx-auto px-0 py-0 space-y-6">
         <div className="flex items-center gap-4">
           <SettingsIcon className="h-8 w-8 text-primary" />
           <h1 className="text-3xl font-bold">{t('settings')}</h1>
         </div>
         <Card className="shadow-lg">
           <CardHeader><CardTitle>{t('loadingProfile')}</CardTitle></CardHeader>
           <CardContent className="space-y-4">
             <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
           </CardContent>
         </Card>
       </div>
    );
  }

  return (
    <div className="container mx-auto px-0 py-0 space-y-6">
      <div className="flex items-center gap-4">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">{t('settings')}</h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{t('userProfile')}</CardTitle>
          <CardDescription>{t('userProfileDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('nameLabel')}</Label>
            <Input
              id="name"
              type="text"
              placeholder={t('namePlaceholder')}
              value={name}
              onChange={handleInputChange(setName)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="income">{t('incomeLabel')}</Label>
            <Input
              id="income"
              type="number"
              placeholder={t('incomePlaceholder')}
              value={income}
              onChange={handleIncomeChange}
              step="any"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="financialGoals">{t('financialGoalsLabel')}</Label>
            <Textarea
              id="financialGoals"
              placeholder={t('financialGoalsPlaceholder')}
              value={financialGoals}
              onChange={handleInputChange(setFinancialGoals)}
              rows={3}
            />
          </div>
          <Button onClick={handleSaveSettings} disabled={isSaving || !isDirty} className="w-full">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSaving ? t('savingSettingsButton') : t('saveSettingsButton')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
