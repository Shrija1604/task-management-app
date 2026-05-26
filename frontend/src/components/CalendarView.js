import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarView = ({ tasks = [], categories = [] }) => {
  const getCategoryColor = (catName) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? cat.color : "#6366f1"; // default indigo
  };

  const events = tasks
    .filter((task) => task.dueDate)
    .map((task) => {
      const isDone = task.status === "Done";
      const color = isDone ? "#10b981" : getCategoryColor(task.category); // green if done
      
      return {
        id: task._id,
        title: task.title,
        date: task.dueDate.split('T')[0], // yyyy-mm-dd
        backgroundColor: `${color}20`, // 20% opacity background
        borderColor: color,
        textColor: color,
        extendedProps: {
          isDone,
          priority: task.priority,
        }
      };
    });

  const renderEventContent = (eventInfo) => {
    const { isDone, priority } = eventInfo.event.extendedProps;
    
    let priorityColor = "bg-blue-500";
    if (priority === "Urgent") priorityColor = "bg-red-600";
    if (priority === "High") priorityColor = "bg-orange-500";
    if (priority === "Low") priorityColor = "bg-green-500";

    return (
      <div className={`flex items-center gap-1 overflow-hidden px-1 ${isDone ? "opacity-50 line-through" : ""}`}>
        <div className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${priorityColor}`} />
        <span className="truncate text-xs font-semibold">{eventInfo.event.title}</span>
      </div>
    );
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
      <style>
        {`
          .fc .fc-toolbar-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
          }
          .dark .fc .fc-toolbar-title {
            color: #f1f5f9;
          }
          .fc .fc-button-primary {
            background-color: #6366f1;
            border-color: #6366f1;
            text-transform: capitalize;
            font-weight: 600;
          }
          .fc .fc-button-primary:hover {
            background-color: #4f46e5;
            border-color: #4f46e5;
          }
          .fc-theme-standard td, .fc-theme-standard th, .fc-theme-standard .fc-scrollgrid {
            border-color: #e2e8f0;
          }
          .dark .fc-theme-standard td, .dark .fc-theme-standard th, .dark .fc-theme-standard .fc-scrollgrid {
            border-color: #334155;
          }
          .fc-day-today {
            background-color: rgba(99, 102, 241, 0.05) !important;
          }
          .dark .fc-day-today {
            background-color: rgba(99, 102, 241, 0.1) !important;
          }
          .fc-event {
            border-radius: 4px;
            border-width: 0 0 0 3px;
            padding: 2px;
            cursor: pointer;
            transition: transform 0.2s;
          }
          .fc-event:hover {
            transform: scale(1.02);
          }
        `}
      </style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventContent={renderEventContent}
        height="75vh"
        dayMaxEvents={3}
      />
    </div>
  );
};

export default CalendarView;
