// app/api/geocode/route.js
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return Response.json({ error: 'Latitude and longitude are required' }, { status: 400 });
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
        error: 'Location not found',
        details: data.error 
      }, { status: 404 });
    }    
    
    // Extraer la ciudad de diferentes campos posibles
    const city = data.city + ", " + data.principalSubdivision || 'Ubicación no disponible';
    
    return Response.json({ 
      city
    });

  } catch (error) {
    console.error('Geocoding error:', error);
    return Response.json({ error: 'Error fetching location data' }, { status: 500 });
  }
}