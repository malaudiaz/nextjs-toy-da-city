// src/app/[locale]/api/presence/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { getTranslations } from "next-intl/server";


const ONLINE_THRESHOLD = 60 * 1000; // 60 segundos

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  const g = await getTranslations("General.errors");
  const t = await getTranslations("User.errors");
  
  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  // Extraemos `id` del pathname
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const id = pathSegments.pop(); // Último segmento → [id]

  if (!id) {
    return NextResponse.json({ error: t("InvaliduserID") }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: id },
      select: { name: true, lastSeen: true },
    });

    if (!user) {
      return NextResponse.json({ online: false });
    }

    const now = new Date();
    const timeDiff = now.getTime() - user.lastSeen.getTime();
    const online = timeDiff < ONLINE_THRESHOLD;

    return NextResponse.json({ online });
  } catch (error) {
    console.error("Error checking presence:", error);
    return NextResponse.json({ online: false }, { status: 500 });
  }
}