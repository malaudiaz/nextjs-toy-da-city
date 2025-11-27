"use server";
import { auth } from "@clerk/nextjs/server";
import { BACKEND_URL } from "../utils";
import { getLocale } from 'next-intl/server';

export async function getSellerData(id: string) {
  const locale = await getLocale(); // ✅ Obtiene el locale actual

  const response = await fetch(`${BACKEND_URL}/${locale}/api/users/${id}/validate-seller`, {
    method: "GET",
  });
  
  const result = await response.json();
  return result
}

export async function getSellerProfile(id: string) {
  const locale = await getLocale(); // ✅ Obtiene el locale actual

  const response = await fetch(`${BACKEND_URL}/${locale}/api/profiles/${id}`, {
    method: "GET",
  });
  
  const result = await response.json();
  return result
}

export async function getReviewsEligible(sellerId: string) {

    const locale = await getLocale();
    
    // 1. OBTENER EL TOKEN COMPLETO DE LA SESIÓN
    // La función auth() debe ejecutarse *antes* de desestructurar { getToken }
    const { getToken, userId } = await auth(); // Obtenemos el userId para la verificación Y getToken para el token JWT.

    // 2. Comprobar si hay un usuario logueado
    if (!userId) {
        console.warn("Attempt to fetch review eligibility without a logged-in user.");
        return {
            canReview: false,
            orderId: null,
            message: 'AUTH_REQUIRED',
        };
    }
    
    // 3. OBTENER EL JWT REAL
    // getToken() sin argumentos obtiene el token de sesión (session token) por defecto.
    const sessionToken = await getToken(); 
    
    if (!sessionToken) {
         console.warn("User is logged in but no session token found.");
         return {
            canReview: false,
            orderId: null,
            message: 'TOKEN_MISSING',
        };
    }


    // 4. Crear los encabezados, incluyendo el token JWT en el formato "Bearer"
    const headers = {
        "Content-Type": "application/json",
        // Pasar el token en el formato estándar HTTP de autenticación JWT
        "Authorization": `Bearer ${sessionToken}`, 
        // Si tu backend todavía necesita el ID del usuario en un encabezado separado, puedes incluirlo:
        "X-User-ID": userId, 
    };


    // 5. Realizar la petición fetch
    const res = await fetch(`${BACKEND_URL}/${locale}/api/reviews/eligible?sellerId=${sellerId}`, {
        method: "GET",
        headers: headers,
        // Es buena práctica usar 'no-store' para asegurarse de que esta llamada
        // siempre se ejecuta en tiempo real y no usa una caché antigua, ya que depende de la sesión.
        cache: 'no-store', 
    });

    if (!res.ok) {
        console.error("Backend error fetching review eligibility:", res.status, await res.text());
        return { canReview: false, orderId: null, message: 'API_ERROR' };
    }
    
    const eligibility = await res.json();
    return eligibility;
}
