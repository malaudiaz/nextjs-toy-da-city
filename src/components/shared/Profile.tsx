// src/components/Profile.tsx
'use client';

import React from 'react';
import { RatingStars } from './Raiting';
import { UserAvatar } from './UserAvatar';

type Props = {
  user: {
    id: string;
    fullName: string;
    imageUrl: string;
    reputation?: number;
    reviews?: number;
  } | null;
};

export default function Profile({ user }: Props) {
  if (!user) {
    return (
      <div className="flex flex-row gap-4 items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        <p className="text-sm text-gray-500">Vendedor no disponible</p>
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
        <RatingStars rating={user.reputation || 0} reviewCount={user.reviews || 0} />
      </div>
    </div>
  );
}