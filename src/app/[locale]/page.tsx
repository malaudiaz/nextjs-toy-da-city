import BannerCarousel from "@/components/shared/banner/BannerCarousel";
import { getTranslations } from "next-intl/server";
import FilterBar from "@/components/shared/home/FilterBar";
import Products from "@/components/shared/home/Products";
import SkeletonProductCard from "@/components/shared/SkeletonProductCard";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { getConditions } from "@/lib/actions/conditionActions";
import { Filters, getToys } from "@/lib/actions/toysAction";
import { Suspense } from "react";

// SEO: metadatos dinámicos
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  // Puedes personalizar el título y descripción por idioma
  const t = await getTranslations("seo");
  const resolvedParams = await params;
  
  const { locale } = resolvedParams;
  
  return {
    title: t("homeTitle", { locale: locale }) || "Toydacity - Juguetes, intercambio y regalos",
    description:
      t("homeDescription", { locale: locale }) ||
      "Descubre, compra, intercambia y regala juguetes en Toydacity. Encuentra las mejores ofertas y conecta con otros padres.",
    alternates: {
      canonical: `/${locale}`,
    },
    openGraph: {
      title: t("homeTitle", { locale: locale }) || "Toydacity - Juguetes, intercambio y regalos",
      description:
        t("homeDescription", { locale: locale }) ||
        "Descubre, compra, intercambia y regala juguetes en Toydacity.",
      url: `/${locale}`,
      siteName: "Toydacity",
      images: [
        {
          url: "/Logo.png",
          width: 600,
          height: 200,
          alt: "Toydacity logo",
        },
      ],
      locale: locale,
      type: "website",
    },
  };
};

// Forzar revalidación cada vez que se accede a la página
export const revalidate = 0; // 0 segundos = siempre fresh

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
  params: Promise<{ locale: string }>;
};

export default async function Home({ searchParams, params }: Props) {
  const t = await getTranslations("configurations"); // o el namespace que uses
  const resolvedSearchParams = await searchParams;
  const { locale } = await params;
  const conditions = await getConditions();
  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt(
    (resolvedSearchParams.pageSize as string) || process.env.NEXT_TOYS_PER_PAGE || "8"
  );

  const filters: Filters = {
    search: (resolvedSearchParams.search as string) || "",
    minPrice: resolvedSearchParams.minPrice
      ? parseFloat(resolvedSearchParams.minPrice)
      : undefined,
    maxPrice: resolvedSearchParams.maxPrice
      ? parseFloat(resolvedSearchParams.maxPrice)
      : undefined,
    locationRadius:
      resolvedSearchParams.lat &&
      resolvedSearchParams.lng &&
      resolvedSearchParams.radius
        ? {
            lat: Number(resolvedSearchParams.lat),
            lng: Number(resolvedSearchParams.lng),
            radius: Number(resolvedSearchParams.radius),
          }
        : undefined,
  };

  const { totalPosts } = await getToys(
    currentPage,
    postsPerPage,
    locale,
    filters
  );

  const toysPromise = getToys(currentPage, postsPerPage, locale, filters).then(
    (data) => ({
      data: data.toys,
    })
  );

  // Datos estructurados para SEO (multilingüe)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': locale === 'es' ? 'Toydacity - Juguetes nuevos, usados, donación e intercambio' : 'Toydacity - New, Used, Donation and Swap Toys',
    'description': locale === 'es'
      ? 'Descubre juguetes nuevos, usados, dona o intercambia juguetes en Toydacity.'
      : 'Discover new, used, donate or swap toys at Toydacity.',
    'mainEntity': [
      {
        '@type': 'Product',
        'name': locale === 'es' ? 'Juguetes nuevos' : 'New toys',
        'description': locale === 'es' ? 'Encuentra juguetes nuevos para todas las edades.' : 'Find new toys for all ages.',
        'category': locale === 'es' ? 'Juguetes nuevos' : 'New toys',
      },
      {
        '@type': 'Product',
        'name': locale === 'es' ? 'Juguetes usados' : 'Used toys',
        'description': locale === 'es' ? 'Ahorra comprando juguetes usados en buen estado.' : 'Save by buying used toys in good condition.',
        'category': locale === 'es' ? 'Juguetes usados' : 'Used toys',
      },
      {
        '@type': 'OfferCatalog',
        'name': locale === 'es' ? 'Donación de juguetes' : 'Toy donation',
        'description': locale === 'es' ? 'Dona juguetes y ayuda a otros niños.' : 'Donate toys and help other children.',
        'category': locale === 'es' ? 'Donación' : 'Donation',
      },
      {
        '@type': 'OfferCatalog',
        'name': locale === 'es' ? 'Intercambio de juguetes' : 'Toy swap',
        'description': locale === 'es' ? 'Intercambia juguetes con otros usuarios.' : 'Swap toys with other users.',
        'category': locale === 'es' ? 'Intercambio' : 'Swap',
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BannerCarousel />

      {totalPosts > 0 && (
        <section className="w-full px-3" aria-label="Filtros">
          <FilterBar conditions={conditions} />
        </section>
      )}

      {totalPosts === 0 ? (
        <section className="flex justify-center items-center h-64" aria-label="Sin juguetes">
          <p className="text-lg text-muted-foreground text-center">
            {t("toys.emptyMsg")}
          </p>
        </section>
      ) : (
        <Suspense
          key={filters.search}
          fallback={<SkeletonProductCard count={postsPerPage} />}
        >
          <section aria-label="Listado de juguetes">
            <Products toysPromise={toysPromise} />
          </section>
        </Suspense>
      )}

      {totalPosts > 0 && (
        <nav className="mt-8 mb-4" aria-label="Paginación">
          <PaginationWithLinks
            page={currentPage}
            pageSize={postsPerPage}
            totalCount={totalPosts}
          />
        </nav>
      )}
    </main>
  );
}