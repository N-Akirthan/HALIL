"use client";

import { Client } from "@/models/client.model";
import {
  getAuthenticatedUser,
  getFavoriteClients,
  toggleFavoriteClient,
} from "@/services/user.service";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  client: Client;
  onClientUpdated?: () => void;
};

export default function FavoriteCell({ client, onClientUpdated }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // Charge les favoris pour cet utilisateur et client
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const user = await getAuthenticatedUser();
        const favorites = await getFavoriteClients(user.id);
        setIsFavorite(favorites.some((c) => c.id === client.id));
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [client.id]);

  // Toggle du favori
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const user = await getAuthenticatedUser();
      await toggleFavoriteClient(user.id, client.id); // ajoute ou supprime
      // Recharge les favoris pour mettre à jour l'état
      const favorites = await getFavoriteClients(user.id);
      setIsFavorite(favorites.some((c) => c.id === client.id));
      if (onClientUpdated) onClientUpdated();
    } catch (error) {
      console.error("Erreur lors du toggle du favori:", error);
    }
  };

  return (
    <Star
      className={`cursor-pointer transition-colors ${
        isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
      } ${loading ? "opacity-50 pointer-events-none" : ""}`}
      onClick={handleToggleFavorite}
    />
  );
}
