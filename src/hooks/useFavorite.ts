"use client";

import { useAuth } from "@clerk/nextjs";


export function useFavorite() {
  const { getToken } = useAuth();

  const addToFavorites = async (toyId: string) => {
    try {
      const token = await getToken();
      const res = await fetch("/api/favoritetoys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ toyId }),
      });

      if (!res.ok) {
        throw new Error("Error adding to favorites");
      }

      return await res.json();
    } catch (error) {
      console.error("Failed to add to favorites:", error);
      throw error;
    }
  };

  const fetchFavoritesById = async (toyId: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`/api/favoritetoys/${toyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error fetching favorites");
      }

      return await res.json();
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      throw error;
    }
    
  };
  return { addToFavorites,fetchFavoritesById };
}