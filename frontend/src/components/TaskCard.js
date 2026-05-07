import React from "react";

const TaskCard = ({ task, onDelete }) => {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Category: {task.category}</p>

      <button onClick={() => onDelete(task._id)}>
        Delete
      </button>
    </div>
  );
};

export default TaskCard;