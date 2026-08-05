import { AddressSuggestion } from "@/models/address.model";

export async function searchAddress(
  query: string
): Promise<AddressSuggestion[]> {
  if (query.length < 3) return [];

  const res = await fetch(`/api/searchAddress?q=${encodeURIComponent(query)}`);

  if (!res.ok) throw new Error("Erreur lors de la récupération des adresses");

  const data: AddressSuggestion[] = await res.json();

  return data;
}
