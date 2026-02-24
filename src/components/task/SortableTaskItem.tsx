import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { TaskCard } from "./TaskCard";
import type { Task } from "@/types/task";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  updateTaskTitle: (id: string, title: string) => void;
}

export const SortableTaskItem = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  updateTaskTitle,
}: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* ✅ DRAG HANDLE (ONLY THIS IS DRAGGABLE) */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* ✅ CARD (fully clickable now) */}
      <TaskCard
        task={task}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
        updateTaskTitle={updateTaskTitle}
      />
    </div>
  );
};