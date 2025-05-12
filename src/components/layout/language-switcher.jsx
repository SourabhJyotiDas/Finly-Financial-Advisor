'use client';

import { usePathname, useRouter } from 'next-intl/client';
import { useLocale, useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { locales } from '@/i18n'; // ensure this path is correct

export function LanguageSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger 
        className="w-auto gap-1 sm:gap-2 border-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-transparent focus-visible:ring-offset-0 shadow-none bg-transparent hover:bg-accent hover:text-accent-foreground h-10 px-1 sm:px-2 py-2 text-xs sm:text-sm"
        aria-label={t('changeLanguage')}
      >
        <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
        <SelectValue placeholder={t('changeLanguage')} />
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {loc.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
