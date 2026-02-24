import { useState } from "react";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const getDefaultDueDate = () =>
  new Date(Date.now() + 86400000).toISOString().split("T")[0];

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void; // ✅ unified name (IMPORTANT)
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void;
  editTask?: Task | null;
  categories?: string[];
}

export const TaskForm = ({
  isOpen,
  onClose,
  onSubmit,
  editTask,
  categories = [],
}: TaskFormProps) => {
  /* ---------------- STATE ---------------- */
  const [title, setTitle] = useState(editTask?.title ?? "");
  const [description, setDescription] = useState(
    editTask?.description ?? ""
  );
  const [priority, setPriority] = useState<TaskPriority>(
    editTask?.priority ?? "medium"
  );
  const [status, setStatus] = useState<TaskStatus>(
    editTask?.status ?? "todo"
  );
  const [dueDate, setDueDate] = useState(
    () => editTask?.dueDate ?? getDefaultDueDate()
  );
  const [category, setCategory] = useState(editTask?.category ?? "");

  const isEditing = !!editTask;

  /* ---------------- HELPERS ---------------- */
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("todo");
    setDueDate(getDefaultDueDate());
    setCategory("");
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate,
      category,
    });

    if (!isEditing) resetForm();
    onClose(); // ✅ close after submit
  };

  /* ---------------- GUARD ---------------- */
  if (!isOpen) return null;

  /* ================================================= */
  /* ===================== UI ======================== */
  /* ================================================= */

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose} // ✅ click outside closes
    >
      <div
        className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()} // ✅ prevent inner click close
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            {isEditing ? "Edit Task" : "Create New Task"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="h-11"
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details..."
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* Priority + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as TaskPriority)
                  }
                  className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as TaskStatus)
                  }
                  className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            {/* Due Date + Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white"
                >
                  <option value="">No Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-11 px-6"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={!title.trim()}
                className="h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white"
              >
                {isEditing ? "Save Changes" : "Create Task"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
