import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { improveTask } from '../../services/api';
import './AISuggestionPanel.css';

export default function AISuggestionPanel({ task, onApply, onClose }) {
  const { getIdToken } = useAuth();
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        setLoading(true);
        setError(null);
        const token = await getIdToken();
        const data = await improveTask(token, task.title, task.description);
        setSuggestions(data.suggestions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSuggestions();
  }, [task, getIdToken]);

  const handleApply = () => {
    if (!suggestions) return;
    onApply({
      title: suggestions.improvedTitle,
      description: suggestions.improvedDescription,
    });
  };

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="ai-panel modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="ai-panel-title">
            <span className="ai-sparkle">✨</span>
            <h2>AI Task Assistant</h2>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Current Task */}
          <div className="ai-section">
            <h3 className="ai-section-label">Current Task</h3>
            <div className="ai-current-task">
              <strong>{task.title}</strong>
              {task.description && <p>{task.description}</p>}
            </div>
          </div>

          {loading ? (
            <div className="ai-loading">
              <div className="spinner" />
              <p>Analyzing your task with AI...</p>
              <div className="ai-loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          ) : error ? (
            <div className="ai-error">
              <p>⚠️ {error}</p>
              <button className="btn btn-secondary btn-sm" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          ) : suggestions ? (
            <>
              {/* Improved Title */}
              <div className="ai-section">
                <h3 className="ai-section-label">📝 Improved Title</h3>
                <div className="ai-suggestion-box">{suggestions.improvedTitle}</div>
              </div>

              {/* Improved Description */}
              <div className="ai-section">
                <h3 className="ai-section-label">📋 Improved Description</h3>
                <div className="ai-suggestion-box">{suggestions.improvedDescription}</div>
              </div>

              {/* Suggestions */}
              {suggestions.suggestions?.length > 0 && (
                <div className="ai-section">
                  <h3 className="ai-section-label">💡 Suggestions</h3>
                  <ul className="ai-suggestion-list">
                    {suggestions.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Subtasks */}
              {suggestions.subtasks?.length > 0 && (
                <div className="ai-section">
                  <h3 className="ai-section-label">📌 Suggested Subtasks</h3>
                  <ul className="ai-suggestion-list">
                    {suggestions.subtasks.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Metadata */}
              <div className="ai-metadata">
                {suggestions.estimatedTime && (
                  <span className="ai-meta-item">⏱ {suggestions.estimatedTime}</span>
                )}
                {suggestions.suggestedPriority && (
                  <span className={`ai-meta-item badge badge-priority-${suggestions.suggestedPriority}`}>
                    Priority: {suggestions.suggestedPriority}
                  </span>
                )}
              </div>
            </>
          ) : null}
        </div>

        {!loading && !error && suggestions && (
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Dismiss
            </button>
            <button className="btn btn-primary" onClick={handleApply} id="apply-ai-btn">
              ✨ Apply Improvements
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
