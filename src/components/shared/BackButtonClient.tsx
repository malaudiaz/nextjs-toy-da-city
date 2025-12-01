'use client'

import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function BackButtonClient({ className, children }: Props) {
  const router = useRouter();
  const baseClass = 'px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700';
  return (
    <button
      onClick={() => router.back()}
      className={`${baseClass} ${className ?? ''}`.trim()}
    >
      {children ?? '← Volver a la página anterior'}
    </button>
  );
}
