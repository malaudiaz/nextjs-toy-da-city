// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

// Configuración de next-intl
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

// Rutas protegidas
const isProtectedRoute = createRouteMatcher([
  '/(en|es)/protected(.*)',
]);

// Rutas públicas (no requieren autenticación)
const isPublicRoute = createRouteMatcher([
  '/(en|es)?',
  '/(en|es)/sign-in(.*)',
  '/(en|es)/sign-up(.*)',
  '/(en|es)/seller-onboarding',
  '/(en|es)/seller-dashboard', // Añadido para evitar el error en /es/seller-dashboard
  '/(en|es)/api/clerk-webhook',
  '/(en|es)/api/get-onboarding-url',
  '/(en|es)/api/check-stripe-account',
]);

export default clerkMiddleware(async (auth, req) => {
  const origin = req.headers.get('origin') || '';
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://toydacity.com',
    'https://www.toydacity.com',
    'https://69f0c7248d04.ngrok-free.app',
  ];

  // Configurar respuesta base
  const response = NextResponse.next();

  // Configurar CORS
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // Manejar solicitud OPTIONS (Preflight)
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        ...Object.fromEntries(response.headers),
        'Content-Length': '0',
      },
    });
  }

  // Evitar autenticación en rutas públicas
  if (isPublicRoute(req)) {
    console.log(`Ruta pública accedida: ${req.url}`);
    return intlMiddleware(req); // Aplicar solo next-intl
  }

  // Proteger rutas autenticadas
  if (isProtectedRoute(req)) {
    try {
      await auth.protect();
      console.log(`Ruta protegida accedida: ${req.url}`);
    } catch (error) {
      console.error('Error de autenticación en Clerk:', error);
      return NextResponse.redirect(new URL('/es/sign-in', req.url));
    }
  }

  // Aplicar middleware de internacionalización
  const intlResponse = intlMiddleware(req);
  if (intlResponse) return intlResponse;

  return response;
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next|_vercel|.*\\..*).*)',
    '/',
    '/(en|es)/:path*',
    '/(en|es)/api/:path*',
  ],
};