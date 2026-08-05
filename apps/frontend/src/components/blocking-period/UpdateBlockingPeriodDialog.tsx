"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BlockingPeriod } from "@/models/blocking-period.model";
import { Client } from "@/models/client.model";
import { updateBlockingPeriod } from "@/services/blocking-period.service";
import { getAllClients } from "@/services/client.service";
import { useEffect, useState } from "react";

type Props = {
  blockingPeriod: BlockingPeriod;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBlockingPeriodUpdated: () => void;
};

function formatDateToFr(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
}

function formatDateToIso(dateStr: string): string {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export default function UpdateBlockingPeriodDialog({
  blockingPeriod,
  open,
  onOpenChange,
  onBlockingPeriodUpdated,
}: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState<{
    startDateFr: string;
    endDateFr: string;
    cause: string;
    clientId: number | "";
  }>({
    startDateFr: "",
    endDateFr: "",
    cause: "",
    clientId: "",
  });

  useEffect(() => {
    getAllClients()
      .then(setClients)
      .catch(() => setClients([]));
  }, []);

  useEffect(() => {
    if (blockingPeriod) {
      setFormData({
        startDateFr: blockingPeriod.startDate
          ? formatDateToFr(blockingPeriod.startDate)
          : "",
        endDateFr: blockingPeriod.endDate
          ? formatDateToFr(blockingPeriod.endDate)
          : "",
        cause: blockingPeriod.cause || "",
        clientId: blockingPeriod.client ? blockingPeriod.client.id : "",
      });
    }
  }, [blockingPeriod]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "clientId") {
      setFormData((prev) => ({
        ...prev,
        clientId: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { startDateFr, endDateFr, cause, clientId } = formData;
    if (!startDateFr || !endDateFr || clientId === "") {
      alert("La date de début, la date de fin et le client sont obligatoires.");
      return;
    }

    const startDate = formatDateToIso(startDateFr);
    const endDate = formatDateToIso(endDateFr);

    if (!startDate || !endDate) {
      alert("Format de date invalide, veuillez utiliser jj/mm/aaaa.");
      return;
    }

    try {
      await updateBlockingPeriod(blockingPeriod.id, {
        startDate,
        endDate,
        cause: cause || undefined,
        client: { id: clientId },
      });
      onOpenChange(false);
      onBlockingPeriodUpdated();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Erreur : " + err.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier la période de blocage</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4" noValidate>
          <label className="block text-sm font-medium text-gray-700">
            Sélectionnez le client *
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded mt-1"
            >
              <option value="">-- Choisissez un client --</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Date de début *
            <input
              type="text"
              name="startDateFr"
              value={formData.startDateFr}
              onChange={handleChange}
              placeholder="jj/mm/aaaa"
              pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[0-9]{4}$"
              title="Format : jj/mm/aaaa"
              required
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Date de fin *
            <input
              type="text"
              name="endDateFr"
              value={formData.endDateFr}
              onChange={handleChange}
              placeholder="jj/mm/aaaa"
              pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[0-9]{4}$"
              title="Format : jj/mm/aaaa"
              required
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Cause (optionnel)
            <textarea
              name="cause"
              value={formData.cause}
              onChange={handleChange}
              placeholder="Entrez la cause"
              className="w-full border px-3 py-2 rounded resize-y mt-1"
              rows={3}
            />
          </label>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 bg-[#ebc334] text-white rounded hover:bg-[#dfca70] cursor-pointer"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
