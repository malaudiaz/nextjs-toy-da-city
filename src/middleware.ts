import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

// 1. Configuración de next-intl
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed', // o 'always' si prefieres /en/... siempre visible
});


// 2. Configuración de Clerk
const isProtectedRoute = createRouteMatcher([
  "/api(.*)",
  "/protected(.*)",
]);

export default clerkMiddleware(async (auth, req) => {

  // Primero ejecuta el middleware de internacionalización
  const intlResponse = intlMiddleware(req);
  if (intlResponse) return intlResponse;
  
  // Luego maneja la autenticación con Clerk
  if (isProtectedRoute(req)) await auth.protect();

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next|_vercel|.*\\..*).*)', // Clerk
    '/', 
    '/(en|es)/:path*', // next-intl
  ],
};