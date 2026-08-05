"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SendBlockingPeriod } from "@/payload/request/send-blocking-period";
import { createBlockingPeriod } from "@/services/blocking-period.service";
import { getAllClients } from "@/services/client.service";
import { CalendarRange } from "lucide-react";
import { useEffect, useState } from "react";

type Client = {
  id: number;
  name: string;
};

type Props = {
  clientId?: number;
  onBlockingPeriodCreated: () => void;
};

type FormData = {
  startDate: string; // ISO
  endDate: string; // ISO
  startDateFr: string; // jj/mm/aaaa
  endDateFr: string; // jj/mm/aaaa
  cause: string;
  clientId?: number;
};

function formatDateToFr(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function formatDateToIso(dateStr: string): string {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export default function CreateBlockingPeriodDialog({
  clientId,
  onBlockingPeriodCreated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState<FormData>({
    startDate: "",
    endDate: "",
    startDateFr: "",
    endDateFr: "",
    cause: "",
    clientId,
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const allClients = await getAllClients();
        setClients(allClients);
      } catch {
        setClients([]);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      clientId,
      startDateFr: prev.startDate ? formatDateToFr(prev.startDate) : "",
      endDateFr: prev.endDate ? formatDateToFr(prev.endDate) : "",
    }));
  }, [clientId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "startDateFr") {
      setFormData((prev) => ({
        ...prev,
        startDateFr: value,
        startDate: formatDateToIso(value),
      }));
    } else if (name === "endDateFr") {
      setFormData((prev) => ({
        ...prev,
        endDateFr: value,
        endDate: formatDateToIso(value),
      }));
    } else if (name === "clientId") {
      setFormData((prev) => ({
        ...prev,
        clientId: value === "" ? undefined : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { startDate, endDate, clientId } = formData;

    if (!startDate || !endDate || !clientId) {
      alert("Les dates et le client sont obligatoires.");
      return;
    }

    try {
      const payload: SendBlockingPeriod = {
        startDate,
        endDate,
        cause: formData.cause || undefined,
        client: { id: clientId },
      };

      await createBlockingPeriod(payload);

      setFormData({
        startDate: "",
        endDate: "",
        startDateFr: "",
        endDateFr: "",
        cause: "",
        clientId,
      });

      setOpen(false);
      onBlockingPeriodCreated();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Erreur : " + err.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center text-sm font-medium px-4 py-2 hover:text-[#dfca70] cursor-pointer">
          <CalendarRange />
          Nouvelle période de blocage
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une période de blocage</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4" noValidate>
          {!clientId && (
            <label className="block text-sm font-medium text-gray-700">
              Sélectionnez le client *
              <select
                name="clientId"
                value={formData.clientId ?? ""}
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
          )}

          {clientId && (
            <p className="text-sm font-medium text-gray-700">
              Client sélectionné :{" "}
              <span className="font-semibold">
                {clients.find((c) => c.id === clientId)?.name ?? "Inconnu"}
              </span>
            </p>
          )}

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
            Cause
            <textarea
              name="cause"
              value={formData.cause}
              onChange={handleChange}
              placeholder="Entrez la cause (optionnel)"
              className="w-full border px-3 py-2 rounded resize-y mt-1"
              rows={3}
            />
          </label>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 bg-[#ebc334] text-white rounded hover:bg-[#dfca70] cursor-pointer"
            >
              Créer la période de blocage
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
