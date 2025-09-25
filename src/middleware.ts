// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

// Rutas que NO requieren autenticación
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/seller-onboarding',
  '/api/(.*)', // todas las rutas API
]);

// Rutas que SÍ requieren autenticación (opcional, si usas auth.protect())
const isProtectedRoute = createRouteMatcher([
  '/protected(.*)',
  // Agrega más si usas auth.protect()
]);

export default clerkMiddleware((auth, req) => {
  // Si la ruta NO es pública y es protegida → proteger
  if (!isPublicRoute(req) && isProtectedRoute(req)) {
    auth.protect();
  }

  // ✅ IMPORTANTE: NO devuelvas una respuesta manual.
  // Deja que next-intl procese la solicitud normalmente.
  return intlMiddleware(req);
});

export const config = {
  // Este matcher debe incluir TODAS las rutas donde se use `auth()`
  matcher: [
    // Ignorar assets estáticos (evita errores en imágenes/JS/CSS faltantes)
    '/((?!_next|_vercel|.*\\..+).*)',
    // Incluir rutas con y sin prefijo de idioma
    '/',
    '/(en|es)(.*)',
  ],
};