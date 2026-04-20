const express = require('express');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const db = require('./db'); // triggers table creation on require

const authRoutes = require('./routes/auth');
const submissionRoutes = require('./routes/submissions');
const adminRoutes = require('./routes/admin');
const announcementRoutes = require('./routes/announcements');
const app = express();
const PORT = process.env.PORT || 3000;

// Trust Vercel's proxy so secure cookies work
app.set('trust proxy', 1);

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: new pgSession({
    pool: db,
    tableName: 'session',
    createTableIfMissing: true
  }),
  secret: (() => {
    if (!process.env.SESSION_SECRET && process.env.NODE_ENV === 'production') {
      console.error('FATAL: SESSION_SECRET env var is not set in production!');
      process.exit(1);
    }
    return process.env.SESSION_SECRET || 'nqu-jobfair-secret-default-dev';
  })(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));

// ── CSRF protection — reject cross-origin state-changing requests ──
app.use((req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.headers.origin || req.headers.referer;
  if (!origin) return next(); // same-origin requests don't send Origin
  const host = req.headers.host;
  try {
    if (new URL(origin).host !== host) {
      return res.status(403).json({ error: 'Cross-origin request rejected' });
    }
  } catch {
    return res.status(403).json({ error: 'Invalid origin' });
  }
  next();
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/announcements', announcementRoutes);

// ── Global API Error Handler ───────────────────────────────
app.use('/api', (err, req, res, next) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error' 
  });
});

// ── SPA Fallback for HTML pages ────────────────────────────
app.get('/employer/*', (req, res) => {
  const file = req.path.endsWith('.html') ? req.path : req.path + '.html';
  res.sendFile(path.join(__dirname, 'public', file), (err) => {
    if (err) res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
});

app.get('/admin/*', (req, res) => {
  const file = req.path.endsWith('.html') ? req.path : req.path + '.html';
  res.sendFile(path.join(__dirname, 'public', file), (err) => {
    if (err) res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
});

// ── Start (only when not on Vercel) ────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n  ┌──────────────────────────────────────────┐`);
    console.log(`  │  NQU Job Fair System                     │`);
    console.log(`  │  Running at http://localhost:${PORT}        │`);
    console.log(`  └──────────────────────────────────────────┘\n`);
  });
}

// Export for Vercel serverless
module.exports = app;
