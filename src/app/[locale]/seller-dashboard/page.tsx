"use client";

import Sigin from "@/components/shared/Sigin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SellerDashboard() {
  const { user, isLoaded } = useUser(); // Agrega isLoaded para verificar si Clerk ha terminado de cargar
  const [stripeAccountStatus, setStripeAccountStatus] = useState<null | string>(
    null
  );

  useEffect(() => {
    console.log("useEffect ejecutado", { user });

    if (!isLoaded || !user) {
      console.log("useEffect detenido: isLoaded o user no están listos", {
        isLoaded,
        user,
      });
      return;
    }

    const fetchStripeStatus = async () => {
      try {
        console.log("Haciendo fetch a /api/users/", user.id);
        const response = await fetch(`/api/users/${user.id}/validate-seller`);
        if (!response.ok) {
          throw new Error(`Error en la API: ${response.status}`);
        }
        const data = await response.json();
        console.log("Respuesta de la API:", data);
        setStripeAccountStatus(data.stripeAccountId);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    fetchStripeStatus();
  }, [user, isLoaded]);

  return (
    <>
      {user ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Seller Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 items-center justify-center text-center">
              {!isLoaded ? (
                <p>Cargando...</p>
              ) : stripeAccountStatus ? (
                <p>Your Stripe account is set up. Start adding products!</p>
              ) : (
                <p>Please complete the seller onboarding process.</p>
              )}

              <Link href={"/"}
                className="inline-flex items-center justify-center rounded-md bg-[#4c754b] px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-[#558d54] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full"
              >
                <p>Back to home</p>
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Sigin />
      )}
    </>
  );
}
