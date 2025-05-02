"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Cargando...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cerrar sesión
            </button>
          </div>

          <div className="mt-6">
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt="User avatar"
                className="w-20 h-20 rounded-full mx-auto"
              />
            )}
            <div className="mt-4 text-center">
              <h2 className="text-lg font-medium text-gray-900">
                {session?.user?.name}
              </h2>
              <p className="text-gray-600">{session?.user?.email}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">
              Información de la sesión
            </h3>
            <div className="mt-4">
              <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}