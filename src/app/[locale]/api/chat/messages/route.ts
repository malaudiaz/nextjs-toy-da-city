import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { getClerkUserById } from '@/lib/clerk'
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

  // Obtener los mensajes de la base de datos
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

  const currentUser = await getClerkUserById(userId);
  const otherUser = await getClerkUserById(otherUserId);


  // Enriquecer los mensajes con las imágenes de perfil
  const enrichedMessages = messages.map(message => ({
    ...message,
    sender: {
      ...message.sender,
      imageUrl: message.senderId === userId 
        ? currentUser?.image_url 
        : otherUser?.image_url
    },
    receiver: {
      ...message.receiver,
      imageUrl: message.receiverId === userId 
        ? currentUser?.image_url 
        : otherUser?.imageUrl
    }
  }));

  return Response.json({ messages: enrichedMessages })
}