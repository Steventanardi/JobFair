const db = require('../db');

async function requireEmployer(req, res, next) {
  if (!req.session || !req.session.user || req.session.user.role !== 'employer') {
    return res.status(401).json({ error: 'Unauthorized — employer login required' });
  }
  try {
    const { rows } = await db.query('SELECT id FROM employers WHERE id = $1', [req.session.user.id]);
    if (rows.length === 0) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: 'Account no longer exists' });
    }
    next();
  } catch (err) {
    console.error('Auth check error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function requireAdmin(req, res, next) {
  if (!req.session || !req.session.user || req.session.user.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized — admin login required' });
  }
  try {
    const { rows } = await db.query('SELECT id FROM admins WHERE id = $1', [req.session.user.id]);
    if (rows.length === 0) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: 'Account no longer exists' });
    }
    next();
  } catch (err) {
    console.error('Auth check error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { requireEmployer, requireAdmin };
