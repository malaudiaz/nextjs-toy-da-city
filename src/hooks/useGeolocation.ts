// src/hooks/useGeolocation.ts
"use client";

import { useState } from 'react';

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

  const getLocationAsync = async (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          };
          setLocation(newLocation);
          resolve({
            latitude: newLocation.latitude as number,
            longitude: newLocation.longitude as number,
          });
        },
        (error) => {
          const errorState = {
            latitude: null,
            longitude: null,
            error: error.message,
          };
          setLocation(errorState);
          reject(error);
        }
      );
    });
  };

  return { ...location, getLocationAsync };
};