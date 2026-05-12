import React, { useState } from "react";

const CalendarView = ({ tasks = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getTasksForDay = (day) => {
    if (!day) return [];
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const d = new Date(task.dueDate);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const priorityColors = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#10b981",
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={prevMonth} className="auth-btn" style={{ width: '40px', height: '40px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <h2 style={{ fontSize: '24px', fontWeight: '800', minWidth: '180px', textAlign: 'center', letterSpacing: '-0.5px' }}>{monthNames[month]} {year}</h2>
            <button onClick={nextMonth} className="auth-btn" style={{ width: '40px', height: '40px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
        <button onClick={() => setCurrentDate(new Date())} className="auth-btn" style={{ width: 'auto', padding: '10px 24px', background: '#fff', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'none', fontWeight: '700' }}>Today</button>
      </div>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="calendar-day-head">{d}</div>
        ))}
        {days.map((day, idx) => {
          const dayTasks = getTasksForDay(day);
          const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
          
          return (
            <div key={idx} className={`calendar-day ${!day ? 'empty' : ''}`} style={isToday ? { border: '2px solid var(--accent-primary)', zIndex: 1 } : {}}>
              {day && (
                <>
                  <div className="day-number" style={isToday ? { color: 'var(--accent-primary)' } : {}}>{day}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {dayTasks.map(task => (
                      <div 
                        key={task._id} 
                        className="calendar-task-tag"
                        style={{ background: `${priorityColors[task.priority]}15`, color: priorityColors[task.priority], borderLeft: `3px solid ${priorityColors[task.priority]}` }}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
