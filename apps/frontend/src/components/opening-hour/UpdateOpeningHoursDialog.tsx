"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Client } from "@/models/client.model";
import { SendOpeningHours } from "@/payload/request/send-opening-hours";
import { getAllClients, updateOpeningHours } from "@/services/client.service";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import TimePicker from "react-time-picker";

type Props = {
  clientId?: number;
  onHoursUpdated: () => void;
};

const DAYS = [
  { key: "MONDAY", label: "Lundi" },
  { key: "TUESDAY", label: "Mardi" },
  { key: "WEDNESDAY", label: "Mercredi" },
  { key: "THURSDAY", label: "Jeudi" },
  { key: "FRIDAY", label: "Vendredi" },
  { key: "SATURDAY", label: "Samedi" },
  { key: "SUNDAY", label: "Dimanche" },
];

export default function UpdateOpeningHoursDialog({
  clientId,
  onHoursUpdated,
}: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | undefined>(
    clientId
  );
  const [hours, setHours] = useState<SendOpeningHours[]>(
    DAYS.map((d) => ({ dayOfWeek: d.key, openTime: null, closeTime: null }))
  );

  // Charge tous les clients au montage
  useEffect(() => {
    getAllClients()
      .then((data) => setClients(data))
      .catch(() => setClients([]));
  }, []);

  // Quand client sélectionné ou clients changent, met à jour les horaires
  useEffect(() => {
    if (!selectedClientId) {
      setHours(
        DAYS.map((d) => ({ dayOfWeek: d.key, openTime: null, closeTime: null }))
      );
      return;
    }

    const client = clients.find((c) => c.id === selectedClientId);

    if (!client || !client.openingHours) {
      setHours(
        DAYS.map((d) => ({ dayOfWeek: d.key, openTime: null, closeTime: null }))
      );
      return;
    }

    // On mappe pour s'assurer que tous les jours sont présents dans l'ordre
    const newHours = DAYS.map((day) => {
      const oh = client.openingHours?.find((h) => h.dayOfWeek === day.key);
      return {
        dayOfWeek: day.key,
        openTime: oh?.openTime ?? null,
        closeTime: oh?.closeTime ?? null,
      };
    });

    setHours(newHours);
  }, [selectedClientId, clients]);

  // Modifier un horaire dans l'état
  const handleTimeChange = (
    dayKey: string,
    field: "openTime" | "closeTime",
    value: string | null
  ) => {
    setHours((prev) =>
      prev.map((h) =>
        h.dayOfWeek === dayKey ? { ...h, [field]: value || null } : h
      )
    );
  };

  // Envoi la mise à jour
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClientId) {
      alert("Veuillez sélectionner un client.");
      return;
    }

    try {
      await updateOpeningHours(selectedClientId, hours);
      alert("Les horaires ont été modifiés avec succès.");
      onHoursUpdated();
    } catch (err) {
      if (err instanceof Error) alert("Erreur : " + err.message);
      else alert("Erreur inconnue lors de la mise à jour.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span
          role="button"
          tabIndex={0}
          className="flex flex-col items-center text-sm font-medium hover:text-[#dfca70] cursor-pointer"
        >
          <Pencil className="cursor-pointer rounded p-0.5" />
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier les horaires d’ouverture</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {!clientId && (
            <label className="block text-sm font-medium text-gray-700">
              Client *
              <select
                value={selectedClientId ?? ""}
                onChange={(e) => setSelectedClientId(Number(e.target.value))}
                required
                className="w-full border px-3 py-2 rounded mt-1"
              >
                <option value="">-- Choisissez un client --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          {selectedClientId && (
            <p className="text-sm font-medium text-gray-700">
              Client sélectionné :{" "}
              <span className="font-semibold">
                {clients.find((c) => c.id === selectedClientId)?.name ??
                  "Inconnu"}
              </span>
            </p>
          )}

          <div className="space-y-3">
            {DAYS.map((day) => {
              const dayHours = hours.find((h) => h.dayOfWeek === day.key)!;
              return (
                <div
                  key={day.key}
                  className="flex items-center justify-between gap-4 border-b pb-2"
                >
                  <span className="w-24 font-medium">{day.label}</span>
                  <TimePicker
                    onChange={(value) =>
                      handleTimeChange(day.key, "openTime", value)
                    }
                    value={dayHours.openTime}
                    disableClock
                    format="HH:mm"
                    clearIcon={null}
                    locale="fr-FR"
                  />
                  <span>-</span>
                  <TimePicker
                    onChange={(value) =>
                      handleTimeChange(day.key, "closeTime", value)
                    }
                    value={dayHours.closeTime}
                    disableClock
                    format="HH:mm"
                    clearIcon={null}
                    locale="fr-FR"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 bg-[#ebc334] text-white rounded hover:bg-[#dfca70] cursor-pointer"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
