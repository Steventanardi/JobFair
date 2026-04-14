const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./db'); // triggers table creation on require

const authRoutes = require('./routes/auth');
const submissionRoutes = require('./routes/submissions');
const adminRoutes = require('./routes/admin');
const announcementRoutes = require('./routes/announcements');
const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'nqu-jobfair-secret-default-dev',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/announcements', announcementRoutes);
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

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ┌──────────────────────────────────────────┐`);
  console.log(`  │  NQU Job Fair System                     │`);
  console.log(`  │  Running at http://localhost:${PORT}        │`);
  console.log(`  │  Admin: admin / nqu2025                  │`);
  console.log(`  └──────────────────────────────────────────┘\n`);
});
