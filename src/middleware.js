import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Alternatives: 'always' or 'never'
});

export const config = {
  // Match only internationalized pathnames
  // Skip middleware for API routes, static files, and _next internal files
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next/static`, `/_next/image`, or `favicon.ico`
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Match the root path
    '/'
  ]
};
