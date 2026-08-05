"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { BlockingPeriod } from "@/models/blocking-period.model";
import { getAllBlockingPeriods } from "@/services/blocking-period.service";
import BlockingPeriodTable from "./BlockingPeriodTable";
import CreateBlockingPeriodDialog from "./CreateBlockingPeriodDialog";

export function BlockingPeriodList() {
  const [blockingPeriods, setBlockingPeriods] = useState<BlockingPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  const fetchBlockingPeriods = () => {
    setLoading(true);
    getAllBlockingPeriods()
      .then(setBlockingPeriods)
      .catch(() => setBlockingPeriods([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlockingPeriods();
  }, []);

  return (
    <div className="space-y-4">
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

        <CreateBlockingPeriodDialog
          onBlockingPeriodCreated={fetchBlockingPeriods}
        />
      </div>

      {searchActive && (
        <div className="bg-gray-200 border-b border-gray-300 m-0 p-2">
          <div className="flex">
            <div className="relative bg-white">
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-80 h-10 pl-3 pr-3 border border-gray-400 border-r-0 text-sm focus:outline-none focus:ring-1 focus:ring-[#006680] focus:border-[#006680]"
              />
            </div>
            <button
              className="h-10 px-3 bg-[#006680] text-white hover:bg-[#008099] transition-colors border border-[#006680]"
              title="Rechercher"
              // Ici tu peux ajouter une fonction de recherche si tu veux
            >
              <Search size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center m-0 p-2">
        <div>
          <span>Toutes les {blockingPeriods.length} périodes de blocage</span>
        </div>
      </div>

      {loading ? (
        <p>Chargement des périodes de blocage...</p>
      ) : (
        <BlockingPeriodTable
          blockingPeriods={blockingPeriods}
          onBlockingPeriodUpdated={fetchBlockingPeriods}
        />
      )}
    </div>
  );
}
