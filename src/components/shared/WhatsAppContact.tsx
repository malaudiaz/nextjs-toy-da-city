// components/WhatsAppContact.tsx
import Link from 'next/link';
import { ReactNode } from 'react';

interface WhatsAppContactProps {
  phoneNumber: string;
  message?: string;
  defaultMessage?: string;
  children?: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  iconOnly?: boolean;
  iconPosition?: 'left' | 'right';
  ariaLabel?: string;
}

const WhatsAppContact = ({ 
  phoneNumber, 
  message = '',
  defaultMessage = "Hola, me gustaría obtener más información",
  children,
  className = '',
  variant = 'primary',
  size = 'medium',
  showIcon = true,
  iconOnly = false,
  iconPosition = 'left',
  ariaLabel
}: WhatsAppContactProps) => {
  // Validar que el número de teléfono no esté vacío
  if (!phoneNumber || phoneNumber.trim() === '') {
    console.error('WhatsAppContact: phoneNumber prop is required');
    return null;
  }

  const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
  const finalMessage = message || defaultMessage;
  const encodedMessage = encodeURIComponent(finalMessage);
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;

  // Variantes de estilo
  const variants: Record<string, string> = {
    primary: 'bg-green-500 hover:bg-green-600 text-white shadow-sm',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300',
    outline: 'border border-green-500 text-green-500 hover:bg-green-50',
    ghost: 'text-green-600 hover:bg-green-50 hover:text-green-700'
  };

  // Tamaños para modo con texto
  const sizesWithText: Record<string, string> = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  // Tamaños para modo solo icono (cuadrados)
  const sizesIconOnly: Record<string, string> = {
    small: 'p-2',
    medium: 'p-3',
    large: 'p-4'
  };

  // Tamaños de icono
  const iconSizes: Record<string, string> = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const icon = showIcon ? (
    <WhatsAppIcon className={iconSizes[size]} />
  ) : null;

  // Texto para mostrar
  const displayText = children || 'Enviar mensaje';

  // Determinar si estamos en modo solo icono
  const isIconOnly = iconOnly || (!children && !showIcon);

  // Clases base comunes
  const baseClasses = `
    inline-flex items-center justify-center 
    rounded-lg font-medium transition-all duration-200
    hover:scale-105 active:scale-95
    ${variants[variant]} 
    ${isIconOnly ? sizesIconOnly[size] : sizesWithText[size]} 
    ${className}
  `;

  // Label para accesibilidad
  const buttonAriaLabel = ariaLabel || `Contactar por WhatsApp al número ${phoneNumber}`;

  return (
    <Link 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClasses}
      aria-label={buttonAriaLabel}
      title={buttonAriaLabel}
    >
      {/* Modo solo icono */}
      {isIconOnly && icon}
      
      {/* Modo con texto */}
      {!isIconOnly && (
        <>
          {iconPosition === 'left' && icon}
          {displayText}
          {iconPosition === 'right' && icon}
        </>
      )}
    </Link>
  );
};

// Componente de icono reutilizable
const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.189-1.248-6.189-3.515-8.444"/>
  </svg>
);

export default WhatsAppContact;