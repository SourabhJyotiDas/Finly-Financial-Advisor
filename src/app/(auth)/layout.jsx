'use client';

import { FinPathLogo } from '@/components/icons/logo';

export default function AuthLayout({
  children,
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <div className="mb-8">
        <FinPathLogo />
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
