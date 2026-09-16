import './TaskCard.css';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, onAISuggest, onDragStart }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'done') return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div
      className="task-card glass-card"
      draggable
      onDragStart={onDragStart}
      id={`task-${task.id}`}
    >
      {/* Card Header — Priority & Actions */}
      <div className="task-card-header">
        <span className={`badge badge-priority-${task.priority}`}>
          {task.priority}
        </span>
        <div className="task-card-actions">
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={onAISuggest}
            title="Get AI suggestions"
          >
            ✨
          </button>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={onEdit}
            title="Edit task"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={onDelete}
            title="Delete task"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Body — Title & Description */}
      <div className="task-card-body" onClick={onEdit}>
        <h3 className="task-card-title">{task.title}</h3>
        {task.description && (
          <p className="task-card-description">{task.description}</p>
        )}
      </div>

      {/* Card Footer — Due Date & Status */}
      <div className="task-card-footer">
        {task.dueDate && (
          <span className={`task-card-date ${isOverdue() ? 'task-card-date-overdue' : ''}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {formatDate(task.dueDate)}
          </span>
        )}

        <select
          className="task-card-status-select"
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
}
