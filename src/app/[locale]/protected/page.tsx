"use client";

import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";

export default function ProtectedPage() {
  const { isLoaded, isSignedIn, user } = useUser();
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
      console.log("Token obtenido:", jwt);
    } catch (error) {
      console.error("Error al obtener token:", error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>This is a protected page</div>

        <div>
          <h1>Hello, {user.firstName}!</h1>
          <p>Email: {user.primaryEmailAddress?.emailAddress}</p>

          <div>
            <h2>Roles del usuario (cliente):</h2>
            <ul>
              {Array.isArray(userRoles) &&
                userRoles.map((role, index) => <li key={index}>{role}</li>)}
            </ul>
          </div>

          <button onClick={handleGetToken}>
            Obtener Token y Hacer Petición
          </button>
        </div>
      </main>
    </div>
  );
}
