import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// ✅ Define el tipo RemotePattern manualmente
type RemotePattern = {
  protocol?: "http" | "https";
  hostname: string;
  port?: string;
  pathname?: string;
};

// ✅ Define patterns fuera, como constante
const isDev = process.env.NODE_ENV === "development";

const remoteImagePatterns: RemotePattern[] = [
  {
    protocol: "https",
    hostname: "img.clerk.com",
  } as const, // 👈
  ...(isDev
    ? [
        {
          protocol: "http",
          hostname: "localhost",
          port: "3000",
        } as const, // 👈
      ]
    : [
        {
          protocol: "https",
          hostname: "toydacity.com",
        } as const, // 👈
        {
          protocol: "https",
          hostname: "www.toydacity.com",
        } as const, // 👈
      ]),
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: remoteImagePatterns,
    domains: ['dqzgluraws70e.cloudfront.net'],
  },
  async headers() {
    if (process.env.NODE_ENV === "development") {
      return []; // Sin headers en desarrollo = más rápido y menos restricciones
    }
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
  // Configura el hostname permitido (para evitar ataques de Host Header Injection)
  env: {
    NEXT_PUBLIC_BASE_URL: "https://toydacity.com",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    // Mover `middlewareClientMaxBodySize` dentro de `experimental` para evitar
    // la validación de keys no reconocidas en la raíz de la config.
    middlewareClientMaxBodySize: '50mb',
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
