type Props = {
  rating: number; // Ej: 4.3
  reviewCount?: number; // Opcional: número total de reseñas
};

export function RatingStars({ rating = 0, reviewCount = 0 } : Props) {
  // Aseguramos que el rating esté entre 0 y 5
  const normalizedRating = Math.min(5, Math.max(0, rating));
  
  // Generamos un array de 5 estrellas
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(normalizedRating) ? 'full' : 
                   i === Math.floor(normalizedRating) && normalizedRating % 1 >= 0.5 ? 'half' : 'empty';
    return filled;
  });

  return (
    <div className="flex items-center gap-1">
      {/* Renderizado de estrellas */}
      {stars.map((star, i) => (
        <span key={i} className="text-yellow-500 text-sm">
          {star === 'full' && '★'}
          {star === 'half' && '★'} {/* Puedes usar '☆' mitad llena, pero es limitado con texto */}
          {star === 'empty' && '☆'}
        </span>
      ))}

      {/* Mostrar el rating y número de reseñas */}
      <span className="text-xs text-gray-500 ml-1">
        ({reviewCount} reseña{reviewCount !== 1 ? 's' : ''})
      </span>
    </div>
  );
}