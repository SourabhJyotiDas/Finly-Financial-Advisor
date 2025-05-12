'use client'; // Required for useTranslations if used here, or pass t as prop

import { FinPathLogo } from '@/components/icons/logo';
// import { useTranslations } from 'next-intl'; // If you need translations directly in this layout

export default function AuthLayout({
  children,
}) {
  // const t = useTranslations('AuthLayout'); // Example if needed

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
