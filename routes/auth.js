const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

// POST /api/auth/employer/register
router.post('/employer/register', (req, res) => {
  const { email, password, company_name } = req.body;

  if (!email || !password || !company_name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existing = db.prepare('SELECT id FROM employers WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO employers (email, password_hash, company_name) VALUES (?, ?, ?)'
  ).run(email, hash, company_name);

  req.session.user = {
    id: result.lastInsertRowid,
    email,
    company_name,
    role: 'employer'
  };

  res.json({ message: 'Registration successful', user: req.session.user });
});

// POST /api/auth/employer/login
router.post('/employer/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const employer = db.prepare('SELECT * FROM employers WHERE email = ?').get(email);
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
});

// POST /api/auth/admin/login
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.user = {
    id: admin.id,
    username: admin.username,
    role: 'admin'
  };

  res.json({ message: 'Login successful', user: req.session.user });
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
