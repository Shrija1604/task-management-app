import React from "react";
import PomodoroTimer from "./PomodoroTimer";
import TaskNotes from "./TaskNotes";
import TaskAttachments from "./TaskAttachments";
import { Calendar, AlertTriangle, Edit2, Trash2 } from "lucide-react";
import { updateTask } from "../services/taskService";

const TaskCard = ({ task, onDelete, onEdit }) => {
  const priorityStyles = {
    Urgent: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-900",
    High: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border-orange-200 dark:border-orange-900",
    Medium: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    Low: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-900",
  };

  const statusColors = {
    "To Do": "bg-slate-300 dark:bg-slate-600",
    "In Progress": "bg-indigo-500",
    "Done": "bg-emerald-500",
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Done";
  
  let daysLeftText = "";
  if (task.dueDate && !isOverdue && task.status !== "Done") {
    const diffTime = Math.abs(new Date(task.dueDate) - new Date());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) daysLeftText = "Due today";
    else if (diffDays === 1) daysLeftText = "1 day left";
    else daysLeftText = `${diffDays} days left`;
  }

  const handlePomodoroComplete = async (taskId) => {
    try {
      const currentSessions = task.pomodoroSessions || 0;
      await updateTask(taskId, { ...task, pomodoroSessions: currentSessions + 1 });
    } catch (error) {
      console.error("Failed to update pomodoro sessions", error);
    }
  };

  return (
    <div className={`relative flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-slate-800 ${isOverdue ? 'border-red-300 dark:border-red-800' : 'border-slate-200 dark:border-slate-700'}`}>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${priorityStyles[task.priority] || priorityStyles.Medium}`}>
              {task.priority}
            </span>
            {isOverdue && (
              <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-red-500">
                <AlertTriangle className="h-3 w-3" /> Overdue
              </span>
            )}
            {daysLeftText && (
              <span className="text-xs font-semibold text-amber-500">
                {daysLeftText}
              </span>
            )}
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <button 
                onClick={() => onEdit(task)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-500 dark:hover:bg-slate-700"
                title="Edit Task"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
            <button 
              onClick={() => onDelete(task._id)}
              className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30"
              title="Delete Task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">{task.title}</h3>
        <p className="mb-4 line-clamp-3 min-h-[3rem] text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {task.description || "No description provided."}
        </p>
      </div>

      <div>
        {task.status !== "Done" && (
          <PomodoroTimer task={task} onCompleteSession={handlePomodoroComplete} />
        )}

        <TaskNotes taskId={task._id} />
        <TaskAttachments taskId={task._id} />

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${statusColors[task.status] || statusColors["To Do"]}`}></div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{task.status}</span>
          </div>
          
          <div className="flex items-center gap-3">
            {task.pomodoroSessions > 0 && (
              <span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                🍅 {task.pomodoroSessions}
              </span>
            )}
            {task.dueDate && (
              <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                <Calendar className="h-3.5 w-3.5" />
                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                {task.dueTime && ` at ${task.dueTime}`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TaskCard);