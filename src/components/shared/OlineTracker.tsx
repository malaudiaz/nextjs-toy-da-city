// components/OnlineTracker.tsx
'use client';

import useSWR from 'swr';
import { useUser, useSession } from '@clerk/nextjs';

// Función fetcher: marca al usuario como online
const markOnline = async (userId: string) => {
  const res = await fetch('/api/presence/online', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  return { ok: true, timestamp: Date.now() };
};

export function OnlineTracker() {
  const { user } = useUser();
  const { session } = useSession();

  // Solo activamos SWR si hay user y session
  useSWR(
    user && session ? ['presence-online', user.id] : null,
    () => markOnline(user!.id),
    {
      refreshInterval: 30_000, // ⏱️ ¡Repite cada 30 segundos!
      revalidateOnFocus: false, // Evita revalidar al volver a la pestaña
      revalidateOnReconnect: true, // Revalida si se pierde y recupera conexión
      shouldRetryOnError: true, // Reintenta si falla
      errorRetryCount: 3,
      onError: (err) => {
        console.error('❌ Error al marcar presencia:', err.message);
      },
    }
  );

  return null;
}