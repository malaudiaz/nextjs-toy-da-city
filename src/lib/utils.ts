import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export const getBreadcrumbs = (
  pathname: string,
  t: (key: string) => string,
  locale: string,
  productName?: string,
  ignoreSegment?: string
): { 
  
  
  label: string; href?: string 

}[] => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: t("Home"), href: `/${locale}` }];
  const ignoreSegments = ['en', 'es', 'toys', 'edit', ignoreSegment];

  console.log(ignoreSegment)


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
      reviews: t("Reviews"),
      mytoys: t("Toys"),
    };

    const label = labelMap[path] || decodedLabel;

    if (i === paths.length - 1 && productName) {
      // ✅ Último segmento y hay `productName`
      breadcrumbs.push({
        label: productName,
        href: ''
      });
    } else {
      currentPath += `/${locale}/${path}`;
      breadcrumbs.push({ label, href: currentPath });
    }
  }

  return breadcrumbs;
};

export const NumberToCategory = (categoryId: number, t: (key: string) => string ) => {
  switch (categoryId) {
    case 1:
      return t("Educational");
    case 2:
      return t("Electronic");
    case 3:
      return t("BoardGames");
    case 4:
      return t("Mobility");
    case 5:
      return t("Forbabies");
    case 6:
      return t("StuffedAnimals");
    case 7:
      return t("RareToys");
    case 8:
      return t("ActionFigures");
    case 9:
      return t("Vintage");
  }
};

export const NumberToCondition = (conditionId: number, t: (key: string) => string) => {
  switch (conditionId) {
    case 1:
      return t("new");
    case 2:
      return t("openBox");
    case 3:
      return t("likeNew");
    case 4:
      return t("acceptable");
    case 5:
      return t("good");
    case 6:
      return t("toRepair");
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