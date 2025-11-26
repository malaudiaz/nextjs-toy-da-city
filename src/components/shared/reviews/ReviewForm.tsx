'use client';

import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { toast } from "sonner";
import { useTranslations } from "next-intl"; // ✅ Importa el hook
import { useRouter } from 'next/navigation';

interface ReviewFormProps {
  targetUserId: string;
  orderId?: string; // Opcional: vincular a una orden específica
  onReviewSubmitted?: () => void; // Callback para recargar perfil u órdenes
}

export default function ReviewForm({
  targetUserId,
  orderId,
  onReviewSubmitted,
}: ReviewFormProps) {
  const t = useTranslations("reviewForm"); // ✅ Usa el hook
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      toast.error(t("error"));
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId,
          rating,
          comment: comment.trim() || undefined,
          orderId: orderId || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t("sendingError"));
      }

      toast.success(t("success"));
      onReviewSubmitted?.(); // Recarga perfil u órdenes
      setRating(null);
      setComment('');
      router.push(`/config/purchases`);
    } catch (error: unknown) {
        let errorMessage = t("sendingError");       
        
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }     
            
        toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-bold text-lg mb-3">{t("title")}</h3>

      {/* Selector de estrellas */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("rating")}
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`p-2 rounded-full transition-colors ${
                rating && star <= rating
                  ? 'text-yellow-400 bg-yellow-50'
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
              aria-label={`${t("rating")} ${star} ${t("stars")}`}
            >
              <StarIcon className="h-8 w-8" />
            </button>
          ))}
        </div>
        {rating && <p className="text-sm text-gray-600 mt-1">({rating} {t("stars")})</p>}
      </div>

      {/* Campo de comentario */}
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          {t("comment")}
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t("experience")}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !rating}
        className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors ${
          isSubmitting || !rating
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSubmitting ? t("submiting") : t("submit")}
      </button>
    </form>
  );
}