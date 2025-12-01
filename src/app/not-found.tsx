import Link from "next/link";
import React from "react";
import BackButtonClient from "@/components/shared/BackButtonClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toydacity - Página No Encontrada",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-60 h-48 bg-gray-200 rounded-lg flex flex-col items-center justify-center p-3 shadow-md gap-1">
        {/* Icono 404 muy pequeño */}
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" role="img" aria-label="404">
            <text x="12" y="14" dominantBaseline="middle" textAnchor="middle" fontSize="4" fill="#DC2626" fontWeight="bold">404</text>
          </svg>
        </div>

        <h2 className="text-sm font-semibold text-gray-900 text-center">No Encontrada</h2>
        <p className="text-xs text-gray-600 text-center">La página no existe</p>

        <div className="mt-2 flex flex-col gap-1 w-full">
          <BackButtonClient />
          <Link href="/" className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-300 text-center w-full block">
            Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
