import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/[locale]` || `http://localhost:3000/[locale]`;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/contact/", "/api/", "/terms/", "/policies/", "/deletedata/", "/mission/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/contact/", "/api/", "/terms/", "/policies/", "/deletedata/", "/mission/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}