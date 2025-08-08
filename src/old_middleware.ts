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
  // Lista blanca de dominios permitidos (customiza con tus URLs)
  const response = NextResponse.next();

  const allowedOrigins = [
    'http://localhost:3000',       // Desarrollo
    'http://127.0.0.1:3000',       // Desarrollo
    'https://toydacity.com',       // Producción
    'https://www.toydacity.com',   // Producción (alternativo)
    'https://69f0c7248d04.ngrok-free.app'
  ];

  // 2. Obtener el origen de la solicitud
  const origin = req.headers.get('origin') || '';
  
  // Verifica si el origen está en la lista blanca
  if (origin && allowedOrigins.includes(origin)) {
    // Configura los headers CORS
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true'); // Si usas cookies/tokens
  }

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

  // Luego maneja la autenticación con Clerk
  if (isProtectedRoute(req)) await auth.protect();

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