import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type NominatimItem = {
  lat: string;
  lon: string;
  address?: {
    house_number?: string;
    road?: string;
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
  };
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 3) {
    return NextResponse.json([]);
  }

  const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`;

  const res = await fetch(url);

  if (!res.ok) {
    return new Response("Erreur lors de la récupération des adresses", {
      status: res.status,
    });
  }

  const data = await res.json();

  if (!data.features) {
    return NextResponse.json([]);
  }

  const filtered = data.features.map((feature: any) => {
    return {
      label: feature.properties.label,
      lat: feature.geometry.coordinates[1], // GeoJSON is [lon, lat]
      lon: feature.geometry.coordinates[0],
    };
  });

  return NextResponse.json(filtered);
}
