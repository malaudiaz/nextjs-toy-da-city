// app/api/presence/online/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.user.update({
      where: { clerkId: userId },
      data: { lastSeen: new Date() }
    });

    return Response.json({ success: true });
  } catch (error) {
    console.log(error);
    return Response.json({ error: 'Failed to update presence' }, { status: 500 });
  }
}
