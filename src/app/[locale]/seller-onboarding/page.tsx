// app/seller-onboarding/page.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function SellerOnboarding() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleBecomeSeller = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const response = await fetch("/api/stripe-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error("Error al iniciar onboarding");
      }

      const data = await response.json();
      window.location.href = data.onboardingUrl;
    } catch (error) {
      console.error("Error al iniciar onboarding de vendedor:", error);
      alert("No se pudo iniciar el proceso de vendedor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Become a Seller
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">
            Set up your seller account to start selling products.
          </p>

          <button
            onClick={handleBecomeSeller}
            disabled={loading}
            className="w-full bg-[#4c754b] text-white py-2 rounded hover:bg-[#558d54]"
          >
            {loading ? "Processing..." : "Start Selling"}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
