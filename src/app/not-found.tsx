import Link from "next/link";
import React from "react";
import BackButtonSimple from "@/components/shared/BackButtonSimple";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toydacity - Página No Encontrada",
};

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <div className="notfound-icon" aria-hidden>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="404">
            <text x="12" y="14" dominantBaseline="middle" textAnchor="middle" fontSize="24" fill="#DC2626" fontWeight="bold">404</text>
          </svg>
        </div>

        <h2 className="notfound-title">No Encontrada</h2>
        <p className="notfound-desc">La página no existe</p>

        <div className="notfound-actions">
          <BackButtonSimple className="btn btn-back">Volver</BackButtonSimple>
          <Link href="/" className="btn-link">Inicio</Link>
        </div>
      </div>

      <style>{`
        .not-found-container{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f3f4f6;margin:0}
        .not-found-card{width:250px;height:200px;background:#e5e7eb;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px;box-shadow:0 6px 18px rgba(15,23,42,0.06);box-sizing:border-box;gap:6px}
        .notfound-icon{width:86px;height:86px;border-radius:50%;background:#fee2e2;display:flex;align-items:center;justify-content:center}
        .notfound-icon svg{width:80px;height:80px}
        .notfound-title{font-size:14px;font-weight:600;color:#111827;margin:0}
        .notfound-desc{font-size:12px;color:#4b5563;margin:0}
        .notfound-actions{margin-top:8px;width:100%;display:flex;flex-direction:column;gap:6px}
        .btn{width:100%;padding:6px 8px;font-size:12px;border-radius:6px;border:none;cursor:pointer}
        .btn-back{background:#16a34a;color:#fff}
        .btn-back:hover{background:#15803d}
        .btn-link{display:inline-block;text-align:center;padding:6px 8px;font-size:12px;border-radius:6px;border:1px solid #d1d5db;color:#374151;text-decoration:none}
        .btn-link:hover{background:#e5e7eb}
        @media (max-height:240px){.not-found-card{height:180px;padding:8px}}
      `}</style>
    </div>
  );
}
