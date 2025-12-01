'use client'

import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function BackButtonSimple({ className, children }: Props) {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className={className ?? ''}>
      {children ?? 'Volver'}
    </button>
  );
}
