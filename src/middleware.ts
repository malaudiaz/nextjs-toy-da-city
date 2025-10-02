// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/seller-onboarding',
  '/api/(.*)',
]);

const isProtectedRoute = createRouteMatcher([
  '/protected(.*)',
  // Agrega más si usas auth.protect()
]);

// ✅ Exporta el middleware de Clerk, pero aplica intlMiddleware primero
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req) && isProtectedRoute(req)) {
    auth.protect();
  }

  // ✅ Espera la respuesta de next-intl
  const response = await intlMiddleware(req);
  return response;
});

export const config = {
  matcher: [
    // Skip static files
    '/((?!_next|_vercel|.*\\..*).*)',
    // Include internationalized routes
    '/',
    '/(en|es)(.*)',
  ],
};