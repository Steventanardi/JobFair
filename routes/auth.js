const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const db = require('../db');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { error: 'Too many attempts from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/employer/register
router.post('/employer/register', authLimiter, async (req, res) => {
  const { email, password, company_name } = req.body;

  if (!email || !password || !company_name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const { rows: existing } = await db.query('SELECT id FROM employers WHERE email = $1', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hash = bcrypt.hashSync(password, 10);
    const result = await db.query(
      'INSERT INTO employers (email, password_hash, company_name) VALUES ($1, $2, $3) RETURNING id',
      [email, hash, company_name]
    );

    req.session.user = {
      id: result.rows[0].id,
      email,
      company_name,
      role: 'employer'
    };

    res.json({ message: 'Registration successful', user: req.session.user });
  } catch (err) {
    console.error(err);
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

    if (!employer || !bcrypt.compareSync(password, employer.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    req.session.user = {
      id: employer.id,
      email: employer.email,
      company_name: employer.company_name,
      role: 'employer'
    };

    res.json({ message: 'Login successful', user: req.session.user });
  } catch (err) {
    console.error('Employer login error:', err.message);
    res.status(500).json({ error: 'Server error', detail: process.env.NODE_ENV !== 'production' ? err.message : undefined });
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

    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.user = {
      id: admin.id,
      username: admin.username,
      role: 'admin'
    };

    res.json({ message: 'Login successful', user: req.session.user });
  } catch (err) {
    console.error(err);
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
