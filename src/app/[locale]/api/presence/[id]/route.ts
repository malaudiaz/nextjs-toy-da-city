import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

const ONLINE_THRESHOLD = 60 * 1000; // 60 segundos

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const awaitedParams = await params;
  const { id } = awaitedParams;    

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: id },
      select: { name: true, lastSeen: true },
    });

    if (!user) {
      return Response.json({ online: false });
    }

    const now = new Date();
    const timeDiff = now.getTime() - user.lastSeen.getTime();
    const online = timeDiff < ONLINE_THRESHOLD;

    return Response.json({ online });
  } catch (error) {
    console.log(error);
    return Response.json({ online: false }, { status: 500 });
  }
}