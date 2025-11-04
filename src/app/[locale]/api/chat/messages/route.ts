import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { getTranslations } from "next-intl/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth()

  const g = await getTranslations("General");

  if (!userId) {
    return NextResponse.json({ error: g('Unauthorized') }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const otherUserId = searchParams.get('with')
  const toyId = searchParams.get('toyId');

  if (!otherUserId)
    return Response.json({ messages: [] })

  const messages = await prisma.message.findMany({
    where: {
      toyId: toyId,
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
    include: { sender: true, receiver: true },
    orderBy: { createdAt: 'asc' },
  })

  return Response.json({ messages })
}