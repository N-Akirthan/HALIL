import { BlockingPeriod } from "@/models/blocking-period.model";
import { SendBlockingPeriod } from "@/payload/request/send-blocking-period";
import { getAuthHeaders } from "./user.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// -------------------- API Calls --------------------

// Récupérer toutes les périodes de blocage
export async function getAllBlockingPeriods(): Promise<BlockingPeriod[]> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
  };

  const res = await fetch(`${API_BASE_URL}/blocking-periods`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json();
    const errorMessage =
      errorBody?.detail || "Failed to fetch blocking periods.";
    throw new Error(errorMessage);
  }

  return res.json();
}

// Récupérer les périodes de blocage d'un client
export async function getBlockingPeriodsByClient(
  clientId: number
): Promise<BlockingPeriod[]> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
  };

  const res = await fetch(
    `${API_BASE_URL}/blocking-periods/client/${clientId}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!res.ok) {
    const errorBody = await res.json();
    const errorMessage =
      errorBody?.detail || "Failed to fetch blocking periods for client.";
    throw new Error(errorMessage);
  }

  return res.json();
}

// Créer une nouvelle période de blocage
export async function createBlockingPeriod(
  payload: SendBlockingPeriod
): Promise<BlockingPeriod> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  };

  const res = await fetch(`${API_BASE_URL}/blocking-periods`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json();
    const errorMessage =
      errorBody?.detail || "Failed to create blocking period.";
    throw new Error(errorMessage);
  }

  return res.json();
}

// Mettre à jour une période de blocage
export async function updateBlockingPeriod(
  id: number,
  payload: SendBlockingPeriod
): Promise<BlockingPeriod> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  };

  const res = await fetch(`${API_BASE_URL}/blocking-periods/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json();
    const errorMessage =
      errorBody?.detail || "Failed to update blocking period.";
    throw new Error(errorMessage);
  }

  return res.json();
}

// Supprimer une période de blocage
export async function deleteBlockingPeriod(id: number): Promise<void> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
  };

  const res = await fetch(`${API_BASE_URL}/blocking-periods/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json();
    const errorMessage =
      errorBody?.detail || "Failed to delete blocking period.";
    throw new Error(errorMessage);
  }
}
