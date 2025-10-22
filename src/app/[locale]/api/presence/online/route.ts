// app/api/presence/online/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";


export async function POST() {
  const { userId } = await auth();
  const g = await getTranslations("General.errors");
  const t = await getTranslations("User.errors");


  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  try {
    await prisma.user.update({
      where: { clerkId: userId },
      data: { lastSeen: new Date() }
    });

    return Response.json({ success: true });
  } catch (error) {
    console.log(error);
    return Response.json({ error: t('UpdateError') }, { status: 500 });
  }
}
