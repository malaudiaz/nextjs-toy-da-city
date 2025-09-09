import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { pusher } from '@/lib/pusher'
import webPush from '@/lib/webpush'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // Recibir los parmaetros por Body
  const { receiverId, content, toyId } = await req.json()
  if (!receiverId || !content || !toyId) {
    return Response.json({ error: 'Missing data' }, { status: 400 })
  }

  // Validar que el receptor exista
  const receiver = await prisma.user.findUnique({
    where: { clerkId: receiverId },
    select: { id: true },
  });

  if (!receiver) {
    return NextResponse.json(
      { error: "Receiver not found !!" },
      { status: 404 }
    );
  }

  // Guardar mensaje
  const message = await prisma.message.create({
   data: {
      content,
      senderId: userId,
      receiverId,
      toyId
    },
    include: { sender: true },
  })

  // Enviar vía Pusher al receptor (en tiempo real)
  await pusher.trigger(`private-chat-${receiverId}`, 'new-message', {
    message,
  })

  // Enviar notificación push (si está offline)
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId: receiverId },
  })

  for (const sub of subscriptions) {
    try {
      await webPush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: sub.keys as { p256dh: string; auth: string },
        },
        JSON.stringify({
          title: `Nuevo mensaje de ${message.sender.name}`,
          body: content,
          icon: '/logo.png',
          data: { url: `/chat/${userId}` },
        })
      )
    } catch (error) {
      if (error instanceof webPush.WebPushError && [410, 404].includes(error.statusCode)) {
        await prisma.pushSubscription.delete({ where: { id: sub.id } })
      }
    }
  }

  return Response.json({ success: true })
}