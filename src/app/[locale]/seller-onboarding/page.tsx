// app/seller-onboarding/page.tsx
'use client';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

export default function SellerOnboarding() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleBecomeSeller = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const response = await fetch('/api/stripe-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Error al iniciar onboarding');
      }

      const data = await response.json();
      window.location.href = data.onboardingUrl;
    } catch (error) {
      console.error('Error al iniciar onboarding de vendedor:', error);
      alert('No se pudo iniciar el proceso de vendedor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Conviértete en Vendedor</h2>
        <p className="mb-4">Configura tu cuenta de vendedor para empezar a vender productos.</p>
        <button
          onClick={handleBecomeSeller}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Procesando...' : 'Empezar a Vender'}
        </button>
      </div>
    </div>
  );
}