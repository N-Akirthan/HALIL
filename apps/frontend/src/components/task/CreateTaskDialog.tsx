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
import { getAllClients } from "@/services/client.service";
import { createTask } from "@/services/task.service";
import { ClipboardPlus } from "lucide-react";
import { useEffect, useState } from "react";
import TimePicker from "react-time-picker";

import type { SendTask } from "@/payload/request/send-task";

type Client = {
  id: number;
  name: string;
};

type Props = {
  clientId?: number;
  onTaskCreated: () => void;
};

type FormData = {
  title: string;
  note: string;
  date: string; // ISO "YYYY-MM-DD"
  dateFr: string; // "dd/mm/yyyy"
  hour: string; // "HH:mm"
  done: boolean;
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

export default function CreateTaskDialog({ clientId, onTaskCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const today = new Date();
  const isoToday = today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const frToday = `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;
  const [formData, setFormData] = useState<FormData>({
    title: "",
    note: "",
    date: isoToday,
    dateFr: frToday,
    hour: "",
    done: false,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center text-sm font-medium px-4 py-2 hover:text-[#dfca70] cursor-pointer">
          <ClipboardPlus />
          Nouvelle tâche
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une tâche</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const { title, date, hour, clientId, note, done } = formData;

            if (!date || !hour || !clientId) {
              alert("La date, l'heure et le client sont obligatoires.");
              return;
            }

            const payload: SendTask = {
              title,
              note,
              date,
              hour: hour + ":00", // ajout des secondes pour respecter "hh:mm:ss"
              done,
              client: { id: clientId },
            };

            try {
              await createTask(payload);
              setFormData({
                title: "",
                note: "",
                date: "",
                dateFr: "",
                hour: "",
                done: false,
                clientId,
              });
              setOpen(false);
              onTaskCreated();
            } catch (err: unknown) {
              if (err instanceof Error) {
                alert("Erreur : " + err.message);
              }
            }
          }}
          className="space-y-4 mt-4"
          noValidate
        >
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
            <span>Heure *</span>
            <TimePicker
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, hour: value ?? "" }))
              }
              value={formData.hour}
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
              Créer la tâche
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
