import { Client } from "@/models/client.model";
import { User } from "@/models/user.model";
import { SendUser } from "@/payload/request/send-user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
    throw new Error("Token manquant");
  }

  return {
    "ngrok-skip-browser-warning": "true",
    Authorization: `Bearer ${token}`,
  };
}

export async function getAuthenticatedUser(): Promise<User> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
  };
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    headers,
  });
  if (!res.ok) {
    throw new Error("Impossible de récupérer l'utilisateur connecté");
  }
  return res.json();
}

export async function getAllUsers(): Promise<User[]> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
  };
  const res = await fetch(`${API_BASE_URL}/users/`, {
    headers,
  });
  if (!res.ok) {
    throw new Error("Impossible de récupérer tous les utilisateurs");
  }
  return res.json();
}

export async function updateUser(
  userId: number,
  userData: SendUser
): Promise<User> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  };

  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error("Impossible de mettre à jour l'utilisateur");
  }
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  return data;
}

export async function addFavoriteClient(
  userId: number,
  clientId: number
): Promise<User> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
  };

  const res = await fetch(
    `${API_BASE_URL}/users/${userId}/favorites/${clientId}`,
    {
      method: "POST",
      headers,
    }
  );

  if (!res.ok) {
    throw new Error("Impossible d’ajouter le client favori");
  }

  return res.json();
}

export async function toggleFavoriteClient(
  userId: number,
  clientId: number
): Promise<void> {
  const headers: HeadersInit = { ...getAuthHeaders() };

  const res = await fetch(
    `${API_BASE_URL}/users/${userId}/favorites/${clientId}/toggle`,
    {
      method: "POST",
      headers,
    }
  );

  if (!res.ok) throw new Error("Impossible de toggler le favori");
}

export async function getFavoriteClients(userId: number): Promise<Client[]> {
  const headers: HeadersInit = { ...getAuthHeaders() };

  const res = await fetch(`${API_BASE_URL}/users/${userId}/favorites`, {
    headers,
  });
  if (!res.ok) throw new Error("Impossible de récupérer les favoris");
  return res.json();
}
