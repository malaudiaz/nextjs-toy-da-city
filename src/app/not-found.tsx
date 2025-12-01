import Link from "next/link";
import React from "react";
import BackButtonSimple from "@/components/shared/BackButtonSimple";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Toydacity - Página No Encontrada",
};

export default function NotFound() {
  return (
    <div className="nf-wrapper">
      <div className="nf-card">
        <div className="nf-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
            <text
              x="40"
              y="48"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="36"
              fill="#ef4444"
              fontWeight="bold"
            >
              404
            </text>
          </svg>
        </div>

        <h2 className="nf-title">Page Not Found</h2>
        <p className="nf-desc">The page you are looking for does not exist.</p>

        <div className="nf-actions">
          <BackButtonSimple className="nf-btn nf-btn-back">
            Go Back
          </BackButtonSimple>

          <Button className="nf-btn nf-btn-home">
          <Link href="/" >
            Go to Home
          </Link>
          </Button>
        </div>
      </div>

      {/* --- CSS --- */}
      <style>{`
        .nf-wrapper {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: #f8fafc;
        }

        .nf-card {
          width: 100%;
          max-width: 360px;
          background: white;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
        }

        .nf-icon {
          width: 92px;
          height: 92px;
          background: #fee2e2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nf-icon svg {
          width: 70px;
          height: 70px;
        }

        .nf-title {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          color: #1e293b;
        }

        .nf-desc {
          font-size: 15px;
          color: #475569;
          margin: 0;
        }

        .nf-actions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 12px;
        }

        .nf-btn {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 15px;
          text-align: center;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .nf-btn-back {
          background: #16a34a;
          color: white;
        }
        .nf-btn-back:hover {
          background: #15803d;
        }

        .nf-btn-home {
          border: 1px solid #cbd5e1;
          color: #334155;
          background: #f8fafc;
        }
        .nf-btn-home:hover {
          background: #e2e8f0;
        }

        @media (max-width: 480px) {
          .nf-card {
            padding: 20px;
          }

          .nf-title {
            font-size: 18px;
          }

          .nf-desc {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
