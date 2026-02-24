import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle2, Sparkles } from "lucide-react";

import { useTasks } from "@/hooks/useTasks";
import type { TaskFilter } from "@/types/task";

import { Button } from "@/components/ui/button";
import { StatsHeader } from "@/components/task/StatsHeader";
import { EmptyState } from "@/components/task/EmptyState";
import { SortableTaskItem } from "@/components/task/SortableTaskItem";

import "./App.css";

/* 🔥 DND IMPORTS */
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

function App() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getStats,
    reorderTasks,
    updateTaskTitle,
  } = useTasks();

  /* ---------------- FILTER STATE ---------------- */
  const [filter, setFilter] = useState<TaskFilter>({
    status: "all",
    priority: "all",
    category: "",
    search: "",
  });

  /* ---------------- UI STATE ---------------- */
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  /* ---------------- FORM STATE ---------------- */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] =
    useState<"low" | "medium" | "high">("medium");
  const [status, setStatus] =
    useState<"todo" | "in-progress" | "done">("todo");
  const [dueDate, setDueDate] = useState("");

  const stats = getStats();

  /* ---------------- FILTERED TASKS ---------------- */
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter.status !== "all" && task.status !== filter.status)
        return false;

      if (filter.priority !== "all" && task.priority !== filter.priority)
        return false;

      if (filter.search) {
        const s = filter.search.toLowerCase();
        if (
          !task.title.toLowerCase().includes(s) &&
          !task.description.toLowerCase().includes(s)
        )
          return false;
      }

      return true;
    });
  }, [tasks, filter]);

  /* ---------------- DRAG HANDLER ---------------- */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newTasks = arrayMove(tasks, oldIndex, newIndex);
    reorderTasks(newTasks);
  };

  /* ---------------- HELPERS ---------------- */
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("todo");
    setDueDate(
      new Date(Date.now() + 86400000)
        .toISOString()
        .split("T")[0]
    );
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingTask(null);
    resetForm();
  };

  /* ---------------- ADD ---------------- */
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate:
        dueDate ||
        new Date(Date.now() + 86400000)
          .toISOString()
          .split("T")[0],
      category: "",
    });

    cancelForm();
  };

  /* ---------------- EDIT ---------------- */
  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !title.trim()) return;

    updateTask(editingTask.id, {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate: dueDate || editingTask.dueDate,
    });

    cancelForm();
  };

  const startEdit = (task: any) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setStatus(task.status);
    setDueDate(task.dueDate);
  };

  const handleDeleteTask = (id: string) => deleteTask(id);
  const handleToggleStatus = (id: string) => toggleTaskStatus(id);

  const clearFilters = () =>
    setFilter({
      status: "all",
      priority: "all",
      category: "",
      search: "",
    });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white p-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Task Manager
            </h1>
          </div>

          {!showAddForm && !editingTask && (
            <Button
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <StatsHeader stats={stats} />

        {!showAddForm && !editingTask && (
          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Tasks ({filteredTasks.length})
            </h2>

            <AnimatePresence mode="popLayout">
              {filteredTasks.length > 0 ? (
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={filteredTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <motion.div layout className="grid gap-3">
                      {filteredTasks.map((task) => (
                        <SortableTaskItem
                          key={task.id}
                          task={task}
                          onToggle={handleToggleStatus}
                          onEdit={startEdit}
                          onDelete={handleDeleteTask}
                          updateTaskTitle={updateTaskTitle}
                        />
                      ))}
                    </motion.div>
                  </SortableContext>
                </DndContext>
              ) : tasks.length === 0 ? (
                <EmptyState
                  type="no-tasks"
                  onCreateClick={() => setShowAddForm(true)}
                />
              ) : (
                <EmptyState
                  type="no-results"
                  onClearFilters={clearFilters}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 mt-16">
        <div className="max-w-5xl mx-auto py-6 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          Built with React + TypeScript + Tailwind
        </div>
      </footer>
    </div>
  );
}

export default App;