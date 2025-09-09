import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const ONLINE_THRESHOLD = 60 * 1000; // 60 segundos

export async function GET(req: NextRequest) {
  
  let { userId } = await auth();

  if (!userId) {
    userId = req.headers.get("X-User-ID");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
 
  try {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - ONLINE_THRESHOLD);

    const onlineUsers = await prisma.user.findMany({
      where: {
        lastSeen: {
          gte: cutoffTime, // Última vez visto hace menos de 60 segundos
        },
        clerkId: {
          not: userId, // 👈 EXCLUYE al usuario logueado
        },        
      },
      select: {
        id: true,
        name: true,
        email: true, 
        phone: true,
        clerkId: true,
        reputation: true,
        role: true,
        lastSeen: true,
      },
      orderBy: {
        lastSeen: 'desc', // Opcional: ordenar por último visto
      },
    });

    return Response.json({
      onlineUsers,
      count: onlineUsers.length,
    });
  } catch (error) {
    console.error('Error fetching online users:', error);
    return Response.json(
      { error: 'Internal Server Error', onlineUsers: [] },
      { status: 500 }
    );
  }
}