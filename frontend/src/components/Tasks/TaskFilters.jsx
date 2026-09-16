import { useState } from 'react';
import './TaskFilters.css';

export default function TaskFilters({ filters, onChange }) {
  const [search, setSearch] = useState(filters.search || '');
  let debounceTimer = null;

  const handleSearchChange = (value) => {
    setSearch(value);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      onChange({ ...filters, search: value || undefined });
    }, 300);
  };

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value || undefined };
    onChange(updated);
  };

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  const clearFilters = () => {
    setSearch('');
    onChange({});
  };

  return (
    <div className="task-filters">
      {/* Search */}
      <div className="filter-search">
        <svg className="filter-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="form-input filter-search-input"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          id="search-tasks-input"
        />
      </div>

      {/* Priority filter */}
      <select
        className="form-select filter-select"
        value={filters.priority || ''}
        onChange={(e) => handleFilterChange('priority', e.target.value)}
        id="filter-priority"
      >
        <option value="">All Priorities</option>
        <option value="high">🔴 High</option>
        <option value="medium">🟡 Medium</option>
        <option value="low">🟢 Low</option>
      </select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          className="btn btn-ghost btn-sm"
          onClick={clearFilters}
          id="clear-filters-btn"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
