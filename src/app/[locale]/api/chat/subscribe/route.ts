import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { getTranslations } from "next-intl/server";


export async function POST(req: NextRequest) {
  const { userId } = await auth()

  const g = await getTranslations("General");
  
  if (!userId) {
    return NextResponse.json({ error: g('Unauthorized') }, { status: 401 })
  }

  try {
    const subscription = await req.json()

    const { endpoint, keys } = subscription
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: g("InvalidSubscriptionFormat") },
        { status: 400 }
      )
    }

    // Guardar o actualizar
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        keys,
        userId
      },
      create: {
        endpoint,
        keys,
        userId
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving push subscription:', error)
    return NextResponse.json(
      { error: g('ServerError') },
      { status: 500 }
    )
  }
}