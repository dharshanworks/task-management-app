const { validateTask, sanitizeTask, VALID_STATUSES, VALID_PRIORITIES } = require('../utils/validators');

describe('validateTask', () => {
  describe('create mode (isUpdate = false)', () => {
    test('should reject missing title', () => {
      const result = validateTask({});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Title is required and must be a string');
    });

    test('should reject empty title', () => {
      const result = validateTask({ title: '   ' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Title cannot be empty');
    });

    test('should reject title over 200 characters', () => {
      const result = validateTask({ title: 'a'.repeat(201) });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Title must be 200 characters or fewer');
    });

    test('should accept valid task data', () => {
      const result = validateTask({
        title: 'Valid task title',
        description: 'A description',
        status: 'todo',
        priority: 'high',
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should accept task with only title', () => {
      const result = validateTask({ title: 'Just a title' });
      expect(result.valid).toBe(true);
    });
  });

  describe('update mode (isUpdate = true)', () => {
    test('should allow update without title', () => {
      const result = validateTask({ status: 'done' }, true);
      expect(result.valid).toBe(true);
    });

    test('should still validate title if provided', () => {
      const result = validateTask({ title: '' }, true);
      expect(result.valid).toBe(false);
    });
  });

  describe('status validation', () => {
    test('should accept valid statuses', () => {
      VALID_STATUSES.forEach((status) => {
        const result = validateTask({ title: 'Test', status });
        expect(result.valid).toBe(true);
      });
    });

    test('should reject invalid status', () => {
      const result = validateTask({ title: 'Test', status: 'invalid' });
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/Status must be one of/);
    });
  });

  describe('priority validation', () => {
    test('should accept valid priorities', () => {
      VALID_PRIORITIES.forEach((priority) => {
        const result = validateTask({ title: 'Test', priority });
        expect(result.valid).toBe(true);
      });
    });

    test('should reject invalid priority', () => {
      const result = validateTask({ title: 'Test', priority: 'urgent' });
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/Priority must be one of/);
    });
  });

  describe('due date validation', () => {
    test('should accept valid date', () => {
      const result = validateTask({ title: 'Test', dueDate: '2026-12-31' });
      expect(result.valid).toBe(true);
    });

    test('should accept null date', () => {
      const result = validateTask({ title: 'Test', dueDate: null });
      expect(result.valid).toBe(true);
    });

    test('should reject invalid date', () => {
      const result = validateTask({ title: 'Test', dueDate: 'not-a-date' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Due date must be a valid date');
    });
  });

  describe('description validation', () => {
    test('should reject description over 2000 characters', () => {
      const result = validateTask({ title: 'Test', description: 'x'.repeat(2001) });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Description must be 2000 characters or fewer');
    });

    test('should reject non-string description', () => {
      const result = validateTask({ title: 'Test', description: 123 });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Description must be a string');
    });
  });
});

describe('sanitizeTask', () => {
  test('should trim title and description', () => {
    const result = sanitizeTask({ title: '  Hello  ', description: '  World  ' });
    expect(result.title).toBe('Hello');
    expect(result.description).toBe('World');
  });

  test('should convert dueDate to ISO string', () => {
    const result = sanitizeTask({ dueDate: '2026-12-31' });
    expect(result.dueDate).toMatch(/2026-12-31/);
  });

  test('should handle null dueDate', () => {
    const result = sanitizeTask({ dueDate: null });
    expect(result.dueDate).toBeNull();
  });

  test('should only include provided fields', () => {
    const result = sanitizeTask({ title: 'Test' });
    expect(result.title).toBe('Test');
    expect(result.status).toBeUndefined();
    expect(result.priority).toBeUndefined();
  });
});
