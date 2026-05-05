import React from 'react';

const statusColors = {
  'pending':     { background: '#fff8e1', color: '#f57f17' },
  'in-progress': { background: '#e3f2fd', color: '#1565c0' },
  'completed':   { background: '#e8f5e9', color: '#2e7d32' },
};

const TaskItem = ({ task, onDelete, onEdit, onStatusChange }) => (
  <div style={{
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '1rem 1.25rem',
    marginBottom: '12px',
    background: '#fff'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 4px', fontSize: '15px' }}>{task.title}</h4>
        <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#6b7280' }}>
          {task.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            ...statusColors[task.status],
            padding: '3px 10px',
            borderRadius: '99px',
            fontSize: '12px',
            fontWeight: 500
          }}>
            {task.status}
          </span>
          {task.dueDate && (
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginLeft: '1rem' }}>
        <button onClick={() => onEdit(task)} style={{
          padding: '5px 12px', borderRadius: '6px',
          border: '1px solid #e5e7eb', background: '#fff',
          cursor: 'pointer', fontSize: '13px'
        }}>
          Edit
        </button>
        <button onClick={() => onDelete(task._id)} style={{
          padding: '5px 12px', borderRadius: '6px',
          border: '1px solid #fca5a5', background: '#fff',
          cursor: 'pointer', fontSize: '13px', color: '#dc2626'
        }}>
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default TaskItem;