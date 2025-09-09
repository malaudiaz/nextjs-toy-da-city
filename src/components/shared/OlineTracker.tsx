// components/OnlineTracker.tsx
'use client';

import { useUser, useSession } from '@clerk/nextjs';
import { useEffect } from 'react';

export function OnlineTracker() {
  const { user } = useUser();
  const { session } = useSession();

  useEffect(() => {
    if (!user || !session) return;

    // Marcar como online al cargar
    const markOnline = async () => {
      await fetch('/api/presence/online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
    };

    markOnline();

    // Enviar ping cada 30 segundos
    const interval = setInterval(markOnline, 30_000);

    return () => clearInterval(interval);
  }, [user, session]);

  return null;
}