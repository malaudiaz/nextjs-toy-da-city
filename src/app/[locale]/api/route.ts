import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  // Obtener el idioma del header Accept-Language
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");

  const isSpanish = acceptLanguage?.includes("es");

  const welcomeMessage = isSpanish
    ? "¡Bienvenido a la API Toydacity 1.00!"
    : "Welcome to Toydacity API 1.00";


  try {
    const response = await fetch(`http://ip-api.com/json`);
    const data = await response.json();

    return NextResponse.json({
      message: welcomeMessage,
      city: data.city,
      country: data.country,
      lat: data.lat,
      lon: data.lon,
      version: "1.00",
      status: "operational",
      documentation: "https://api.toydacity.com/docs",
      currentLanguage: isSpanish ? "es" : "en",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Error al obtener ubicación por IP' },
      { status: 500 }
    );
  }    
}
