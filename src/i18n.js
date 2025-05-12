
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Can be imported from a shared config
export const locales = ['en', 'es'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound();

  let messages;
  try {
    messages = (await import(`./messages/${locale}.json`)).default;
  } catch (error) {
    // Fallback to English if a specific locale file is missing or invalid
    // This is a basic fallback, consider more robust error handling for production
    console.error(`Could not load messages for locale ${locale}, falling back to ${defaultLocale}`, error);
    if (locale !== defaultLocale) {
        try {
            messages = (await import(`./messages/${defaultLocale}.json`)).default;
        } catch (defaultLocaleError) {
            console.error(`Error loading messages for default locale ${defaultLocale}:`, defaultLocaleError);
            notFound(); // If default also fails, then it's a critical issue
        }
    } else {
        notFound();
    }
  }

  return {
    messages
  };
});

