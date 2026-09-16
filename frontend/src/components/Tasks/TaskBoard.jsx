import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../services/api';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import AISuggestionPanel from '../AI/AISuggestionPanel';
import Toast from '../Common/Toast';
import './TaskBoard.css';

const COLUMNS = [
  { id: 'todo', label: 'To Do', icon: '📋' },
  { id: 'in-progress', label: 'In Progress', icon: '⚡' },
  { id: 'done', label: 'Done', icon: '✅' },
];

export default function TaskBoard() {
  const { getIdToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [aiTask, setAiTask] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [filters, setFilters] = useState({});
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch tasks
  const loadTasks = useCallback(async () => {
    try {
      const token = await getIdToken();
      if (!token) return;
      const data = await fetchTasks(token, filters);
      setTasks(data.tasks);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [getIdToken, filters, addToast]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Create task
  const handleCreate = async (taskData) => {
    try {
      const token = await getIdToken();
      const data = await createTask(token, taskData);
      setTasks((prev) => [data.task, ...prev]);
      setShowForm(false);
      addToast('Task created successfully');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Update task
  const handleUpdate = async (taskId, updates) => {
    try {
      const token = await getIdToken();
      const data = await updateTask(token, taskId, updates);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? data.task : t)));
      setEditingTask(null);
      addToast('Task updated');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Delete task
  const handleDelete = async (taskId) => {
    try {
      const token = await getIdToken();
      await deleteTask(token, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      addToast('Task deleted');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Status change (used by drag-and-drop and manual status change)
  const handleStatusChange = async (taskId, newStatus) => {
    await handleUpdate(taskId, { status: newStatus });
  };

  // Drag and drop
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      await handleStatusChange(taskId, newStatus);
    }
  };

  // Get tasks for a specific column
  const getColumnTasks = (status) => {
    return tasks.filter((t) => t.status === status);
  };

  return (
    <div className="task-board-container">
      {/* Header with actions */}
      <div className="board-header">
        <div className="board-header-left">
          <h1 className="board-title">My Tasks</h1>
          <span className="board-count">{tasks.length} tasks</span>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setEditingTask(null); setShowForm(true); }}
          id="create-task-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Task
        </button>
      </div>

      {/* Filters */}
      <TaskFilters filters={filters} onChange={setFilters} />

      {/* Kanban Board */}
      {loading ? (
        <div className="board-loading">
          <div className="spinner spinner-lg" />
          <p>Loading tasks...</p>
        </div>
      ) : (
        <div className="board-columns">
          {COLUMNS.map((col) => {
            const columnTasks = getColumnTasks(col.id);
            return (
              <div
                key={col.id}
                className={`board-column ${dragOverColumn === col.id ? 'board-column-dragover' : ''}`}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <div className="column-header">
                  <div className="column-header-left">
                    <span className="column-icon">{col.icon}</span>
                    <h2 className="column-title">{col.label}</h2>
                    <span className={`column-count badge badge-status-${col.id}`}>
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <div className="column-tasks">
                  {columnTasks.length === 0 ? (
                    <div className="column-empty">
                      <p>No tasks here</p>
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => { setEditingTask(task); setShowForm(true); }}
                        onDelete={() => handleDelete(task.id)}
                        onStatusChange={(status) => handleStatusChange(task.id, status)}
                        onAISuggest={() => setAiTask(task)}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask
            ? (data) => handleUpdate(editingTask.id, data)
            : handleCreate
          }
          onClose={() => { setShowForm(false); setEditingTask(null); }}
        />
      )}

      {/* AI Suggestion Panel */}
      {aiTask && (
        <AISuggestionPanel
          task={aiTask}
          onApply={(updates) => {
            handleUpdate(aiTask.id, updates);
            setAiTask(null);
          }}
          onClose={() => setAiTask(null)}
        />
      )}

      {/* Toasts */}
      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
}
