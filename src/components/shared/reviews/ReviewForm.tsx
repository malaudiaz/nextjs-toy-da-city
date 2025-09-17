'use client';

import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { toast } from "sonner";

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
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      toast.error('Por favor, selecciona una calificación.');
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
        throw new Error(data.error || 'Error al enviar la reseña');
      }

      toast.success('¡Reseña enviada con éxito!');
      onReviewSubmitted?.(); // Recarga perfil u órdenes
      setRating(null);
      setComment('');
    } catch (error: unknown) {
        let errorMessage = 'Error al enviar la reseña';       
        
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
      <h3 className="font-bold text-lg mb-3">Califica a este vendedor</h3>

      {/* Selector de estrellas */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tu calificación *
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
              aria-label={`Calificar con ${star} estrellas`}
            >
              <StarIcon className="h-8 w-8" />
            </button>
          ))}
        </div>
        {rating && <p className="text-sm text-gray-600 mt-1">({rating} estrellas)</p>}
      </div>

      {/* Campo de comentario */}
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Comentario (opcional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Cuéntanos tu experiencia..."
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
        {isSubmitting ? 'Enviando...' : 'Enviar reseña'}
      </button>
    </form>
  );
}