const VALID_STATUSES = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Validates task input for create/update operations.
 * Returns an object { valid, errors } where errors is an array of strings.
 */
function validateTask(data, isUpdate = false) {
  const errors = [];

  // Title — required on create, optional on update
  if (!isUpdate && (!data.title || typeof data.title !== 'string')) {
    errors.push('Title is required and must be a string');
  }
  if (data.title !== undefined) {
    if (typeof data.title !== 'string') {
      errors.push('Title must be a string');
    } else {
      const trimmed = data.title.trim();
      if (trimmed.length === 0) {
        errors.push('Title cannot be empty');
      } else if (trimmed.length > 200) {
        errors.push('Title must be 200 characters or fewer');
      }
    }
  }

  // Description — optional
  if (data.description !== undefined) {
    if (typeof data.description !== 'string') {
      errors.push('Description must be a string');
    } else if (data.description.length > 2000) {
      errors.push('Description must be 2000 characters or fewer');
    }
  }

  // Status — must be valid enum
  if (data.status !== undefined && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  // Priority — must be valid enum
  if (data.priority !== undefined && !VALID_PRIORITIES.includes(data.priority)) {
    errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }

  // Due date — must be valid ISO date string
  if (data.dueDate !== undefined && data.dueDate !== null) {
    const date = new Date(data.dueDate);
    if (isNaN(date.getTime())) {
      errors.push('Due date must be a valid date');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes task data — trims strings, sets defaults.
 */
function sanitizeTask(data) {
  const sanitized = {};

  if (data.title !== undefined) {
    sanitized.title = data.title.trim();
  }
  if (data.description !== undefined) {
    sanitized.description = data.description.trim();
  }
  if (data.status !== undefined) {
    sanitized.status = data.status;
  }
  if (data.priority !== undefined) {
    sanitized.priority = data.priority;
  }
  if (data.dueDate !== undefined) {
    sanitized.dueDate = data.dueDate ? new Date(data.dueDate).toISOString() : null;
  }

  return sanitized;
}

module.exports = {
  validateTask,
  sanitizeTask,
  VALID_STATUSES,
  VALID_PRIORITIES,
};
