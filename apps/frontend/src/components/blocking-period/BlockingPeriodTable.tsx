"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { BlockingPeriod } from "@/models/blocking-period.model";
import { deleteBlockingPeriod } from "@/services/blocking-period.service";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { DataTable } from "../client/data-table";
import UpdateBlockingPeriodDialog from "./UpdateBlockingPeriodDialog";

type Props = {
  blockingPeriods: BlockingPeriod[];
  onBlockingPeriodUpdated: () => void;
};

function ActionsCell({
  blockingPeriod,
  onBlockingPeriodUpdated,
}: {
  blockingPeriod: BlockingPeriod;
  onBlockingPeriodUpdated: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer cette période de blocage "${blockingPeriod.cause}" ?`
    );
    if (!confirmed) return;

    try {
      await deleteBlockingPeriod(blockingPeriod.id);
      onBlockingPeriodUpdated();
    } catch (error) {
      if (error instanceof Error) {
        alert("Erreur : " + error.message);
      }
    }
  };

  return (
    <>
      <UpdateBlockingPeriodDialog
        blockingPeriod={blockingPeriod}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onBlockingPeriodUpdated={onBlockingPeriodUpdated}
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
  onBlockingPeriodUpdated: () => void
): ColumnDef<BlockingPeriod>[] => [
  {
    id: "client",
    header: "Client",
    cell: ({ row }) => {
      const clientName = row.original.client?.name;
      return clientName;
    },
  },
  {
    accessorKey: "startTime",
    header: "Début",
    cell: ({ getValue }) => (getValue() as string).slice(0, 5),
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
        blockingPeriod={row.original}
        onBlockingPeriodUpdated={onBlockingPeriodUpdated}
      />
    ),
  },
];

export default function BlockingPeriodTable({
  blockingPeriods,
  onBlockingPeriodUpdated,
}: Props) {
  return (
    <div className="px-2">
      <DataTable
        columns={columns(onBlockingPeriodUpdated)}
        data={blockingPeriods}
      />
    </div>
  );
}
