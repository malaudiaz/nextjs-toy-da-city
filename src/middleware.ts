// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

const isPublicRoute = createRouteMatcher([
  '/(en|es)?',
  '/(en|es)/sign-in(.*)',
  '/(en|es)/sign-up(.*)',
  '/(en|es)/seller-onboarding',
  '/(en|es)/seller-dashboard',
  '/(en|es)/api/clerk-webhook',
  '/(en|es)/api/get-onboarding-url',
  '/(en|es)/api/check-stripe-account',
  '/(en|es)/api/stripe-webhook',
  '/(en|es)/api/release-past-due',
  '/(en|es)/api/create-payment-intent',
  '/(en|es)/api/confirm-delivery',
  '/(en|es)/api/release-payment',
]);

//const isApiRoute = createRouteMatcher(['/api(.*)', '/(en|es)/api(.*)']);
const isProtectedRoute = createRouteMatcher([
  '/(en|es)/protected(.*)',
  // añade más rutas que necesiten auth
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

  // ✅ Aplica CORS solo a orígenes permitidos
  const response = NextResponse.next();
  if (origin && allowedOrigins.some(o => o.trim() === origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: response.headers,
    });
  }

  // ✅ next-intl maneja i18n
  const intlResponse = intlMiddleware(req);
  if (intlResponse) return intlResponse;


  // ✅ No proteger rutas públicas ni API routes (dejamos que las API manejen su propia lógica)
  if (isPublicRoute(req)) {
    return response;
  }

  // ✅ Proteger rutas protegidas (como /protected)
  // Si necesitas proteger rutas como /dashboard, descomenta:
  if (isProtectedRoute(req)) {
    auth.protect(); // ✅ Correcto: usa el `auth` del parámetro
  }

  return response;
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next|_vercel|.*\\..*).*)',
    '/',
    '/(en|es)/:path*',
  ],
};