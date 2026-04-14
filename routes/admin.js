const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(requireAdmin);

// GET /api/admin/submissions — list all submissions with optional filters
router.get('/submissions', (req, res) => {
  const { status, search } = req.query;
  let sql = `
    SELECT s.*, e.email as employer_email 
    FROM submissions s 
    LEFT JOIN employers e ON s.employer_id = e.id
  `;
  const conditions = [];
  const params = [];

  if (status && ['pending', 'approved', 'rejected'].includes(status)) {
    conditions.push('s.status = ?');
    params.push(status);
  }

  if (search) {
    conditions.push('(s.company_name LIKE ? OR s.contact_person LIKE ? OR s.contact_email LIKE ?)');
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY s.submitted_at DESC';

  const submissions = db.prepare(sql).all(...params);
  res.json(submissions);
});

// PATCH /api/admin/submissions/:id/status — approve or reject
router.patch('/submissions/:id/status', (req, res) => {
  const { status, admin_notes } = req.body;

  if (!status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be "approved" or "rejected"' });
  }

  const submission = db.prepare('SELECT id FROM submissions WHERE id = ?').get(req.params.id);
  if (!submission) return res.status(404).json({ error: 'Submission not found' });

  db.prepare(`
    UPDATE submissions SET status = ?, admin_notes = ?, reviewed_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(status, admin_notes || null, req.params.id);

  res.json({ message: `Submission ${status}` });
});

// PATCH /api/admin/submissions/:id/booth — assign booth number
router.patch('/submissions/:id/booth', (req, res) => {
  const { booth_number } = req.body;

  const submission = db.prepare('SELECT id, status FROM submissions WHERE id = ?').get(req.params.id);
  if (!submission) return res.status(404).json({ error: 'Submission not found' });
  if (submission.status !== 'approved') {
    return res.status(400).json({ error: 'Can only assign booth to approved submissions' });
  }

  db.prepare('UPDATE submissions SET booth_number = ? WHERE id = ?')
    .run(booth_number || null, req.params.id);

  res.json({ message: 'Booth assigned' });
});

// DELETE /api/admin/submissions/:id — delete any submission
router.delete('/submissions/:id', (req, res) => {
  const submission = db.prepare('SELECT id FROM submissions WHERE id = ?').get(req.params.id);
  if (!submission) return res.status(404).json({ error: 'Submission not found' });

  db.prepare('DELETE FROM submissions WHERE id = ?').run(req.params.id);
  res.json({ message: 'Submission deleted' });
});

// GET /api/admin/employers — list all employer accounts
router.get('/employers', (req, res) => {
  const employers = db.prepare(`
    SELECT e.*, 
      (SELECT COUNT(*) FROM submissions s WHERE s.employer_id = e.id) as submission_count
    FROM employers e 
    ORDER BY e.created_at DESC
  `).all();
  res.json(employers);
});

// DELETE /api/admin/employers/:id — delete employer account and their submissions
router.delete('/employers/:id', (req, res) => {
  const employer = db.prepare('SELECT id FROM employers WHERE id = ?').get(req.params.id);
  if (!employer) return res.status(404).json({ error: 'Employer not found' });

  db.prepare('DELETE FROM submissions WHERE employer_id = ?').run(req.params.id);
  db.prepare('DELETE FROM employers WHERE id = ?').run(req.params.id);
  res.json({ message: 'Employer and their submissions deleted' });
});

// PATCH /api/admin/employers/:id/reset-password — reset employer password
router.patch('/employers/:id/reset-password', (req, res) => {
  const { new_password } = req.body;

  if (!new_password || new_password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const employer = db.prepare('SELECT id, company_name FROM employers WHERE id = ?').get(req.params.id);
  if (!employer) return res.status(404).json({ error: 'Employer not found' });

  const hash = bcrypt.hashSync(new_password, 10);
  db.prepare('UPDATE employers SET password = ? WHERE id = ?').run(hash, req.params.id);

  res.json({ message: `Password reset for ${employer.company_name}` });
});

// GET /api/admin/stats — dashboard statistics
router.get('/stats', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as cnt FROM submissions').get().cnt;
  const pending = db.prepare("SELECT COUNT(*) as cnt FROM submissions WHERE status = 'pending'").get().cnt;
  const approved = db.prepare("SELECT COUNT(*) as cnt FROM submissions WHERE status = 'approved'").get().cnt;
  const rejected = db.prepare("SELECT COUNT(*) as cnt FROM submissions WHERE status = 'rejected'").get().cnt;
  const employerCount = db.prepare('SELECT COUNT(*) as cnt FROM employers').get().cnt;

  res.json({ total, pending, approved, rejected, employerCount });
});

module.exports = router;
