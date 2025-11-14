// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing'; 
import { NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware(routing);

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

// ... (isPublicRoute, config y la lógica de next-intl se mantienen) ...

// Rutas que no requieren registro en DB (solo autenticación de Clerk)
const isPublicRoute = createRouteMatcher([
  '/', 
  '/(en|es)',                          
  '/(en|es)/sign-in(.*)',              
  '/(en|es)/sign-up(.*)',                
  '/(en|es)/api/(.*)', 
  '/(en|es)/auth-error(.*)',
  '/(en|es)/toys(.*)'            
]);

export default clerkMiddleware(async (auth, req) => {
  const intlResponse = intlMiddleware(req);
  if (intlResponse.headers.get('location')) {
    return intlResponse; // Redirección inicial de next-intl (de / a /es)
  }
  
  // 1. Obtener el locale de la ruta reescrita por next-intl
  const currentPathname = intlResponse.headers.get('x-middleware-rewrite') || req.nextUrl.pathname;
  const localeMatch = currentPathname.match(/^\/(en|es)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale; 
  
  // 2. Si es una ruta pública, permitir acceso (puede requerir solo auth de Clerk)
  if (isPublicRoute(req)) {
    return intlResponse;
  }
  
  // 3. Verificar autenticación con Clerk (Rutas Protegidas)
  const { userId } = await auth();

  if (!userId) {
    // 3A. Si NO autenticado, redirigir a error de autenticación.
    const signInUrl = new URL(`${BACKEND_URL}/${locale}/auth-error`, req.url);
    signInUrl.searchParams.set('reason', 'user_not_authenticated');
    signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }
  
  // 4. ✅ Autenticado con Clerk: Verificar registro en DB
  // 4B. Reescribir la solicitud internamente a la API de verificación.
  const apiResponse = await fetch(`${BACKEND_URL}/${locale}/api/check-user-db`, {
      method: 'GET',
      headers: {
        ...req.headers, // Mantienes los headers originales (incluyendo los de Clerk)
        'X-User-ID': userId, // 👈 Pasa el userId aquí
        // Opcional: Si quieres pasar el token para otros usos:
        // 'Authorization': req.headers.get('Authorization') || '', 
      }, 
  });
  
  // 5. Manejar la respuesta de la API
  if (apiResponse.status === 200) {
    // 5A. ✅ Usuario encontrado en DB. Permitir acceso a la página original.
    // El 'intlResponse' ya tiene el reescrito correcto de next-intl.
    return intlResponse;
    
  } else if (apiResponse.status === 403) {
    // 5B. ❌ Usuario autenticado (Clerk) pero NO registrado en DB (Prisma).
    const dbErrorUrl = new URL(`${BACKEND_URL}/${locale}/auth-error`, req.url);
    dbErrorUrl.searchParams.set('reason', 'user_not_registered');
    dbErrorUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
    return NextResponse.redirect(dbErrorUrl);
    
  } else {
    // 5C. Error del servidor o cualquier otro error.
    const serverErrorUrl = new URL(`${BACKEND_URL}/${locale}/auth-error`, req.url);
    serverErrorUrl.searchParams.set('reason', 'server_error');
    serverErrorUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
    return NextResponse.redirect(serverErrorUrl);
  }
});

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*|favicon.ico).*)',
    '/',
  ],
};