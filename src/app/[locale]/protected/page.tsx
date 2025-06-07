"use client";

import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ProtectedPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [token, setToken] = useState<string>("");
  
  const { getToken } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Not signed in</div>;
  }


  const userRoles = user?.publicMetadata?.roles || [];

  const handleGetToken = async () => {
    try {
      // Obtiene el token JWT desde Clerk
      const jwt = await getToken({ template: "Toydacity" });
      setToken(jwt || "");
      console.log("Token obtenido: Bearer", jwt);
    } catch (error) {
      console.error("Error al obtener token:", error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>This is a protected page</div>

        <div className="container mx-auto px-6 py-8 bg-[#FAF1DE] min-h-screen">
          <h1>Hello, {user.firstName}!</h1>
          <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
          <p>Teléfono: {user?.phoneNumbers[0]?.phoneNumber}</p>          

          <div className="py-8">
            <h2>Roles del usuario (cliente):</h2>
            <ul className="px-4">
              {Array.isArray(userRoles) &&
                userRoles.map((role, index) => <li key={index}>{role}</li>)}
            </ul>
          </div>

          <Button className="w-full bg-[#4c754b] text-white px-4 py-2" onClick={handleGetToken}>
              Obtener Token
          </Button>

          <div className="break-words max-w-full overflow-hidden px-4 py-4">
            <p>{"Token obtenido: Bearer " + token}</p>
          </div>

        </div>
      </main>
    </div>
  );
}
