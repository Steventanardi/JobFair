const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const db = require('../db');

const router = express.Router();

const UBN_RE = /^\d{8}$/;

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

// POST /api/auth/employer/login — passwordless, find-or-create by 統編號
router.post('/employer/login', authLimiter, async (req, res) => {
  const ubn = (req.body.unified_business_no || '').trim();

  if (!UBN_RE.test(ubn)) {
    return res.status(400).json({ error: '統一編號必須為 8 位數字 / Unified Business Number must be exactly 8 digits' });
  }

  try {
    let { rows } = await db.query(
      'SELECT id, unified_business_no, company_name FROM employers WHERE unified_business_no = $1',
      [ubn]
    );

    let employer;
    if (rows.length > 0) {
      employer = rows[0];
    } else {
      // Provide placeholder email/password_hash in case NOT NULL constraints
      // are still present on older DB deployments where the migration hasn't applied.
      const result = await db.query(
        `INSERT INTO employers (unified_business_no, company_name, email, password_hash)
         VALUES ($1, $2, $3, $4)
         RETURNING id, unified_business_no, company_name`,
        [ubn, ubn, `ubn_${ubn}@noreply.invalid`, '']
      );
      employer = result.rows[0];
    }

    const user = {
      id: employer.id,
      unified_business_no: employer.unified_business_no,
      company_name: employer.company_name,
      role: 'employer'
    };

    await regenerateSession(req);
    req.session.user = user;
    await saveSession(req);

    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Employer login error:', err.message, err.code);
    const msg = process.env.NODE_ENV !== 'production' ? err.message : 'Server error';
    res.status(500).json({ error: msg });
  }
});

// POST /api/auth/admin/login
router.post('/admin/login', authLimiter, async (req, res) => {
  const username = (req.body.username || '').trim();
  const password = req.body.password || '';

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const { rows } = await db.query(
      'SELECT id, username, password_hash FROM admins WHERE username = $1',
      [username]
    );
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
    res.clearCookie('nqu_sid');
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
