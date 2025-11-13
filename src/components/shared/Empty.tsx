interface EmptyProps {
    title: string;
    subtitle: string;
}

const Empty = ({title, subtitle}: EmptyProps) => {
  return (
    <div className="flex flex-col text-center items-center justify-center w-full px-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 text-gray-400 mb-4">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#FBBF24" />{" "}
          {/* Amarillo - puedes cambiar el color */}
          <circle cx="8.5" cy="10" r="1.5" fill="#374151" />{" "}
          {/* Ojo izquierdo */}
          <circle cx="15.5" cy="10" r="1.5" fill="#374151" />{" "}
          {/* Ojo derecho */}
          <path
            d="M8 16C8 16 9.5 14 12 14C14.5 14 16 16 16 16"
            stroke="#374151"
            strokeWidth="2"
            strokeLinecap="round"
          />{" "}
          {/* Boca triste */}
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{subtitle}</p>
    </div>
  );
};
export default Empty;