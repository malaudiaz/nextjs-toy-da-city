'use client';

import React from "react";
import { SignInButton } from '@clerk/nextjs';

export default function Sigin() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center space-y-6">
        {/* Icono opcional */}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
            />
          </svg>
        </div>

        {/* Mensaje */}
        <h2 className="text-2xl font-bold text-gray-900">Acceso requerido</h2>
        <p className="text-gray-600">
          Por favor inicia sesión para acceder a esta página
        </p>

        {/* Botón de Clerk */}
        <div className="mt-6">
          <SignInButton mode="modal">
            <button className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4c754b] hover:bg-[#558d54] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Iniciar sesión
            </button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
}
