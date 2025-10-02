// hooks/useLocaleSwitcher.ts
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { routing, type Locale } from '@/i18n/routing';

export function useLocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const switchLocale = useCallback(
    (newLocale: Locale) => { // ✅ Tipado fuerte
      console.log('Switching to locale:', newLocale);
      
      const segments = pathname.split('/').filter(Boolean);

      const currentLocale = segments[0] && routing.locales.includes(segments[0] as Locale)
        ? segments[0]
        : null;

      const newPath = currentLocale
        ? `/${newLocale}/${segments.slice(1).join('/')}`
        : `/${newLocale}${pathname === '/' ? '' : pathname}`;

      const query = searchParams.toString();
      router.push(query ? `${newPath}?${query}` : newPath);
    },
    [router, pathname, searchParams]
  );

  return switchLocale;
}