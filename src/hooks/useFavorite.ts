"use client";

export function useFavorite() {
  const addToFavorites = async (toyId: string) => {
    try {
      //const token = await getToken();
      const res = await fetch("/api/favoritetoys", {
        method: "POST",
        body: JSON.stringify({ toyId }),
      });

      return await res.json();
    } catch (error) {
      console.error("Failed to add to favorites:", error);
      throw error;
    }
  };

  const fetchFavoritesById = async (toyId: string) => {
    try {
      const res = await fetch(`/api/favoritetoys/${toyId}`, {
        method: "GET",
      });
      return await res.json();
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      throw error;
    }   
  };
  return { addToFavorites, fetchFavoritesById };
}