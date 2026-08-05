"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Appointment } from "@/models/appointment.model";
import { deleteAppointment } from "@/services/appointment.service";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { DataTable } from "./data-table";
import MarkAsDoneDialogAppointment from "./MarkAsDoneDialogAppointment";
import UpdateAppointmentDialog from "./UpdateAppointmentDialog";

type Props = {
  appointments: Appointment[];
  onAppointmentUpdated: () => void;
};

function ActionsCell({
  appointment,
  onAppointmentUpdated,
}: {
  appointment: Appointment;
  onAppointmentUpdated: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer ce rendez-vous "${appointment.note}" ?`
    );
    if (!confirmed) return;

    try {
      await deleteAppointment(appointment.id);
      onAppointmentUpdated();
    } catch (error) {
      if (error instanceof Error) {
        alert("Erreur : " + error.message);
      }
    }
  };

  return (
    <>
      <UpdateAppointmentDialog
        appointment={appointment}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAppointmentUpdated={onAppointmentUpdated}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            Modifier
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleDelete}>Supprimer</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

const columns = (
  onAppointmentUpdated: () => void
): ColumnDef<Appointment>[] => [
  {
    id: "markAsDone",
    header: "",
    cell: ({ row }) => (
      <MarkAsDoneDialogAppointment
        appointment={row.original}
        onAppointmentUpdated={onAppointmentUpdated}
      />
    ),
  },
  {
    id: "client",
    header: "Client",
    cell: ({ row }) => row.original.client.name,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => {
      const dateStr = getValue() as string;
      const date = new Date(dateStr);
      return date.toLocaleDateString("fr-FR");
    },
  },
  {
    accessorKey: "startTime",
    header: "Début",
    cell: ({ getValue }) => (getValue() as string).slice(0, 5), // hh:mm
  },
  {
    accessorKey: "endTime",
    header: "Fin",
    cell: ({ getValue }) => (getValue() as string).slice(0, 5),
  },
  {
    accessorKey: "note",
    header: "Note",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <ActionsCell
        appointment={row.original}
        onAppointmentUpdated={onAppointmentUpdated}
      />
    ),
  },
];

export default function AppointmentTable({
  appointments,
  onAppointmentUpdated,
}: Props) {
  return (
    <div className="px-2">
      <DataTable columns={columns(onAppointmentUpdated)} data={appointments} />
    </div>
  );
}
