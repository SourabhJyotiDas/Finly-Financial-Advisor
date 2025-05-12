'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, UserCircle, LogOut, Settings, Sun, Moon, LayoutDashboard, ListChecks, Sparkles } from 'lucide-react';
import Link from 'next/link'; // Using next/link for locale-aware navigation
import Image from 'next/image';
import { FinPathLogo } from '../icons/logo';
import { useAuth } from '@/hooks/use-auth'; 
import { useState, useEffect } from 'react';
import { AppSidebarNav } from './app-sidebar-nav';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './language-switcher';

export function AppHeader() {
  const t = useTranslations('AppHeader');
  const tSidebar = useTranslations('AppSidebar'); // For nav items
  const { user, logout } = useAuth(); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };
  
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (storedTheme === 'light') { // Explicitly set light if stored
      document.documentElement.classList.remove('dark'); 
    } else { // If no theme stored, use system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const navItems = [
    { href: '/dashboard', label: tSidebar('dashboard'), icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: '/dashboard/expenses', label: tSidebar('expenses'), icon: <ListChecks className="h-4 w-4" /> },
    { href: '/dashboard/advisor', label: tSidebar('aiAdvisor'), icon: <Sparkles className="h-4 w-4" /> },
    { href: '/dashboard/settings', label: tSidebar('settings'), icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
         <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('toggleNavigation')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 bg-sidebar text-sidebar-foreground">
              <div className="p-4 border-b border-sidebar-border">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                  <FinPathLogo />
                </Link>
              </div>
              <AppSidebarNav items={navItems} isMobile={true} />
            </SheetContent>
          </Sheet>
      </div>

      <div className="hidden md:flex md:flex-1">
        {/* Optional: Breadcrumbs or page title could go here */}
      </div>
      
      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
        <LanguageSwitcher />
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={t('toggleTheme')}>
          {mounted && (typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
          <span className="sr-only">{t('toggleTheme')}</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              {user?.image ? (
                <Image src={user.image} alt={user.name || 'User avatar'} width={28} height={28} className="rounded-full" />
              ) : (
                <UserCircle className="h-5 w-5" />
              )}
              <span className="sr-only">{t('toggleUserMenu')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.name || user?.email || t('myAccount')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/dashboard/settings" passHref legacyBehavior>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('settings')}</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
