import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css'; // Adjusted path
import { Toaster } from "@/components/ui/toaster";
import { SessionProviderWrapper } from '@/components/layout/session-provider-wrapper';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales} from '@/i18n'; // Adjusted path

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export function generateStaticParams() {
   return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params: {locale}}) {
  // Using getTranslations for metadata is optional if you prefer static titles
  // const t = await getTranslations({locale, namespace: 'Metadata'});
  return {
    title: 'Finly - AI Financial Advisor', // Example: t('title')
    description: 'Helps users manage budgets, track expenses, and get AI-powered financial advice with Finly.',
  };
}

export default async function RootLayout({
  children,
  params: {locale}
}) {
  // Validate locale
  if (!locales.includes(locale)) notFound();

  let messages;
  try {
    messages = await getMessages(locale);
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    // Fallback to default locale messages if current locale fails
    if (locale !== locales[0]) { // Assuming first locale in 'locales' array is default
        try {
            messages = await getMessages(locales[0]);
        } catch (defaultLocaleError) {
            console.error(`Error loading messages for default locale ${locales[0]}:`, defaultLocaleError);
            notFound(); // If default also fails, then it's a critical issue
        }
    } else {
        notFound();
    }
  }

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProviderWrapper>
            {children}
            <Toaster />
          </SessionProviderWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
