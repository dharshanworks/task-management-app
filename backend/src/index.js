require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const taskRoutes = require('./routes/taskRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxy (Railway, Heroku, etc.) so X-Forwarded-For is properly handled
// and express-rate-limit identifies client IP correctly
app.set('trust proxy', 1);

// --------------- Security Middleware ---------------
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    // Explicitly set to 'unsafe-none' instead of false.
    // Setting false only tells helmet to skip the header, but Railway's
    // reverse proxy (railway-hikari) injects COOP: same-origin anyway,
    // which breaks Firebase popup authentication.
    crossOriginOpenerPolicy: { policy: 'unsafe-none' },
  })
);

// Force-override COOP header AFTER helmet — ensures Railway's reverse proxy
// cannot override it. Firebase Google Sign-In popup REQUIRES the opener
// window reference to communicate auth results back to the app.
app.use((_req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  next();
});
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow any localhost port in development
    if (process.env.NODE_ENV !== 'production' && /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }
    // If FRONTEND_URL is not set in production or equals origin, allow
    if (!process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    const allowed = process.env.FRONTEND_URL.split(',').map((u) => u.trim());
    if (allowed.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// --------------- Body Parsing ---------------
app.use(express.json({ limit: '10kb' }));

// --------------- Health Check ---------------
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// --------------- Routes ---------------
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

// --------------- Static Files (Production) ---------------
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));

  // SPA fallback — serve index.html for non-API routes
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// --------------- 404 Handler ---------------
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --------------- Global Error Handler ---------------
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// --------------- Start Server ---------------
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
