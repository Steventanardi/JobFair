const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const db = require('../db');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => err ? reject(err) : resolve());
  });
}

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((err) => err ? reject(err) : resolve());
  });
}

// POST /api/auth/employer/register
router.post('/employer/register', authLimiter, async (req, res) => {
  const { email, password, company_name } = req.body;

  if (!email || !password || !company_name) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const { rows: existing } = await db.query('SELECT id FROM employers WHERE email = $1', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO employers (email, password_hash, company_name) VALUES ($1, $2, $3) RETURNING id',
      [email, hash, company_name]
    );

    const user = { id: result.rows[0].id, email, company_name, role: 'employer' };

    await regenerateSession(req);
    req.session.user = user;
    await saveSession(req);

    res.json({ message: 'Registration successful', user });
  } catch (err) {
    console.error('Employer register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/employer/login
router.post('/employer/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { rows } = await db.query('SELECT * FROM employers WHERE email = $1', [email]);
    const employer = rows[0];

    if (!employer || !(await bcrypt.compare(password, employer.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = {
      id: employer.id,
      email: employer.email,
      company_name: employer.company_name,
      role: 'employer'
    };

    await regenerateSession(req);
    req.session.user = user;
    await saveSession(req);

    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Employer login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/admin/login
router.post('/admin/login', authLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const { rows } = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
    const admin = rows[0];

    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = { id: admin.id, username: admin.username, role: 'admin' };

    await regenerateSession(req);
    req.session.user = user;
    await saveSession(req);

    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ user: req.session.user });
  }
  res.status(401).json({ error: 'Not authenticated' });
});

module.exports = router;
