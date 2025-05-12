'use client';

import Link from 'next/link'; // Using next/link for locale-aware navigation
import { FinPathLogo } from '@/components/icons/logo';
import { AppSidebarNav } from './app-sidebar-nav';
import { LayoutDashboard, ListChecks, Sparkles, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth'; 
import { useTranslations } from 'next-intl';

export function AppSidebar() {
  const t = useTranslations('AppSidebar');
  const { logout } = useAuth(); 

  const navItems = [
    { href: '/dashboard', label: t('dashboard'), icon: <LayoutDashboard /> },
    { href: '/dashboard/expenses', label: t('expenses'), icon: <ListChecks /> },
    { href: '/dashboard/advisor', label: t('aiAdvisor'), icon: <Sparkles /> },
    { href: '/dashboard/settings', label: t('settings'), icon: <Settings /> },
  ];

  return (
    <div className="hidden md:block sticky top-0 h-screen border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6 border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <FinPathLogo />
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <AppSidebarNav items={navItems} />
        </div>
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            {t('logout')}
          </Button>
        </div>
      </div>
    </div>
  );
}
