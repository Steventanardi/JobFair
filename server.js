const express = require('express');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const helmet = require('helmet');
const compression = require('compression');
const db = require('./db'); // triggers table creation on require

const authRoutes = require('./routes/auth');
const submissionRoutes = require('./routes/submissions');
const adminRoutes = require('./routes/admin');
const announcementRoutes = require('./routes/announcements');
const settingsRoutes = require('./routes/settings');
const cmsRoutes = require('./routes/cms');
const app = express();
const PORT = process.env.PORT || 3000;



// Trust Vercel's proxy so secure cookies work
app.set('trust proxy', 1);

// ── Middleware ──────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })); // CSP enforcement disabled — inline scripts throughout
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy-Report-Only',
    "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'");
  next();
});
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

if (!process.env.SESSION_SECRET) {
  console.warn('WARNING: SESSION_SECRET not set — sessions will reset on restart. Set it in Vercel env vars.');
}

app.use(session({
  store: new pgSession({
    pool: db,
    tableName: 'session',
    createTableIfMissing: true
  }),
  name: 'nqu_sid',
  secret: process.env.SESSION_SECRET || 'nqu-jobfair-fallback-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
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

// ── Health Check ───────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await db.rawQuery('SELECT 1');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', timestamp: new Date().toISOString() });
  }
});

// ── API Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/cms', cmsRoutes);

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

// ── 404 Catch-all ─────────────────────────────────────────
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
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
