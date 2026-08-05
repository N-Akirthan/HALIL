"use client";

import "react-clock/dist/Clock.css";
import "react-time-picker/dist/TimePicker.css";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createAppointment } from "@/services/appointment.service";
import { getAllClients } from "@/services/client.service";
import { CalendarPlus } from "lucide-react";
import { useEffect, useState } from "react";
import TimePicker from "react-time-picker";

type Client = {
  id: number;
  name: string;
};

type Props = {
  clientId?: number;
  onAppointmentCreated: () => void;
};

type FormData = {
  title: string;
  done: boolean;
  note: string;
  date: string; // ISO "YYYY-MM-DD"
  dateFr: string; // "dd/mm/yyyy"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
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

export default function CreateAppointmentDialog({
  clientId,
  onAppointmentCreated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    done: false,
    note: "",
    date: "",
    dateFr: "",
    startTime: "",
    endTime: "",
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
      dateFr: prev.date ? formatDateToFr(prev.date) : "",
    }));
  }, [clientId]);

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

    const { date, startTime, endTime, clientId } = formData;

    if (!date || !startTime || !endTime || !clientId) {
      alert(
        "La date, l'heure de début, l'heure de fin et le client sont obligatoires."
      );
      return;
    }

    try {
      await createAppointment({
        title: formData.title,
        done: formData.done,
        note: formData.note,
        date,
        startTime: startTime + ":00",
        endTime: endTime + ":00",
        client: { id: clientId }, // important d’envoyer client comme objet avec id
      });
      setFormData({
        title: "",
        done: false,
        note: "",
        date: "",
        dateFr: "",
        startTime: "",
        endTime: "",
        clientId,
      });
      setOpen(false);
      onAppointmentCreated();
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
          <CalendarPlus />
          Nouveau rendez-vous
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un rendez-vous</DialogTitle>
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
              required
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
              required
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
              Créer le rendez-vous
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
