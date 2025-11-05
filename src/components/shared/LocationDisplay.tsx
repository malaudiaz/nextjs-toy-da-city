"use client";

import React from "react";
import { useTranslations } from "next-intl";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

type LocationDisplayProps = {
  location: string;
  className?: string;
  showIcon?: boolean;
  loadingText?: string;
  notFoundText?: string;
};

const LocationDisplay = ({
  location,
  className = "",
  showIcon = true,
  loadingText,
  notFoundText
}: LocationDisplayProps) => {
  const t = useTranslations("ProductSearchCard");

  const getCoordinates = () => {
    if (!location) return null;
    try {
      const longitude = parseFloat(location.split(",")[1]);
      const latitude = parseFloat(location.split(",")[0]);
      return { latitude, longitude };
    } catch (error) {
      console.error("Error parsing location:", error);
      return null;
    }
  };

  const coordinates = getCoordinates();

  // useSWR para obtener la ciudad
  const { data: cityData, isLoading: loadingCity } = useSWR(
    coordinates 
      ? `/api/geocode?lat=${coordinates.latitude}&lon=${coordinates.longitude}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  );

  const displayLoadingText = loadingText || t("loadingLocation");
  const displayNotFoundText = notFoundText || t("locationNotFound");
  const city = cityData?.city || displayNotFoundText;

  return (
    <div className={`flex items-center text-sm text-gray-600 ${className}`}>
      {loadingCity ? (
        <span className="text-gray-400">{displayLoadingText}</span>
      ) : (
        <span className="flex items-center">
          {showIcon && (
            <svg 
              className="w-4 h-4 mr-1 text-gray-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
          )}
          {city}
        </span>
      )}
    </div>
  );
};

export default LocationDisplay;