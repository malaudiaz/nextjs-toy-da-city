// components/config/TitleBreakcrumbs.jsx
"use client";

import { useTranslations } from "next-intl";
import Breadcrumbs from "./BreadCrumbs";

// 1. Define una interfaz para el objeto de props
interface TitleBreakcrumbsProps {
  translationScope: string;
}

// 2. Acepta el objeto de props y desestructúralo
export default function TitleBreakcrumbs({ translationScope }: TitleBreakcrumbsProps) {
  const t = useTranslations(translationScope); 
  
  // Asume que la clave para el título es 'title' dentro de ese scope
  return <Breadcrumbs productName={t('title')} />;
}