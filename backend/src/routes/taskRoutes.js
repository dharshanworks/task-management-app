const express = require('express');
const { authenticate } = require('../middleware/auth');
const taskService = require('../services/taskService');

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

// GET /api/tasks — List tasks with optional filters
router.get('/', async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status || null,
      priority: req.query.priority || null,
      search: req.query.search || null,
    };
    const tasks = await taskService.getTasks(req.user.uid, filters);
    res.json({ tasks, count: tasks.length });
  } catch (error) {
    next(error);
  }
});

// GET /api/tasks/:id — Get a single task
router.get('/:id', async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.user.uid, req.params.id);
    res.json({ task });
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks — Create a new task
router.post('/', async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.uid, req.body);
    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
});

// PUT /api/tasks/:id — Update a task
router.put('/:id', async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.user.uid, req.params.id, req.body);
    res.json({ task });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tasks/:id — Delete a task
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await taskService.deleteTask(req.user.uid, req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
