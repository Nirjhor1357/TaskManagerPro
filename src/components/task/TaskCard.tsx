import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

import {
  Calendar,
  Tag,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  ArrowRightCircle,
  Trash2,
  Edit3,
  Save,
  X,
} from "lucide-react";

import { format, parseISO, isPast, isToday, isTomorrow } from "date-fns";
import type { Task, TaskStatus, TaskPriority } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  updateTaskTitle: (id: string, title: string) => void;
}

/* ---------------- STATUS CONFIG ---------------- */
const statusConfig: Record<
  TaskStatus,
  { label: string; icon: React.ReactNode; color: string }
> = {
  todo: {
    label: "To Do",
    icon: <Circle className="w-4 h-4" />,
    color: "bg-slate-100 text-slate-600 border-slate-200",
  },
  "in-progress": {
    label: "In Progress",
    icon: <ArrowRightCircle className="w-4 h-4" />,
    color: "bg-blue-100 text-blue-600 border-blue-200",
  },
  done: {
    label: "Done",
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "bg-emerald-100 text-emerald-600 border-emerald-200",
  },
};

/* ---------------- PRIORITY CONFIG ---------------- */
const priorityConfig: Record<
  TaskPriority,
  { label: string; color: string; dot: string }
> = {
  low: {
    label: "Low",
    color: "bg-slate-50 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
  medium: {
    label: "Medium",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    dot: "bg-amber-500",
  },
  high: {
    label: "High",
    color: "bg-rose-50 text-rose-600 border-rose-200",
    dot: "bg-rose-500",
  },
};

/* ---------------- DUE DATE LOGIC ---------------- */
const getDueDateDisplay = (dueDate: string) => {
  try {
    const date = parseISO(dueDate);

    if (isPast(date) && !isToday(date)) {
      return {
        text: format(date, "MMM d"),
        color: "text-rose-600",
        badge: "border-rose-200 bg-rose-50",
        urgency: "overdue",
      };
    }

    if (isToday(date)) {
      return {
        text: "Today",
        color: "text-amber-600",
        badge: "border-amber-200 bg-amber-50",
        urgency: "today",
      };
    }

    if (isTomorrow(date)) {
      return {
        text: "Tomorrow",
        color: "text-blue-600",
        badge: "border-blue-200 bg-blue-50",
        urgency: "tomorrow",
      };
    }

    return {
      text: format(date, "MMM d"),
      color: "text-slate-500",
      badge: "border-slate-200 bg-slate-50",
      urgency: "normal",
    };
  } catch {
    return {
      text: "Invalid",
      color: "text-slate-400",
      badge: "border-slate-200 bg-slate-50",
      urgency: "normal",
    };
  }
};

export const TaskCard = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  updateTaskTitle,
}: TaskCardProps) => {
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const dueDate = getDueDateDisplay(task.dueDate);
  const isDone = task.status === "done";

  /* ---------------- CONFETTI CONTROL ---------------- */
  const prevStatusRef = useRef(task.status);

  useEffect(() => {
    if (prevStatusRef.current !== "done" && task.status === "done") {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 },
      });
    }
    prevStatusRef.current = task.status;
  }, [task.status]);

  /* ---------------- INLINE EDIT ---------------- */
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleSave = () => {
    const trimmed = editTitle.trim();
    if (!trimmed) return;
    updateTaskTitle(task.id, trimmed);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isDone ? 1.01 : 1,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`
        group relative bg-white rounded-xl border-2 p-4
        transition-all duration-200
        ${
          isDone
            ? "border-slate-200 bg-slate-50/50 ring-1 ring-emerald-200"
            : "border-slate-100 hover:border-slate-200"
        }
        ${dueDate.urgency === "overdue" ? "ring-1 ring-rose-200" : ""}
        hover:shadow-lg hover:shadow-slate-200/50
      `}
    >
      {/* Priority Strip */}
      <div
        className={`absolute left-0 top-4 bottom-4 w-1 rounded-full ${
          task.priority === "high"
            ? "bg-rose-500"
            : task.priority === "medium"
            ? "bg-amber-500"
            : "bg-slate-300"
        }`}
      />

      <div className="pl-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-2 py-1 rounded border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <h3
                className={`font-semibold text-slate-900 truncate pr-2 ${
                  isDone ? "line-through text-slate-500" : ""
                }`}
              >
                {task.title}
              </h3>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <Button size="icon" variant="ghost" onClick={handleSave}>
                  <Save className="w-4 h-4 text-emerald-600" />
                </Button>
                <Button size="icon" variant="ghost" onClick={handleCancel}>
                  <X className="w-4 h-4 text-rose-500" />
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Quick Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Full Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => onDelete(task.id)}
                    className="text-rose-600 focus:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p
            className={`text-sm mb-3 line-clamp-2 ${
              isDone ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onToggle(task.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 ${status.color}`}
            >
              {status.icon}
              {status.label}
            </button>

            <Badge variant="outline" className={`${priority.color} text-xs`}>
              <span
                className={`w-1.5 h-1.5 rounded-full ${priority.dot} mr-1.5`}
              />
              {priority.label}
            </Badge>

            {task.category && (
              <Badge variant="secondary" className="text-xs bg-slate-100">
                <Tag className="w-3 h-3 mr-1" />
                {task.category}
              </Badge>
            )}
          </div>

          {/* Due Date */}
          <div
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${dueDate.color} ${dueDate.badge}`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-medium">{dueDate.text}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};