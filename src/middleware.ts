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

  // Luego maneja la autenticación con Clerk
  if (isProtectedRoute(req)) await auth.protect();

  const response = NextResponse.next();
  
  // Configura los headers CORS
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  // Primero ejecuta el middleware de internacionalización
  const intlResponse = intlMiddleware(req);
  if (intlResponse) return intlResponse; 
 
  return response;  
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next|_vercel|.*\\..*).*)', // Clerk
    '/', 
    '/(en|es)/:path*',   // next-intl
    '/api/:path*'
  ],
};