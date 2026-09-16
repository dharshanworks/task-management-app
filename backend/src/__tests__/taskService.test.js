// Mock firebase config before requiring taskService
const mockDocRef = {
  id: 'task-doc-123',
  get: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockCollectionRef = {
  add: jest.fn(),
  doc: jest.fn(() => mockDocRef),
  where: jest.fn(),
  get: jest.fn(),
};

mockCollectionRef.where.mockReturnValue(mockCollectionRef);

jest.mock('../config/firebase', () => ({
  db: {
    collection: jest.fn(() => mockCollectionRef),
  },
}));

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../services/taskService');

describe('taskService', () => {
  const userId = 'user-test-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    test('creates a task with valid input and default fields', async () => {
      mockCollectionRef.add.mockResolvedValueOnce({ id: 'task-new-456' });

      const task = await createTask(userId, {
        title: 'Complete documentation',
        priority: 'high',
      });

      expect(task).toBeDefined();
      expect(task.id).toBe('task-new-456');
      expect(task.title).toBe('Complete documentation');
      expect(task.priority).toBe('high');
      expect(task.status).toBe('todo');
      expect(task.userId).toBe(userId);
      expect(task.createdAt).toBeDefined();
    });

    test('throws 400 error when title is missing', async () => {
      await expect(createTask(userId, { description: 'Missing title' })).rejects.toThrow(
        'Title is required'
      );
    });
  });

  describe('getTasks', () => {
    test('retrieves tasks, filters by status and priority, and sorts newest first', async () => {
      const mockDocs = [
        {
          id: '1',
          data: () => ({
            userId,
            title: 'Task 1',
            status: 'todo',
            priority: 'low',
            createdAt: '2026-01-01T00:00:00.000Z',
          }),
        },
        {
          id: '2',
          data: () => ({
            userId,
            title: 'Task 2',
            status: 'todo',
            priority: 'high',
            createdAt: '2026-01-02T00:00:00.000Z',
          }),
        },
        {
          id: '3',
          data: () => ({
            userId,
            title: 'Task 3',
            status: 'done',
            priority: 'high',
            createdAt: '2026-01-03T00:00:00.000Z',
          }),
        },
      ];

      mockCollectionRef.get.mockResolvedValueOnce(mockDocs);

      const tasks = await getTasks(userId, { status: 'todo' });
      expect(tasks).toHaveLength(2);
      // Newest first
      expect(tasks[0].id).toBe('2');
      expect(tasks[1].id).toBe('1');
    });

    test('filters tasks by search keyword across title and description', async () => {
      const mockDocs = [
        {
          id: '1',
          data: () => ({
            userId,
            title: 'Write report',
            description: 'Final quarter review',
            createdAt: '2026-01-01T00:00:00.000Z',
          }),
        },
        {
          id: '2',
          data: () => ({
            userId,
            title: 'Prepare slides',
            description: 'Design presentation',
            createdAt: '2026-01-02T00:00:00.000Z',
          }),
        },
      ];

      mockCollectionRef.get.mockResolvedValueOnce(mockDocs);

      const tasks = await getTasks(userId, { search: 'quarter' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toBe('1');
    });
  });

  describe('getTaskById', () => {
    test('returns task when found and user is owner', async () => {
      mockDocRef.get.mockResolvedValueOnce({
        exists: true,
        id: 'task-doc-123',
        data: () => ({ userId, title: 'My Task' }),
      });

      const task = await getTaskById(userId, 'task-doc-123');
      expect(task.id).toBe('task-doc-123');
      expect(task.title).toBe('My Task');
    });

    test('throws 404 when task does not exist', async () => {
      mockDocRef.get.mockResolvedValueOnce({ exists: false });

      await expect(getTaskById(userId, 'task-doc-123')).rejects.toThrow('Task not found');
    });

    test('throws 403 when user does not own task', async () => {
      mockDocRef.get.mockResolvedValueOnce({
        exists: true,
        id: 'task-doc-123',
        data: () => ({ userId: 'other-user', title: 'Other Task' }),
      });

      await expect(getTaskById(userId, 'task-doc-123')).rejects.toThrow('Access denied');
    });
  });

  describe('updateTask', () => {
    test('updates task data when valid', async () => {
      // Ownership check get()
      mockDocRef.get.mockResolvedValueOnce({
        exists: true,
        id: 'task-doc-123',
        data: () => ({ userId, title: 'Old Title', status: 'todo' }),
      });
      // update()
      mockDocRef.update.mockResolvedValueOnce({});
      // updated doc get()
      mockDocRef.get.mockResolvedValueOnce({
        exists: true,
        id: 'task-doc-123',
        data: () => ({ userId, title: 'New Title', status: 'in-progress' }),
      });

      const updated = await updateTask(userId, 'task-doc-123', {
        title: 'New Title',
        status: 'in-progress',
      });

      expect(updated.title).toBe('New Title');
      expect(updated.status).toBe('in-progress');
      expect(mockDocRef.update).toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    test('deletes task when user is owner', async () => {
      mockDocRef.get.mockResolvedValueOnce({
        exists: true,
        id: 'task-doc-123',
        data: () => ({ userId, title: 'Task to delete' }),
      });
      mockDocRef.delete.mockResolvedValueOnce({});

      const result = await deleteTask(userId, 'task-doc-123');
      expect(result.deleted).toBe(true);
      expect(mockDocRef.delete).toHaveBeenCalled();
    });
  });
});
