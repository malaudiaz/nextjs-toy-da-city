import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export const getBreadcrumbs = (
  pathname: string,
  t: (key: string) => string, // Recibimos la función de traducción como parámetro
  productName?: string
): { 
  
  
  label: string; href?: string 

}[] => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: t("Home"), href: '/' }];
  const ignoreSegments = ['en', 'es', 'toys', 'edit'];


  let currentPath = '';
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];

    if (ignoreSegments.includes(path)) continue;

    const decodedLabel = decodeURIComponent(path.replace(/-/g, ' '));

    // Mapeo de rutas a nombres amigables
    const labelMap: Record<string, string> = {
      profile: t("Profile"),
      config: t("Config"),
      sales: t("Sales"),
      purchases: t("Purchases"),
      swap: t("Swap"),
      free: t("Free"),
      favorites: t("Favorites"),
      messages: t("Messages"),
      reputation: t("Reputation"),
      terms: t("Terms"),
      policies: t("Policies"),
      post: t("Post"),
      search: t("Search"),
      cart: t("Cart"),
      contact: t("Contact"),
      mission: t("Mission"),
    };

    const label = labelMap[path] || decodedLabel;

    if (i === paths.length - 1 && productName) {
      // ✅ Último segmento y hay `productName`
      breadcrumbs.push({
        label: productName,
        href: ''
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

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * 
    Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * 
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distancia en km
  
  return distance;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};