import { Task } from "@/models/task.model";
import { columns } from "./columns";
import { DataTable } from "./data-table";

type Props = {
  tasks: Task[];
  onTasksChange: (updatedTask?: Task) => void; // ⬅️ accepte un param optionnel
};

export default function TaskTable({ tasks, onTasksChange }: Props) {
  return (
    <div className="px-2">
      <DataTable columns={columns(onTasksChange)} data={tasks} />
    </div>
  );
}
