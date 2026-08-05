"use client";

import { Client } from "@/models/client.model";
import { getAllClients } from "@/services/client.service";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ClientMap = dynamic(() => import("@/components/client/ClientMap"), {
  ssr: false,
});

export default function ClientsMapPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllClients()
      .then(setClients)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-full">
      {loading ? <p>Chargement...</p> : <ClientMap clients={clients} />}
    </div>
  );
}
