import { NextRequest, NextResponse } from "next/server";

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

  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
    query
  )}&limit=5`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "MonApp/1.0 (contact@monapp.com)",
      "Accept-Language": "fr",
    },
  });

  if (!res.ok) {
    return new Response("Erreur lors de la récupération des adresses", {
      status: res.status,
    });
  }

  const data = await res.json();

  const filtered = data.map((item: NominatimItem) => {
    const addr = item.address || {};
    const city = addr.city || addr.town || addr.village || "";

    const labelParts = [
      addr.house_number,
      addr.road,
      addr.postcode,
      city,
    ].filter(Boolean);

    return {
      label: labelParts.join(" "),
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    };
  });

  return NextResponse.json(filtered);
}
