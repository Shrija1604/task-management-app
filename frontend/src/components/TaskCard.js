import React from "react";

const TaskCard = ({ task, onDelete }) => {
  const priorityColors = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#10b981",
  };

  const statusColors = {
    "To Do": "#94a3b8",
    "In Progress": "#7c3aed",
    "Done": "#10b981",
  };

  return (
    <div className="task-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ 
          fontSize: '11px', 
          fontWeight: '800', 
          color: priorityColors[task.priority],
          background: `${priorityColors[task.priority]}15`,
          padding: '4px 10px',
          borderRadius: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {task.priority}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
           <button 
             onClick={() => onDelete(task._id)}
             style={{ background: 'transparent', color: '#94a3b8', padding: '4px', boxShadow: 'none', border: 'none', cursor: 'pointer' }}
             title="Delete Task"
           >
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
           </button>
        </div>
      </div>
      
      <h3 style={{ marginBottom: '10px', color: 'var(--text-primary)', fontSize: '18px', fontWeight: '700' }}>{task.title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5', minHeight: '42px' }}>
        {task.description || "No description provided."}
      </p>
      
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
           <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColors[task.status] }}></div>
           <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>{task.status}</span>
        </div>
        {task.dueDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TaskCard);