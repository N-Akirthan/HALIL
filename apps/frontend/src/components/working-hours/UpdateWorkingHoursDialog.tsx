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
import { User } from "@/models/user.model";
import { SendWorkingHours } from "@/payload/request/send-working-hours";
import { updateUser } from "@/services/user.service";
import { useEffect, useState } from "react";
import TimePicker from "react-time-picker";

type Props = {
  user: User;
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

export default function UpdateWorkingHoursDialog({
  user,
  onHoursUpdated,
}: Props) {
  const [hours, setHours] = useState<SendWorkingHours[]>(
    DAYS.map((d) => ({ dayOfWeek: d.key, openTime: null, closeTime: null }))
  );

  // Initialisation à partir des horaires existants de l'utilisateur
  useEffect(() => {
    if (!user.workingHours) return;

    const newHours: SendWorkingHours[] = DAYS.map((day) => {
      const wh = user.workingHours?.find((h) => h.dayOfWeek === day.key);
      return {
        dayOfWeek: day.key,
        openTime: wh?.openTime ?? null,
        closeTime: wh?.closeTime ?? null,
      };
    });

    setHours(newHours);
  }, [user]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updatedHours: SendWorkingHours[] = hours.map((h) => {
        return {
          dayOfWeek: h.dayOfWeek,
          openTime: h.openTime,
          closeTime: h.closeTime,
        };
      });
      await updateUser(user.id, { ...user, workingHours: updatedHours });
      alert("Les horaires ont été modifiés avec succès.");
      onHoursUpdated();
    } catch (err) {
      if (err instanceof Error) alert("Erreur : " + err.message);
      else alert("Erreur inconnue lors de la mise à jour.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        className="flex items-center px-4 py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
        asChild
      >
        <span
          role="button"
          tabIndex={0}
          className="text-blue-600 text-sm cursor-pointer hover:underline"
        >
          Horaires de travail
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier les horaires de travail</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
