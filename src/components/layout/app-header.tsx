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
// import { cn } from '@/lib/utils'; // Not used here it seems
import { Menu, UserCircle, LogOut, Settings, Sun, Moon, LayoutDashboard, ListChecks, Sparkles } from 'lucide-react';
import Link from 'next/link';
// import { usePathname } from 'next/navigation'; // Not used here
import { FinPathLogo } from '../icons/logo';
import { useAuth } from '@/hooks/use-auth'; // Using new useAuth
import { useState, useEffect } from 'react';
import { AppSidebarNav, type NavItem } from './app-sidebar-nav';


const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: '/dashboard/expenses', label: 'Expenses', icon: <ListChecks className="h-4 w-4" /> },
  { href: '/dashboard/advisor', label: 'AI Advisor', icon: <Sparkles className="h-4 w-4" /> },
  { href: '/dashboard/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
];


export function AppHeader() {
  const { user, logout } = useAuth(); // Using new useAuth: user and logout
  const [mounted, setMounted] = useState(false);
  // const { theme, setTheme } = useTheme(); // useTheme not defined, placeholder for theme toggle

  useEffect(() => setMounted(true), []);

  // Placeholder theme toggle function
  const toggleTheme = () => {
    // This is a placeholder. In a real app with next-themes:
    // setTheme(theme === 'light' ? 'dark' : 'light');
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };
  
  // Effect to apply theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark'); // Default to light
    }
  }, []);


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
         <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
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
      
      <div className="flex flex-1 items-center justify-end gap-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {mounted && (typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
          <span className="sr-only">Toggle Theme</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              {user?.image ? (
                <Image src={user.image} alt={user.name || 'User avatar'} width={28} height={28} className="rounded-full" />
              ) : (
                <UserCircle className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.name || user?.email || 'My Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/dashboard/settings" passHref legacyBehavior>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
