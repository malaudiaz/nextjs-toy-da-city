"use client";

import { useUser, useAuth } from "@clerk/nextjs";

export default function ProtectedPage() {
  const { getToken } = useAuth(); // Declaración correcta al inicio
  const { isLoaded, isSignedIn, user } = useUser();


  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Not signed in</div>;
  }

  const fetchData = async () => {
    try {
      // Obtener el token
      const token = await getToken();
      console.log("Token:", token);
      
      // Usar el token en una petición
      const response = await fetch('http://localhost:3000/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // ... manejar la respuesta
      const data = await response.json();
      console.log("Data:", data);
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

          <button onClick={fetchData}>
            Obtener Token y Hacer Petición
          </button>
        </div>
      </main>
    </div>
  );
}
