import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle2, Sparkles } from "lucide-react";

import { useTasks } from "@/hooks/useTasks";
import type { TaskFilter, Task } from "@/types/task";

import { Button } from "@/components/ui/button";
import { StatsHeader } from "@/components/task/StatsHeader";
import { EmptyState } from "@/components/task/EmptyState";
import { SortableTaskItem } from "@/components/task/SortableTaskItem";
import { TaskForm } from "@/components/task/TaskForm";

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
    deleteTask,
    toggleTaskStatus,
    getStats,
    reorderTasks,
    updateTaskTitle,
    updateTask,
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
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  /* ---------------- TASK ACTIONS ---------------- */
  const handleDeleteTask = (id: string) => deleteTask(id);
  const handleToggleStatus = (id: string) => toggleTaskStatus(id);

  const clearFilters = () =>
    setFilter({
      status: "all",
      priority: "all",
      category: "",
      search: "",
    });

  /* ================= FORM HANDLERS ================= */

  const handleFormSubmit = (data: Omit<Task, "id" | "createdAt">) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      setEditingTask(null);
    } else {
      addTask(data);
    }
    setShowAddForm(false);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingTask(null);
  };

  /* ================================================= */

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

          <Button
            onClick={() => {
              setEditingTask(null);
              setShowAddForm(true);
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <StatsHeader stats={stats} />

        {/* ✅ FIXED TASK FORM */}
        <TaskForm
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={(data) => {
            addTask(data);
            setShowAddForm(false);
          }}
          categories={[]}
        />

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
                        onDelete={handleDeleteTask}
                        onEdit={(t) => {
                          setEditingTask(t);
                          setShowAddForm(true);
                        }}
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