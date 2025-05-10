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
import { cn } from '@/lib/utils';
import { Menu, UserCircle, LogOut, Settings, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FinPathLogo } from '../icons/logo';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';
import { AppSidebarNav, type NavItem } from './app-sidebar-nav';


const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <UserCircle className="h-4 w-4" /> },
  // Add more mobile nav items if needed
];


export function AppHeader() {
  const { user, logoutUser } = useAuth();
  const [mounted, setMounted] = useState(false);
  // const { theme, setTheme } = useTheme(); // useTheme not defined, placeholder for theme toggle

  useEffect(() => setMounted(true), []);

  // Placeholder theme toggle function
  const toggleTheme = () => {
    // This is a placeholder. In a real app with next-themes:
    // setTheme(theme === 'light' ? 'dark' : 'light');
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };


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
            <SheetContent side="left" className="flex flex-col p-0">
              <div className="p-4 border-b">
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
          {mounted && (document.documentElement.classList.contains('dark') ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
          <span className="sr-only">Toggle Theme</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.email || 'My Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logoutUser()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
