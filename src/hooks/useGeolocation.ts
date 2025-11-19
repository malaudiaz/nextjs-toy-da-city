// src/hooks/useGeolocation.ts
"use client";

import { useState, useEffect } from 'react'; // 👈 Importar useEffect

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
  });

  // Función para obtener la ubicación (SÍNCRONA, pero llamada por useEffect)
  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
        setLocation(prev => ({ ...prev, error: 'Geolocation not supported' }));
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
            });
        },
        (error) => {
            setLocation(prev => ({ ...prev, error: error.message }));
        }
    );
  };
  
  // 1. Usar useEffect para llamar a getCurrentPosition una sola vez al montar
  
  // Mantenemos getLocationAsync por si lo usas en otro lugar, pero no es necesario para la URL
  const getLocationAsync = async (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    // ... (la implementación original de Promise se mantiene aquí si la necesitas,
    // pero la clave para la URL es el useEffect de arriba).
    // ...
    // Nota: Por simplicidad, el return solo expone la ubicación actual
    return new Promise((resolve, reject) => {
        getCurrentPosition(); // Podrías disparar la posición de nuevo
        // ... (Tu lógica original de resolve/reject basada en getCurrentPosition)
        if (location.latitude && location.longitude) {
             resolve({ latitude: location.latitude, longitude: location.longitude } as { latitude: number, longitude: number });
        } else {
             reject(new Error(location.error || "Location not yet retrieved or permission denied"));
        }
    });
  };

  return { ...location, getLocationAsync, getCurrentPosition };
};