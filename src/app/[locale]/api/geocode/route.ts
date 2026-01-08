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
    const apiKey = process.env.BIGDATACLOUD_API_KEY;
    const baseUrl = 'https://api.bigdatacloud.net/data/reverse-geocode';
    const params = new URLSearchParams({
      latitude: lat!,
      longitude: lon!,
      localityLanguage: 'es'
    });
    
    if (apiKey) {
      params.append('key', apiKey);
    }
    
    const url = `${baseUrl}?${params.toString()}`;
    console.log('[GEOCODE] Requesting URL:', url.replace(/key=[^&]+/, 'key=***'));
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[GEOCODE] HTTP Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
        lat,
        lon
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('[GEOCODE] API Response:', { data, lat, lon });

    if (data.error) {
      console.error('[GEOCODE] API error field:', data.error);
      return Response.json({ 
        error: t("LocationNotFound"),
        details: data.error 
      }, { status: 404 });
    }    
    
    // Extraer la ciudad de diferentes campos posibles
    const city = data.city || data.locality || t("LocationNotDisponsible");
    console.log('[GEOCODE] Extracted city:', city);
    
    return Response.json({ 
      city
    });

  } catch (error) {
    console.error('[GEOCODE] Exception:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      lat,
      lon
    });
    return Response.json({ error: t("ErrorFetchingLocationData") }, { status: 500 });
  }
}