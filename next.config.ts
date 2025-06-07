import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
// Habilita el dominio en la optimización de imágenes (opcional)
  images: {
<<<<<<< HEAD
    domains: ["toydacity.com", "www.toydacity.com"],
=======
    domains: ["toydacity.com", "www.toydacity.com", 'img.clerk.com'],
>>>>>>> cff5aaedb177ad0220fd1a41187ba548f4fba873
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