import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
// Habilita el dominio en la optimización de imágenes (opcional)
//  images: {
//       domains: ["toydacity.com", "www.toydacity.com", 'img.clerk.com'],
//   },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'toydacity.com',
        // Opcional: restringir por path
        //pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.toydacity.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      }
    ],
  },
  allowedDevOrigins: [
    'toydacity.com',
    // También puedes incluir variantes de localhost:
    'localhost',
    'localhost:3000',
    '127.0.0.1',
  ],
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
          //esto es para cuando este en produccion
          // {
          //  key: "Access-Control-Allow-Origin",
          //  value: "https://toydacity.com" // Solo permitir tu dominio
          // }
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
      bodySizeLimit: '10mb',
    },
  },  
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
