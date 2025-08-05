// app/pago-exitoso/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pago exitoso',
};

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        ¡Pago completado con éxito!
      </h1>
      <p className="text-lg mb-8">
        Gracias por tu compra. Hemos enviado un correo con los detalles de tu pedido.
      </p>
      <Link
        href="/"
        className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}