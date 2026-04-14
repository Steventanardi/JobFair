const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(requireAdmin);

// GET /api/admin/submissions — list all submissions with optional filters
router.get('/submissions', async (req, res) => {
  const { status, search } = req.query;
  let sql = `
    SELECT s.*, e.email as employer_email 
    FROM submissions s 
    LEFT JOIN employers e ON s.employer_id = e.id
  `;
  const conditions = [];
  const params = [];
  let paramCounter = 1;

  if (status && ['pending', 'approved', 'rejected'].includes(status)) {
    conditions.push(`s.status = $${paramCounter++}`);
    params.push(status);
  }

  if (search) {
    conditions.push(`(s.company_name ILIKE $${paramCounter} OR s.contact_person ILIKE $${paramCounter + 1} OR s.contact_email ILIKE $${paramCounter + 2})`);
    const term = `%${search}%`;
    params.push(term, term, term);
    paramCounter += 3;
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY s.submitted_at DESC';

  try {
    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/submissions/:id/status — approve or reject
router.patch('/submissions/:id/status', async (req, res) => {
  const { status, admin_notes } = req.body;

  if (!status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be "approved" or "rejected"' });
  }

  try {
    const { rows } = await db.query('SELECT id FROM submissions WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Submission not found' });

    await db.query(`
      UPDATE submissions SET status = $1, admin_notes = $2, reviewed_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [status, admin_notes || null, req.params.id]);

    res.json({ message: `Submission ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/submissions/:id/booth — assign booth number
router.patch('/submissions/:id/booth', async (req, res) => {
  const { booth_number } = req.body;

  try {
    const { rows } = await db.query('SELECT id, status FROM submissions WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Submission not found' });
    if (rows[0].status !== 'approved') {
      return res.status(400).json({ error: 'Can only assign booth to approved submissions' });
    }

    await db.query('UPDATE submissions SET booth_number = $1 WHERE id = $2', [booth_number || null, req.params.id]);

    res.json({ message: 'Booth assigned' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/submissions/:id — delete any submission
router.delete('/submissions/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id FROM submissions WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Submission not found' });

    await db.query('DELETE FROM submissions WHERE id = $1', [req.params.id]);
    res.json({ message: 'Submission deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/employers — list all employer accounts
router.get('/employers', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT e.*, 
        (SELECT COUNT(*) FROM submissions s WHERE s.employer_id = e.id) as submission_count
      FROM employers e 
      ORDER BY e.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/employers/:id — delete employer account and their submissions
router.delete('/employers/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id FROM employers WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Employer not found' });

    await db.query('DELETE FROM submissions WHERE employer_id = $1', [req.params.id]);
    await db.query('DELETE FROM employers WHERE id = $1', [req.params.id]);
    res.json({ message: 'Employer and their submissions deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/employers/:id/reset-password — reset employer password
router.patch('/employers/:id/reset-password', async (req, res) => {
  const { new_password } = req.body;

  if (!new_password || new_password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const { rows } = await db.query('SELECT id, company_name FROM employers WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Employer not found' });

    const hash = bcrypt.hashSync(new_password, 10);
    await db.query('UPDATE employers SET password_hash = $1 WHERE id = $2', [hash, req.params.id]);

    res.json({ message: `Password reset for ${rows[0].company_name}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/stats — dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [{ rows: totalRows }, { rows: pendingRows }, { rows: approvedRows }, { rows: rejectedRows }, { rows: employerRows }] = await Promise.all([
      db.query('SELECT COUNT(*) as cnt FROM submissions'),
      db.query("SELECT COUNT(*) as cnt FROM submissions WHERE status = 'pending'"),
      db.query("SELECT COUNT(*) as cnt FROM submissions WHERE status = 'approved'"),
      db.query("SELECT COUNT(*) as cnt FROM submissions WHERE status = 'rejected'"),
      db.query('SELECT COUNT(*) as cnt FROM employers')
    ]);

    res.json({
      total: parseInt(totalRows[0].cnt),
      pending: parseInt(pendingRows[0].cnt),
      approved: parseInt(approvedRows[0].cnt),
      rejected: parseInt(rejectedRows[0].cnt),
      employerCount: parseInt(employerRows[0].cnt)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
