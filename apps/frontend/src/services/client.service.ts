import { Client } from "@/models/client.model";
import { OpeningHours } from "@/models/opening-hours.model";
import { SendClient } from "@/payload/request/send-client";
import { SendOpeningHours } from "@/payload/request/send-opening-hours";
import { getAuthHeaders } from "./user.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllClients(): Promise<Client[]> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
  };

  const res = await fetch(`${API_BASE_URL}/clients`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    console.log(text);
    let errorMessage = "Failed to fetch clients from server.";
    try {
      const errorBody = text ? JSON.parse(text) : null;
      if (errorBody?.detail) {
        errorMessage = errorBody.detail;
      }
    } catch {
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }
  const text = await res.text();
  if (!text) {
    return [];
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Réponse invalide du serveur (pas du JSON).");
  }
}

export async function createClient(payload: SendClient): Promise<Client> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  };

  const res = await fetch(`${API_BASE_URL}/clients`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json();
    const errorMessage = errorBody?.detail || "Failed to create client.";
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function deleteClient(id: number): Promise<void> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
  };

  const res = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json();
    const errorMessage = errorBody?.detail || "Failed to delete client.";
    throw new Error(errorMessage);
  }
}

export async function updateClient(
  id: number,
  payload: SendClient
): Promise<Client> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  };

  const res = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json();
    const errorMessage = errorBody?.detail || "Failed to update client.";
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function updateOpeningHours(
  clientId: number,
  payload: SendOpeningHours[]
): Promise<OpeningHours[]> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  };

  const res = await fetch(`${API_BASE_URL}/clients/${clientId}/opening-hours`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorMessage = "Failed to update opening hours.";
    try {
      const errorBody = await res.json();
      if (errorBody?.detail) {
        errorMessage = errorBody.detail;
      }
    } catch {}
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function searchClients(query: string): Promise<Client[]> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
  };

  const url = new URL(`${API_BASE_URL}/clients/search`);
  if (query && query.trim() !== "") {
    url.searchParams.append("q", query.trim());
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    let errorMessage = "Failed to search clients.";
    try {
      const errorBody = text ? JSON.parse(text) : null;
      if (errorBody?.detail) {
        errorMessage = errorBody.detail;
      }
    } catch {
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  const text = await res.text();
  if (!text) {
    return [];
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Invalid server response (not JSON).");
  }
}
