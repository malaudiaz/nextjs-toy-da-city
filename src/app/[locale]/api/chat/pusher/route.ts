import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { pusher } from '@/lib/pusher'
import { getTranslations } from "next-intl/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth()

  const g = await getTranslations("General.errors");
  const t = await getTranslations("User.errors");
  
  if (!userId) {
    return NextResponse.json({ error: g('Unauthorized') }, { status: 401 })
  }

  // ✅ Leer el cuerpo como texto (no JSON)
  const body = await req.text()

  // ✅ Parsear como query string: "socket_id=xxx&channel_name=yyy"
  const params = new URLSearchParams(body)
  const socketId = params.get('socket_id')
  const channelName = params.get('channel_name')

  if (!socketId || !channelName) {
    return new Response(
      JSON.stringify({ error: 'Missing socket_id or channel_name' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    // ✅ Usar authorizeChannel
    const authResponse = await pusher.authorizeChannel(socketId, channelName, {
      user_id: userId,
    })

    return new Response(JSON.stringify(authResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Pusher auth error:', error)
    return new Response(
      JSON.stringify({ error: t('AuthenticationFailed') }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}