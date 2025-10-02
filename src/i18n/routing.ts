// i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'es'] as const; // ✅ const assertion
export type Locale = (typeof locales)[number]; // 'en' | 'es'

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
});