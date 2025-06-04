import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
// Habilita el dominio en la optimización de imágenes (opcional)
  images: {
    domains: ["toydacity.com", "www.toydacity.com"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
// Configura el hostname permitido (para evitar ataques de Host Header Injection)
  env: {
    NEXT_PUBLIC_BASE_URL: "https://toydacity.com",
  },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);