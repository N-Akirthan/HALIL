"use client";

import "react-clock/dist/Clock.css";
import "react-time-picker/dist/TimePicker.css";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Task } from "@/models/task.model";
import { SendTask } from "@/payload/request/send-task";
import { getAllClients } from "@/services/client.service";
import { updateTask } from "@/services/task.service";
import { useEffect, useState } from "react";
import TimePicker from "react-time-picker";

type Client = {
  id: number;
  name: string;
};

type Props = {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdated: () => void;
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

export default function UpdateTaskDialog({
  task,
  open,
  onOpenChange,
  onTaskUpdated,
}: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    note: "",
    date: "",
    dateFr: "",
    hour: "",
    done: false,
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
    if (open) {
      setFormData({
        title: task.title || "",
        note: task.note || "",
        date: task.date || "",
        dateFr: task.date ? formatDateToFr(task.date) : "",
        hour: task.hour ? task.hour.substring(0, 5) : "",
        done: task.done || false,
        clientId: task.client?.id || 0, // <-- ici on prend bien task.client.id
      });
    }
  }, [task, open]);

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

    const { title, date, hour, clientId, note, done } = formData;

    if (!date || !hour || !clientId) {
      alert("La date, l'heure et le client sont obligatoires.");
      return;
    }

    const sendData: SendTask = {
      title,
      note,
      date,
      hour: hour + ":00", // format hh:mm:ss
      done,
      client: { id: clientId }, // <-- objet client avec id ici
    };

    try {
      await updateTask(task.id, sendData);
      onOpenChange(false);
      onTaskUpdated();
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
          <DialogTitle>Modifier la tâche</DialogTitle>
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
            Objet
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded resize-y mt-1"
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
              Mettre à jour
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
