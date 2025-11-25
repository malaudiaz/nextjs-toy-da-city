// src/components/Profile.tsx
'use client';

import React from 'react';
import { RatingStars } from './Raiting';
import { UserAvatar } from './UserAvatar';
import { useTranslations } from 'next-intl'; // ✅ Importa el hook

type Props = {
  user: {
    id: string; // ID de Prisma (id de la tabla 'users')
    fullName: string;
    imageUrl: string;
    clerkId: string;
    email: string;
    phone: string;
    role: string; // Incluir el rol para la validación/información
    reputation: number;
    reviewsCount: number; // Cantidad total de reseñas recibidas
  } | null;
};

export default function Profile({ user }: Props) {
  const t = useTranslations('profile'); // ✅ Usa el hook
  if (!user) {
    return (
      <div className="flex flex-row gap-4 items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        <p className="text-sm text-gray-500">{t('unavailable')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4 items-center">
      {/* Avatar */}
      <UserAvatar userId={user.id} src={user.imageUrl} alt={user.fullName} />

      {/* Nombre y estrellas */}
      <div className="flex flex-col">
        <p className="text-sm md:text-base font-medium text-gray-800">
          {user.fullName}
        </p>
        <RatingStars rating={user.reputation || 0} reviewCount={user.reviewsCount || 0} />
      </div>
    </div>
  );
}