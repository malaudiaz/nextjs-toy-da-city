import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useLocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const switchLocale = useCallback((newLocale: string) => {
    const segments = pathname.split('/').filter(Boolean);

    let newPath;

    // Si ya hay un locale en la URL (ej. /en/products)
    if (segments[0] === 'en' || segments[0] === 'es') {
      segments[0] = newLocale;
      newPath = '/' + segments.join('/');
    } else {
      // Si no hay locale, lo insertamos al principio
      newPath = `/${newLocale}${pathname}`;
    }

    // Mantener los searchParams actuales
    const query = searchParams.toString();
    const fullPath = query ? `${newPath}?${query}` : newPath;

    // Redirigir
    router.push(fullPath);
  }, [router, pathname, searchParams]);

  return switchLocale;
}