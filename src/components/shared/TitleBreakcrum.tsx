"use client";

import { useTranslations } from "next-intl";
import Breadcrumbs from "./BreadCrumbs";

interface TitleBreakcrumbsProps {
  translationScope: string;
  titleKey?: string; 
}

export default function TitleBreakcrumbs({ 
    translationScope, 
    titleKey = 'title' 
}: TitleBreakcrumbsProps) {
  const t = useTranslations(translationScope); 
  
  // Usa la prop titleKey (o su valor por defecto 'title') para buscar la traducción
  return <Breadcrumbs productName={t(titleKey)} />;
}