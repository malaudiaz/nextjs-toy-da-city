// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware(routing);

const isPublicRoute = createRouteMatcher([
  '/(en|es)',                          
  '/(en|es)/sign-in(.*)',              
  '/(en|es)/sign-up(.*)',                
  '/(en|es)/api/(.*)',                 
  '/(en|es)/auth-error(.*)',
  '/(en|es)/toys(.*)'            
]);

// Función helper para obtener locale
function getLocaleFromRequest(req: Request): string {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const locales = ['en', 'es'];
  
  const segments = pathname.split('/');
  if (segments.length > 1 && locales.includes(segments[1])) {
    return segments[1];
  }
  
  return 'en'; // default
}

// ✅ Exporta el middleware de Clerk, pero aplica intlMiddleware primero
export default clerkMiddleware(async (auth, req) => {
  const locale = getLocaleFromRequest(req);

  // Si es ruta pública, acceso libre
  if (isPublicRoute(req)) {
    return intlMiddleware(req);
  }
  
  // Para rutas protegidas: verificar autenticación
  const session = await auth();
  const userId = session.userId;
  
  if (!userId) {
    const signUpUrl = new URL(`/${locale}/auth-error`, req.url);
    signUpUrl.searchParams.set('reason', 'user_not_authenticated');

    return NextResponse.redirect(signUpUrl);
  }

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