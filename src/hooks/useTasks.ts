import { useState, useEffect, useCallback } from "react";
import type { Task, TaskStatus } from "../types/task";

const STORAGE_KEY = "task-manager-data";

/* ---------------- ID GENERATOR ---------------- */
const generateId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 11);

/* ---------------- SAFE INITIAL LOAD ---------------- */
const getInitialTasks = (): Task[] => {
  try {
    // 🔒 SSR safety
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Task[];
  } catch (err) {
    console.error("Failed to parse saved tasks:", err);
  }

  /* ---------- fallback demo data ---------- */
  return [
    {
      id: generateId(),
      title: "Welcome to Task Manager",
      description:
        "This is a sample task to get you started. Try editing or completing it!",
      status: "todo",
      priority: "medium",
      dueDate: new Date(Date.now() + 86400000)
        .toISOString()
        .split("T")[0],
      category: "Getting Started",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      title: "Explore Features",
      description:
        "Check out the filters, search, and progress tracking features.",
      status: "in-progress",
      priority: "high",
      dueDate: new Date(Date.now() + 172800000)
        .toISOString()
        .split("T")[0],
      category: "Getting Started",
      createdAt: new Date().toISOString(),
    },
  ];
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks);

  /* ---------------- PERSIST ---------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  /* ---------------- ADD ---------------- */
  const addTask = useCallback(
    (taskData: Omit<Task, "id" | "createdAt">) => {
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };

      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    },
    []
  );

  /* ---------------- GENERIC UPDATE ---------------- */
  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        )
      );
    },
    []
  );

  /* ---------------- TITLE UPDATE (INLINE EDIT) ---------------- */
  const updateTaskTitle = useCallback((id: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, title: trimmed } : task
      )
    );
  }, []);

  /* 🔥 NEW — REORDER TASKS (for drag & drop) */
  const reorderTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
  }, []);

  /* ---------------- DELETE ---------------- */
  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  /* ---------------- TOGGLE STATUS ---------------- */
  const toggleTaskStatus = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        const statusOrder: TaskStatus[] = [
          "todo",
          "in-progress",
          "done",
        ];

        const currentIndex = statusOrder.indexOf(task.status);
        const nextStatus =
          statusOrder[(currentIndex + 1) % statusOrder.length];

        return { ...task, status: nextStatus };
      })
    );
  }, []);

  /* ---------------- STATS ---------------- */
  const getStats = useCallback(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const inProgress = tasks.filter(
      (t) => t.status === "in-progress"
    ).length;
    const done = tasks.filter((t) => t.status === "done").length;

    const completionRate =
      total > 0 ? Math.round((done / total) * 100) : 0;

    const highPriority = tasks.filter(
      (t) => t.priority === "high" && t.status !== "done"
    ).length;

    return {
      total,
      todo,
      inProgress,
      done,
      completionRate,
      highPriority,
    };
  }, [tasks]);

  /* ---------------- CATEGORIES ---------------- */
  const getCategories = useCallback(() => {
    const categories = new Set(tasks.map((t) => t.category));
    return Array.from(categories).filter(Boolean);
  }, [tasks]);

  /* ---------------- PUBLIC API ---------------- */
  return {
    tasks,
    addTask,
    updateTask,
    updateTaskTitle,
    reorderTasks, // ⭐ REQUIRED FOR DRAG & DROP
    deleteTask,
    toggleTaskStatus,
    getStats,
    getCategories,
  };
};