// app/seller-dashboard/page.tsx
'use client';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function SellerDashboard() {
  const { user } = useUser();
  const [stripeAccountStatus, setStripeAccountStatus] = useState<null | string>(null);

  useEffect(() => {
    if (!user) return;

    const fetchStripeStatus = async () => {
      try {
        const response = await fetch(`/api/user?clerkId=${user.id}`);
        if (!response.ok) {
          throw new Error('Error al obtener datos del usuario');
        }
        const data = await response.json();
        setStripeAccountStatus(data.stripeAccountId);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    };

    fetchStripeStatus();
  }, [user]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Panel de Vendedor</h2>
        {stripeAccountStatus ? (
          <p>Tu cuenta de Stripe está configurada. ¡Empieza a añadir productos!</p>
        ) : (
          <p>Por favor, completa el proceso de onboarding de vendedor.</p>
        )}
      </div>
    </div>
  );
}