import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/models/task.model";
import { deleteTask } from "@/services/task.service";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import MarkAsDoneDialog from "./MarkAsDoneDialog";
import UpdateTaskDialog from "./UpdateTaskDialog";

export function ActionsCell({
  task,
  onTasksChange,
}: {
  task: Task;
  onTasksChange: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Appelle fetchTasks après update ou suppression
  const handleDelete = async () => {
    if (!window.confirm(`Voulez-vous vraiment supprimer cette tâche ?`)) return;
    try {
      await deleteTask(task.id);
      onTasksChange();
    } catch (error) {
      alert(`Erreur: ${(error as Error).message}`);
    }
  };

  return (
    <>
      <UpdateTaskDialog
        task={task}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onTaskUpdated={() => {
          setIsDialogOpen(false);
          onTasksChange();
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export const columns = (
  onTasksChange: (updatedTask?: Task) => void
): ColumnDef<Task>[] => [
  {
    id: "markAsDone",
    header: "",
    cell: ({ row }) => {
      const task = row.original;
      return (
        <MarkAsDoneDialog
          task={task}
          onTaskUpdated={(updatedTask) => {
            onTasksChange(updatedTask); // met à jour le state directement
          }}
        />
      );
    },
  },
  {
    accessorFn: (row) => row.client?.name ?? "N/A",
    id: "client",
    header: "Client",
    cell: ({ getValue }) => getValue() ?? "",
  },
  {
    accessorKey: "title",
    header: "Objet",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => {
      const dateStr = getValue() as string;
      if (!dateStr) return "";
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    },
  },
  {
    accessorKey: "hour",
    header: "Heure",
    cell: ({ getValue }) => {
      const hourStr = getValue() as string;
      return hourStr ? hourStr.substring(0, 5) : "";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <ActionsCell task={row.original} onTasksChange={onTasksChange} />
    ),
  },
];
