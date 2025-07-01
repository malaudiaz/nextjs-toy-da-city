import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

// 1. Configuración de next-intl
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always', // o 'always' si prefieres /en/... siempre visible
});


// 2. Configuración de Clerk
const isProtectedRoute = createRouteMatcher([
  '/(en|es)/protected(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // 1. Definir orígenes permitidos (Dev + Prod)
  const allowedOrigins = [
    'http://localhost:3000',       // Desarrollo
    'https://toydacity.com',       // Producción
    'https://www.toydacity.com',   // Producción (alternativo)
  ];

  // 2. Obtener el origen de la solicitud
  const origin = req.headers.get('origin') || '';
  
  // 3. Verificar si el origen está permitido
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Luego maneja la autenticación con Clerk
  if (isProtectedRoute(req)) await auth.protect();

  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  // Configura CORS
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  // 5. Manejar solicitud OPTIONS (Preflight)
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 200,
      headers: {
        ...Object.fromEntries(response.headers),
        'Content-Length': '0',
      },
    });
  }

  // Ejecuta el middleware de internacionalización
  const intlResponse = intlMiddleware(req);
  if (intlResponse) return intlResponse; 
 
  return response;  
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next|_vercel|.*\\..*).*)', // Clerk
    '/', 
    '/(en|es)/:path*',   // next-intl
    '/(en|es)/api/:path*'
  ],
};