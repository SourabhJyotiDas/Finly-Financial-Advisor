'use client';

import Link from 'next/link';
import { FinPathLogo } from '@/components/icons/logo';
import { AppSidebarNav, type NavItem } from './app-sidebar-nav';
import { LayoutDashboard, ListChecks, Sparkles, UserCircle, LogOut, DollarSign, HandCoins, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
  { href: '/dashboard/expenses', label: 'Expenses', icon: <ListChecks /> },
  { href: '/dashboard/advisor', label: 'AI Advisor', icon: <Sparkles /> },
  // { href: '/dashboard/profile', label: 'Profile', icon: <UserCircle /> }, // Example for future
];


export function AppSidebar() {
  const { logoutUser } = useAuth();
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <FinPathLogo />
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <AppSidebarNav items={navItems} />
        </div>
        <div className="mt-auto p-4 border-t">
          <Button variant="ghost" className="w-full justify-start" onClick={() => logoutUser()}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
