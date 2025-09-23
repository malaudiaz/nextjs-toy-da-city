// components/OnlineTracker.tsx
'use client';

import useSWR from 'swr';
import { useUser, useSession } from '@clerk/nextjs';

const markOnline = async (userId: string) => {
  const res = await fetch('/api/presence/online', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return { ok: true, timestamp: Date.now() };
};

export function OnlineTracker() {
  const { user } = useUser();
  const { session } = useSession();

  useSWR(
    user && session ? ['presence-online', user.id] : null,
    () => markOnline(user!.id),
    {
      refreshInterval: 30_000,
      refreshWhenHidden: false,   // Optimización: no ping si la pestaña está oculta
      refreshWhenOffline: false,  // Optimización: no ping si offline
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      errorRetryCount: 3,
/*       onError: (err) => {
        console.error('❌ Error al marcar presencia:', err.message);
      }, */
    }
  );

  return null;
}