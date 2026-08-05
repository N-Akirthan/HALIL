"use client";

import { Client } from "@/models/client.model";
import { getAllClients, searchClients } from "@/services/client.service";
import {
  getAuthenticatedUser,
  getFavoriteClients,
} from "@/services/user.service";
import { ArrowUpAz, Map, Search, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ClientTable from "./ClientTable";
import CreateClientDialog from "./CreateClientDialog";

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchActive, setSearchActive] = useState(true);
  const [isSorted, setIsSorted] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false); // <- nouveau

  // Ref pour debounce
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchClients = async (query = "") => {
    setLoading(true);
    try {
      if (showFavorites) {
        // On charge les favoris de l'utilisateur courant
        const user = await getAuthenticatedUser();
        let favs = await getFavoriteClients(user.id);

        // Si recherche active, on filtre côté client
        if (query.trim()) {
          const q = query.toLowerCase();
          favs = favs.filter((c) => c.name.toLowerCase().includes(q));
        }

        setClients(favs);
      } else {
        // Mode "tous" : on utilise les endpoints existants
        const fetchFn = query.trim() ? searchClients : getAllClients;
        const list = await fetchFn(query);
        setClients(list);
      }
    } finally {
      setLoading(false);
    }
  };

  // Au montage, charge tous les clients
  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dès que la recherche change, debounce et lance la recherche (dans le contexte actuel : tous ou favoris)
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetchClients(search);
    }, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
    // IMPORTANT : dépend aussi de showFavorites, pour relancer la recherche quand on change de mode
  }, [search, showFavorites]);

  // Quand on bascule Favoris <-> Tous sans changer la recherche, on recharge
  useEffect(() => {
    fetchClients(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFavorites]);

  // Trie les clients par nom si isSorted est vrai
  const displayedClients = isSorted
    ? [...clients].sort((a, b) => a.name.localeCompare(b.name))
    : clients;

  return (
    <div className="space-y-4">
      {/* Sous-barre d’actions */}
      <div className="w-full border-b border-gray-400 flex justify-center gap-2 m-0">
        <button
          onClick={() => setSearchActive(!searchActive)}
          className={`flex flex-col items-center px-4 py-2 text-sm font-medium transition cursor-pointer hover:text-[#dfca70] ${
            searchActive ? "text-[#dfca70]" : ""
          }`}
        >
          <Search />
          <span>Rechercher</span>
        </button>

        <button
          onClick={() => setIsSorted(!isSorted)}
          className={`flex flex-col items-center px-4 py-2 text-sm hover:text-[#dfca70] font-medium transition cursor-pointer ${
            isSorted ? "text-[#dfca70]" : ""
          }`}
        >
          <ArrowUpAz />
          <span>ABC</span>
        </button>

        {/* Bouton Favoris */}
        <button
          onClick={() => setShowFavorites((v) => !v)}
          className={`flex flex-col items-center px-4 py-2 text-sm hover:text-[#dfca70] font-medium transition cursor-pointer ${
            showFavorites ? "text-[#dfca70]" : ""
          }`}
          title={showFavorites ? "Voir tous les clients" : "Voir mes favoris"}
        >
          <Star />
          <span>Favoris</span>
        </button>

        {/* Passe fetchClients au dialogue de création */}
        <CreateClientDialog onClientCreated={() => fetchClients(search)} />
      </div>

      {/* Barre de recherche visible uniquement si searchActive */}
      {searchActive && (
        <div className="bg-[#ededed] border-b border-gray-300 m-0 p-2">
          <div className="flex">
            <div className="relative bg-white">
              <input
                type="text"
                placeholder={
                  showFavorites
                    ? "Rechercher dans mes favoris…"
                    : "Rechercher par nom…"
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-60 h-8 pl-3 pr-3 border border-gray-400 border-r-0 text-sm focus:outline-none focus:ring-1 focus:ring-[#006680] focus:border-[#006680]"
              />
            </div>
            <button
              onClick={() => fetchClients(search)}
              className="h-8 px-3 bg-[#006680] text-white hover:bg-[#008099] transition-colors border border-[#006680]"
              title="Rechercher"
            >
              <Search size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center m-0 p-2">
        <div>
          <span>
            {showFavorites
              ? `${displayedClients.length} client(s) en favoris`
              : `Tous les ${displayedClients.length} client(s)`}
          </span>
        </div>
        <Link
          href="/dashboard/clients/map"
          className="flex flex-col items-center px-4 py-2 text-sm font-medium hover:text-[#dfca70] transition"
        >
          <Map />
          Carte
        </Link>
      </div>

      {/* Passe clients triés (ou non) et fetchClients à ClientTable */}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ClientTable
          clients={displayedClients}
          onClientUpdated={() => fetchClients(search)}
        />
      )}
    </div>
  );
}
