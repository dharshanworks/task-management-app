const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

/**
 * Generate AI-powered suggestions to improve a task.
 * Returns structured suggestions for clarity, actionability, and subtasks.
 */
async function improveTask(title, description = '') {
  try {
    const ai = getGenAI();
    const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    const model = ai.getGenerativeModel({ model: modelName });

    const prompt = `You are a productivity expert. Analyze the following task and provide improvement suggestions.

Task Title: "${title}"
${description ? `Task Description: "${description}"` : 'No description provided.'}

Respond ONLY with valid JSON in this exact format (no markdown, no code fences):
{
  "improvedTitle": "A clearer, more actionable version of the title",
  "improvedDescription": "An improved description that is specific, measurable, and actionable",
  "suggestions": [
    "Specific suggestion 1 for improving this task",
    "Specific suggestion 2 for improving this task",
    "Specific suggestion 3 for improving this task"
  ],
  "estimatedTime": "Estimated time to complete (e.g., '30 minutes', '2 hours')",
  "suggestedPriority": "low | medium | high",
  "subtasks": [
    "Subtask 1 that breaks down the main task",
    "Subtask 2 that breaks down the main task"
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().trim();

    // Strip markdown code fences if present
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (error) {
    console.error('AI Service error:', error.message);

    if (error.message.includes('GEMINI_API_KEY')) {
      const err = new Error('AI service is not configured. Please set GEMINI_API_KEY.');
      err.statusCode = 503;
      throw err;
    }

    // Return a graceful fallback
    return {
      improvedTitle: title,
      improvedDescription: description || 'Consider adding a detailed description.',
      suggestions: [
        'Add specific, measurable outcomes to your task',
        'Break down the task into smaller subtasks',
        'Set a realistic deadline for completion',
      ],
      estimatedTime: 'Unable to estimate',
      suggestedPriority: 'medium',
      subtasks: [],
      fallback: true,
    };
  }
}

module.exports = { improveTask };
