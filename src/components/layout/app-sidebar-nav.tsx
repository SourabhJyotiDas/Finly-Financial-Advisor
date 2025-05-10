'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
}

interface AppSidebarNavProps {
  items: NavItem[];
  isMobile?: boolean;
}

export function AppSidebarNav({ items, isMobile = false }: AppSidebarNavProps) {
  const pathname = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className={cn("flex flex-col gap-2 px-2 py-4", isMobile ? "grow" : "")}>
      {items.map((item, index) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link key={index} href={item.href} legacyBehavior passHref>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start',
                isActive && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
                !isActive && 'hover:bg-accent hover:text-accent-foreground',
                item.disabled && 'cursor-not-allowed opacity-50'
              )}
              disabled={item.disabled}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
