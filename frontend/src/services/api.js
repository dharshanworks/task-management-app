const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Authenticated API client.
 * Wraps fetch with auth headers and error handling.
 */
async function apiRequest(endpoint, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || 'Something went wrong');
    error.status = response.status;
    throw error;
  }

  return data;
}

// --- Task API ---

export async function fetchTasks(token, filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.search) params.set('search', filters.search);

  const query = params.toString();
  return apiRequest(`/tasks${query ? `?${query}` : ''}`, {}, token);
}

export async function createTask(token, taskData) {
  return apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  }, token);
}

export async function updateTask(token, taskId, updates) {
  return apiRequest(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }, token);
}

export async function deleteTask(token, taskId) {
  return apiRequest(`/tasks/${taskId}`, {
    method: 'DELETE',
  }, token);
}

// --- AI API ---

export async function improveTask(token, title, description) {
  return apiRequest('/ai/improve-task', {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  }, token);
}
