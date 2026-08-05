"use client";

import { Appointment } from "@/models/appointment.model";
import { getAllAppointments } from "@/services/appointment.service";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import AppointmentTable from "./AppointmentTable";
import CreateAppointmentDialog from "./CreateAppointmentDialog";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchActive] = useState(false);

  // Chargement rendez-vous
  const fetchAppointments = () => {
    setLoading(true);
    getAllAppointments()
      .then(setAppointments)
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="space-y-4">
      <div className="w-full border-b border-gray-400 flex justify-center gap-2 m-0">
        <CreateAppointmentDialog onAppointmentCreated={fetchAppointments} />
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
            >
              <Search size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center m-0 p-2">
        <div>
          <span>Tous les {appointments.length} rendez-vous</span>
        </div>
      </div>

      {loading ? (
        <p>Chargement des rendez-vous...</p>
      ) : (
        <AppointmentTable
          appointments={appointments}
          onAppointmentUpdated={fetchAppointments}
        />
      )}
    </div>
  );
}
