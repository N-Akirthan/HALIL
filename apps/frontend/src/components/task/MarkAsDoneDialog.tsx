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
import { Task } from "@/models/task.model";
import { deleteTask } from "@/services/task.service"; // ⬅️ plus que deleteTask
import { useState } from "react";

type Props = {
  task: Task;
  onTaskUpdated: (updated?: Task) => void; // ⬅️ updated devient optionnel
};

export default function MarkAsDoneDialog({ task, onTaskUpdated }: Props) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await deleteTask(task.id); // ⬅️ suppression directe
      onTaskUpdated(); // ⬅️ pas d’argument → le parent fera fetch
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
          <Checkbox checked={!!task.done} />
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marquer comme achevée et supprimer ?</DialogTitle>
        </DialogHeader>

        <p>
          Voulez-vous achever et supprimer la tâche « {task.title} » du client{" "}
          {task.client?.name} ? Cette action est définitive.
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
