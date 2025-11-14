// app/api/check-db/route.ts
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server'; // Importante para obtener el usuario de Clerk
import prisma from '@/lib/prisma'; // Asume que tienes un cliente Prisma inicializado

// Esta API se llama internamente desde el middleware
export async function GET() {
  // Nota: Dado que esta API es llamada *después* de que Clerk valida el token,
  // podemos usar la función 'currentUser' de Clerk para obtener el userId.
  const user = await currentUser(); 
  
  if (!user || !user.id) {
    // Esto no debería pasar si el middleware hizo su trabajo, pero es un buen control
    return new NextResponse(null, { status: 401 }); // No autorizado
  }

  try {
    // 🛑 Consulta a Prisma
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }, // Asume que guardas el ID de Clerk como 'clerkId'
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