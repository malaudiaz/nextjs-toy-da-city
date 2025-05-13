import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET () {
  // Obtener el idioma del header Accept-Language
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');

  const isSpanish = acceptLanguage?.includes('es');
  
  const welcomeMessage = isSpanish 
    ? '¡Bienvenido a la API Toydacity 1.00!'
    : 'Welcome to Toydacity API 1.00';

  return NextResponse.json({
    message: welcomeMessage,
    version: '1.00',
    status: 'operational',
    documentation: 'https://api.toydacity.com/docs',
    currentLanguage: isSpanish ? 'es' : 'en',
    timestamp: new Date().toISOString()
  });
}