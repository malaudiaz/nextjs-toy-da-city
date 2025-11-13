'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getBreadcrumbs } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl"; // ✅

interface BreadcrumbsProps {
  productName?: string;
}

export default function Breadcrumbs({ productName }: BreadcrumbsProps) {
  const locale = useLocale(); // ✅ Siempre actualizado
  const t = useTranslations("breadcrumbs");
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname, t, locale, productName);

  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="flex items-center gap-1 text-sm text-gray-500 ">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center gap-1">
            {crumb.href ? (
              <>
                <Link
                  href={crumb.href}
                  className="hover:text-blue-600 transition-colors"
                >
                  {crumb.label}
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </>
            ) : (
              <span className="text-gray-800 font-medium">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}