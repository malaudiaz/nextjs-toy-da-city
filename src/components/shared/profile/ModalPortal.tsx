// components/ui/ModalPortal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
  children: React.ReactNode;
}

export default function ModalPortal({ children }: ModalPortalProps) {
  const modalRootRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Creamos el nodo raíz del portal
    modalRootRef.current = document.createElement("div");
    modalRootRef.current.id = "modal-portal-root";
    document.body.appendChild(modalRootRef.current);

    setIsMounted(true);

    return () => {
      if (modalRootRef.current) {
        document.body.removeChild(modalRootRef.current);
      }
    };
  }, []);

  // Mientras no esté montado, NO renderizamos nada (evita render parcial)
  if (!isMounted || !modalRootRef.current) {
    return null;
  }

  return createPortal(children, modalRootRef.current);
}