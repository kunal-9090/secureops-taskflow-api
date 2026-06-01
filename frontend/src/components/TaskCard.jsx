import React from 'react';

const colorByStatus = {
  pending: '#fbbf24',
  'in-progress': '#60a5fa',
  completed: '#34d399'
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 800 }}>{task.title}</div>
          {task.description && <div style={{ color: 'var(--muted)', marginTop: 6 }}>{task.description}</div>}
          <div style={{ color: colorByStatus[task.status] || 'white', marginTop: 10, fontWeight: 700 }}>
            Status: {task.status}
          </div>
        </div>
        <div style={{ textAlign: 'right', minWidth: 140 }}>
          <div style={{ color: 'var(--muted)' }}>Priority</div>
          <div style={{ fontWeight: 800 }}>{task.priority}</div>
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="primary" onClick={() => onEdit(task)} type="button">Edit status</button>
        <button className="danger" onClick={() => onDelete(task)} type="button">Delete</button>
      </div>
    </div>
  );
};

export default TaskCard;

