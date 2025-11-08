// app/api/geocode/route.js
import { NextRequest } from "next/server";
import { getTranslations } from "next-intl/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  const t = await getTranslations("Toy");

  if (!lat || !lon) {
    return Response.json({ error: t("LatitudeLongitudeRequired") }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    if (data.error) {
      return Response.json({ 
        error: t("LocationNotFound"),
        details: data.error 
      }, { status: 404 });
    }    
    
    // Extraer la ciudad de diferentes campos posibles
    const city = data.city || t("LocationNotDisponsible");
    
    return Response.json({ 
      city
    });

  } catch (error) {
    console.error('Geocoding error:', error);
    return Response.json({ error: t("ErrorFetchingLocationData") }, { status: 500 });
  }
}