// app/api/check-db/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Asume que tienes un cliente Prisma inicializado

// Esta API se llama internamente desde el middleware
export async function GET(request: Request) {
  
  // 1. Obtener el userId de los headers (el middleware lo pasó)
  const userId = request.headers.get('X-User-ID'); 
  
  if (!userId) {
    // Si por alguna razón el middleware no pasó el ID (debería ser imposible)
    return new NextResponse(null, { status: 401 }); // No autorizado
  }  

  try {
    // 🛑 Consulta a Prisma
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }, // Asume que guardas el ID de Clerk como 'clerkId'
      select: { id: true },
    });

    if (dbUser) {
      // ✅ Usuario encontrado en DB. Devolvemos 200 OK.
      return NextResponse.json({ exists: true });
    } else {
      // ❌ Usuario autenticado con Clerk, pero NO existe en la DB.
      return new NextResponse(null, { status: 403 }); // Prohibido/Usuario no registrado
    }

  } catch (error) {
    console.error("Error al consultar DB:", error);
    return new NextResponse(null, { status: 500 }); // Error interno del servidor
  }
}