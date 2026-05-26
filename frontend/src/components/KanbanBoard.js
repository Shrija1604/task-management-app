import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, Edit2, Trash2 } from "lucide-react";

const SortableTaskItem = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id, data: { type: "Task", task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const priorityStyles = {
    Urgent: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-900",
    High: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border-orange-200 dark:border-orange-900",
    Medium: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    Low: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-900",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative mb-3 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm cursor-grab active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800 ${isDragging ? 'ring-2 ring-indigo-500' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100">{task.title}</h4>
        <div className="flex gap-1" onPointerDown={(e) => e.stopPropagation()}>
          <button onClick={() => onEdit(task)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-indigo-500 dark:hover:bg-slate-700">
            <Edit2 className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(task._id)} className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {task.description && (
        <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
          {task.description}
        </p>
      )}
      <div className="mt-2 flex items-center justify-between">
        <span className={`rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${priorityStyles[task.priority] || priorityStyles.Medium}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Clock className="h-3 w-3" />
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
        )}
      </div>
    </div>
  );
};

const KanbanColumn = ({ id, title, tasks, onEdit, onDelete }) => {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-slate-100 p-4 dark:bg-slate-800/50">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-slate-700 dark:text-slate-300">{title}</h3>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-400">
          {tasks.length}
        </span>
      </div>
      <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-1">
          {tasks.map((task) => (
            <SortableTaskItem key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

const KanbanBoard = ({ tasks, onUpdateStatus, onDelete, onEdit }) => {
  const [columns, setColumns] = useState({
    "To Do": [],
    "In Progress": [],
    "Done": [],
  });
  
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    // Distribute tasks into columns
    const newCols = { "To Do": [], "In Progress": [], "Done": [] };
    tasks.forEach((task) => {
      if (newCols[task.status]) {
        newCols[task.status].push(task);
      } else {
        newCols["To Do"].push(task); // Fallback
      }
    });
    setColumns(newCols);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t._id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;
    
    const activeTask = tasks.find((t) => t._id === activeId);
    if (!activeTask) return;

    let newStatus = activeTask.status;

    const isOverAColumn = Object.keys(columns).includes(overId);
    
    if (isOverAColumn) {
      newStatus = overId;
    } else {
      const overTask = tasks.find((t) => t._id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (activeTask.status !== newStatus) {
      onUpdateStatus(activeId, newStatus);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] min-h-[500px]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-3">
          {Object.keys(columns).map((colId) => (
            <KanbanColumn
              key={colId}
              id={colId}
              title={colId === 'To Do' ? 'Pending' : colId}
              tasks={columns[colId]}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeTask ? (
            <div className="rounded-xl border border-indigo-300 bg-white p-4 opacity-80 shadow-2xl dark:border-indigo-700 dark:bg-slate-800">
              <h4 className="font-semibold">{activeTask.title}</h4>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
