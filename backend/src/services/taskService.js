const { db } = require('../config/firebase');
const { validateTask, sanitizeTask } = require('../utils/validators');

const TASKS_COLLECTION = 'tasks';

/**
 * Create a new task for the authenticated user.
 */
async function createTask(userId, data) {
  const { valid, errors } = validateTask(data, false);
  if (!valid) {
    const err = new Error(errors.join('; '));
    err.statusCode = 400;
    throw err;
  }

  const sanitized = sanitizeTask(data);
  const now = new Date().toISOString();

  const taskData = {
    title: sanitized.title,
    description: sanitized.description || '',
    status: sanitized.status || 'todo',
    priority: sanitized.priority || 'medium',
    dueDate: sanitized.dueDate || null,
    userId,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await db.collection(TASKS_COLLECTION).add(taskData);
  return { id: docRef.id, ...taskData };
}

/**
 * Get all tasks for a user, with optional filters.
 */
async function getTasks(userId, filters = {}) {
  let query = db.collection(TASKS_COLLECTION).where('userId', '==', userId);

  if (filters.status) {
    query = query.where('status', '==', filters.status);
  }
  if (filters.priority) {
    query = query.where('priority', '==', filters.priority);
  }

  query = query.orderBy('createdAt', 'desc');

  const snapshot = await query.get();
  const tasks = [];

  snapshot.forEach((doc) => {
    tasks.push({ id: doc.id, ...doc.data() });
  });

  // Client-side search filter (Firestore doesn't support full-text search)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower)
    );
  }

  return tasks;
}

/**
 * Get a single task by ID, with ownership check.
 */
async function getTaskById(userId, taskId) {
  const doc = await db.collection(TASKS_COLLECTION).doc(taskId).get();

  if (!doc.exists) {
    const err = new Error('Task not found');
    err.statusCode = 404;
    throw err;
  }

  const task = { id: doc.id, ...doc.data() };

  if (task.userId !== userId) {
    const err = new Error('Access denied');
    err.statusCode = 403;
    throw err;
  }

  return task;
}

/**
 * Update a task (partial update supported).
 */
async function updateTask(userId, taskId, data) {
  // Verify ownership
  await getTaskById(userId, taskId);

  const { valid, errors } = validateTask(data, true);
  if (!valid) {
    const err = new Error(errors.join('; '));
    err.statusCode = 400;
    throw err;
  }

  const sanitized = sanitizeTask(data);
  sanitized.updatedAt = new Date().toISOString();

  await db.collection(TASKS_COLLECTION).doc(taskId).update(sanitized);

  const updated = await db.collection(TASKS_COLLECTION).doc(taskId).get();
  return { id: updated.id, ...updated.data() };
}

/**
 * Delete a task.
 */
async function deleteTask(userId, taskId) {
  // Verify ownership
  await getTaskById(userId, taskId);
  await db.collection(TASKS_COLLECTION).doc(taskId).delete();
  return { id: taskId, deleted: true };
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
