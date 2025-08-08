"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      // Verificar la sesión de pago
      fetch(`/api/verify-payment?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            // Limpiar el carrito (ejemplo con localStorage)
            localStorage.removeItem("cart");
            // Opcional: Actualizar el estado si usas un manejador de estado como Redux o Zustand
            // Ejemplo: dispatch(clearCart());
            console.log("Carrito limpiado");
          } else {
            console.error("Error al verificar el pago:", data.error);
            // Opcional: Redirigir a una página de error o al carrito
            router.push("/[locale]/cart");
          }
        })
        .catch((error) => {
          console.error("Error al verificar el pago:", error);
          router.push("/[locale]/cart");
        });
    }
  }, [sessionId, router]);

  return (
    <div>
      <h1>{sessionId ? "Procesando el pago..." : "Pago completado"}</h1>
      <p>Gracias por tu compra. Tu carrito ha sido limpiado.</p>
    </div>
  );
}