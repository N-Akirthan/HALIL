"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Appointment } from "@/models/appointment.model";
import { Client } from "@/models/client.model";
import { updateAppointment } from "@/services/appointment.service";
import { getAllClients } from "@/services/client.service";
import { useEffect, useState } from "react";
import TimePicker from "react-time-picker";

type Props = {
  appointment: Appointment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAppointmentUpdated: () => void;
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

export default function UpdateAppointmentDialog({
  appointment,
  open,
  onOpenChange,
  onAppointmentUpdated,
}: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState<{
    title: string;
    done: boolean;
    note: string;
    date: string;
    dateFr: string;
    startTime: string;
    endTime: string;
    clientId: number;
  }>({
    title: "",
    done: false,
    note: "",
    date: "",
    dateFr: "",
    startTime: "",
    endTime: "",
    clientId: 0,
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
    if (appointment) {
      setFormData({
        title: appointment.title || "",
        done: appointment.done || false,
        note: appointment.note || "",
        date: appointment.date || "",
        dateFr: appointment.date ? formatDateToFr(appointment.date) : "",
        startTime: appointment.startTime.slice(0, 5) || "",
        endTime: appointment.endTime.slice(0, 5) || "",
        clientId: appointment.client.id,
      });
    }
  }, [appointment]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "dateFr") {
      setFormData((prev) => ({
        ...prev,
        dateFr: value,
        date: formatDateToIso(value),
      }));
    } else if (name === "clientId") {
      setFormData((prev) => ({
        ...prev,
        clientId: Number(value),
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

    const { date, startTime, endTime, clientId, note, title, done } = formData;

    if (!date || !startTime || !endTime || !clientId) {
      alert(
        "La date, l'heure de début, l'heure de fin et le client sont obligatoires."
      );
      return;
    }

    try {
      await updateAppointment(appointment.id, {
        id: appointment.id,
        title,
        done,
        note,
        date,
        startTime: startTime + ":00",
        endTime: endTime + ":00",
        client: clients.find((c) => c.id === clientId)!,
      });
      onOpenChange(false);
      onAppointmentUpdated();
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
          <DialogTitle>Modifier le rendez-vous</DialogTitle>
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
            Objet *
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded resize-y mt-1"
              required
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Date *
            <input
              type="text"
              name="dateFr"
              value={formData.dateFr}
              onChange={handleChange}
              placeholder="jj/mm/aaaa"
              pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[0-9]{4}$"
              title="Format : jj/mm/aaaa"
              required
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </label>

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <span>Heure de début *</span>
            <TimePicker
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, startTime: value ?? "" }))
              }
              value={formData.startTime}
              disableClock={true}
              format="HH:mm"
              clearIcon={null}
              locale="fr-FR"
            />
          </label>

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <span>Heure de fin *</span>
            <TimePicker
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, endTime: value ?? "" }))
              }
              value={formData.endTime}
              disableClock={true}
              format="HH:mm"
              clearIcon={null}
              locale="fr-FR"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Note
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Entrez une note (optionnel)"
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
