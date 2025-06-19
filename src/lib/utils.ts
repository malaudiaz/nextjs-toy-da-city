import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export const getBreadcrumbs = (pathname: string): { label: string; href?: string }[] => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Home', href: '/' }];
  const ignoreSegments = ['en', ]; 

  let currentPath = '';
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];

     if (ignoreSegments.includes(path)) continue;

    const decodedLabel = decodeURIComponent(path.replace(/-/g, ' '));

    // Traducción personalizada si necesitas nombres más bonitos
    const labelMap: Record<string, string> = {
      profile: 'Profile',
      config: 'Configurations',
      ventas: 'Sales',
      compras: 'Purchases',
      intercambios: 'Trades',
      regalos: 'Gifts',
      favoritos: 'Favorites',
      reputacion: 'Reputation',
    };

    const label = labelMap[path] || decodedLabel;

    if (i === paths.length - 1) {
      // Último elemento no es link
      breadcrumbs.push({
        label,
        href: ""
      });
    } else {
      currentPath += `/${path}`;
      breadcrumbs.push({ label, href: currentPath });
    }
  }

  return breadcrumbs;
};