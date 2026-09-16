const express = require('express');
const { authenticate } = require('../middleware/auth');
const aiService = require('../services/aiService');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Stricter rate limit for AI endpoints (prevent abuse)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  validate: { xForwardedForHeader: false },
  message: { error: 'Too many AI requests. Please wait a moment.' },
});

router.use(authenticate);
router.use(aiLimiter);

// POST /api/ai/improve-task — Get AI suggestions for a task
router.post('/improve-task', async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const suggestions = await aiService.improveTask(title.trim(), description?.trim());
    res.json({ suggestions });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
