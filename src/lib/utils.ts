import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export const getBreadcrumbs = (pathname: string): { label: string; href?: string }[] => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Home', href: '/' }];
  const ignoreSegments = ['en', 'toys' ]; 

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
      terms: "Terms of Service",
      policies: "Privacy Policy",
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

export const NumberToCategory = (categoryId: number) => {
  switch (categoryId) {
    case 1:
      return "Educational";
    case 2:
      return "Electronic";
    case 3:
      return "Board Games";
    case 4:
      return "Camping";
    case 5:
      return "Dolls";
    case 6:
      return "Stuffed Animals";
  }
};

export const NumberToCondition = (conditionId: number) => {
  switch (conditionId) {
    case 1:
      return "New";
    case 2:
      return "Like New";
    case 3:
      return "Acceptable";
    case 4:
      return "To Repair";
  }
};