"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Appointment } from "@/models/appointment.model";
import { deleteAppointment } from "@/services/appointment.service";
import { useState } from "react";

type Props = {
  appointment: Appointment;
  onAppointmentUpdated: () => void;
};

export default function MarkAsDoneDialogAppointment({
  appointment,
  onAppointmentUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await deleteAppointment(appointment.id);
      onAppointmentUpdated();
    } catch (error) {
      alert("Erreur : " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-center">
          <Checkbox checked={false} />{" "}
          {/* on ne gère pas de "done", juste la suppression */}
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marquer comme terminé et supprimer ?</DialogTitle>
        </DialogHeader>

        <p>
          Voulez-vous marquer comme terminé et supprimer ce rendez-vous du{" "}
          {new Date(appointment.date).toLocaleDateString("fr-FR")} pour{" "}
          {appointment.client?.name} ? Cette action est définitive.
        </p>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Non</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleConfirm} disabled={loading}>
              Oui
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
