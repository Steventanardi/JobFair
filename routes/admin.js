const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

const adminLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 120,
  message: { error: 'Too many requests, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// All routes require admin authentication + rate limiting
router.use(adminLimiter);
router.use(requireAdmin);

// GET /api/admin/submissions — list all submissions with optional filters
router.get('/submissions', async (req, res) => {
  const { status, search } = req.query;
  let sql = `
    SELECT 
      s.*, e.email as employer_email 
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

// GET /api/admin/submissions/export — download CSV
router.get('/submissions/export', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        s.*, e.email as employer_email 
      FROM submissions s 
      LEFT JOIN employers e ON s.employer_id = e.id
      ORDER BY s.company_name ASC
    `);

    if (rows.length === 0) {
      return res.status(404).send('No submissions found');
    }

    // CSV Headers
    const headers = [
      'ID', 'Status', 'Booth No', 'Activity Category', 'Prev Participant',
      'Group Type', 'Establishment Date',
      'Company Name', 'Booth Signboard', 'CEO Name', 'Tax ID', 'Industry', 
      'Introduction', 'Main Products', 'Internship', 'Target Depts',
      'Contact Person', 'Email', 'Phone', 'Mailing Address',
      'Job Positions', 'Requirements', 'Benefits',
      'Consolidated Attendee', 'Attendee Count',
      'Lunch (Non-Veg)', 'Lunch (Veg)', 'Presentation Need', 'Shuttle Need',
      'Shuttle Details', 'Raffle Prizes', 'Parking', 'Other Req', 'Submitted At'
    ];
    
    // Helper to sanitize CSV field — escapes quotes and prevents formula injection
    const esc = (val) => {
      if (val === null || val === undefined) return '""';
      let s = String(val);
      if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
      return `"${s.replace(/"/g, '""')}"`;
    };

    // CSV Rows
    const csvRows = rows.map(row => {
      return [
        row.id,
        row.status,
        esc(row.booth_number),
        esc(row.activity_category),
        esc(row.is_previous_participant),
        esc(row.group_type),
        esc(row.establishment_date),
        esc(row.company_name),
        esc(row.booth_signboard_name),
        esc(row.ceo_name),
        esc(row.tax_id),
        esc(row.industry),
        esc(row.company_intro),
        esc(row.main_products),
        esc(row.internship_cooperation),
        esc(row.target_departments),
        esc(row.contact_person),
        esc(row.contact_email),
        esc(row.contact_phone),
        esc(row.mailing_address),
        esc(row.job_positions),
        esc(row.requirements),
        esc(row.benefits),
        esc(row.attendee_main),
        row.attendee_count,
        row.lunch_box_non_veg,
        row.lunch_box_veg,
        esc(row.has_presentation_need),
        esc(row.has_shuttle_need),
        esc(row.shuttle_details),
        esc(row.raffle_prizes),
        row.parking_spaces,
        esc(row.other_requirements),
        new Date(row.submitted_at).toISOString().split('T')[0]
      ].join(',');
    });

    const csvString = headers.join(',') + '\n' + csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="jobfair-submissions-full.csv"');
    // Add BOM for Excel UTF-8 support
    res.send('\uFEFF' + csvString);
  } catch (err) {
    console.error('Export Error:', err);
    res.status(500).send('Server Error during export');
  }
});

// GET /api/admin/submissions/:id — get single submission
router.get('/submissions/:id', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT s.*, e.email as employer_email
      FROM submissions s
      LEFT JOIN employers e ON s.employer_id = e.id
      WHERE s.id = $1
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Submission not found' });
    res.json(rows[0]);
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

    await logAction(req.session.userId, `Changed status to ${status}`, 'submission', req.params.id, admin_notes);

    res.json({ message: `Submission ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/submissions/:id/booth — assign booth number
router.patch('/submissions/:id/booth', async (req, res) => {
  const { booth_number } = req.body;

  if (booth_number !== undefined && booth_number !== null && booth_number !== '') {
    if (!/^[A-Za-z0-9\-]{1,10}$/.test(booth_number)) {
      return res.status(400).json({ error: 'Booth number must be 1–10 alphanumeric characters' });
    }
  }

  try {
    const { rows } = await db.query('SELECT id, status FROM submissions WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Submission not found' });
    if (rows[0].status !== 'approved') {
      return res.status(400).json({ error: 'Can only assign booth to approved submissions' });
    }

    if (booth_number) {
      const { rows: dup } = await db.query(
        'SELECT id FROM submissions WHERE booth_number = $1 AND id != $2',
        [booth_number, req.params.id]
      );
      if (dup.length > 0) {
        return res.status(409).json({ error: `Booth ${booth_number} is already assigned to another submission` });
      }
    }

    await db.query('UPDATE submissions SET booth_number = $1 WHERE id = $2', [booth_number || null, req.params.id]);
    await logAction(req.session.userId, `Assigned booth ${booth_number || 'NULL'}`, 'submission', req.params.id);
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
    await logAction(req.session.userId, 'Deleted submission', 'submission', req.params.id);
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
    await logAction(req.session.userId, 'Deleted employer and their submissions', 'employer', req.params.id);
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
    const [{ rows: subRows }, { rows: empRows }] = await Promise.all([
      db.query(`
        SELECT
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE status = 'pending')  AS pending,
          COUNT(*) FILTER (WHERE status = 'approved') AS approved,
          COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
        FROM submissions
      `),
      db.query('SELECT COUNT(*) AS cnt FROM employers')
    ]);

    const s = subRows[0];
    res.json({
      total:         parseInt(s.total),
      pending:       parseInt(s.pending),
      approved:      parseInt(s.approved),
      rejected:      parseInt(s.rejected),
      employerCount: parseInt(empRows[0].cnt)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Log action for audit trail
async function logAction(adminId, action, targetType, targetId, details) {
  try {
    await db.query(`
      INSERT INTO admin_logs (admin_id, action, target_type, target_id, details)
      VALUES ($1, $2, $3, $4, $5)
    `, [adminId, action, targetType, targetId, details]);
  } catch (err) {
    console.error('Audit Log Error:', err);
  }
}

// GET /api/admin/analytics — aggregated data for charts
router.get('/analytics', async (req, res) => {
  try {
    const [
      { rows: statusRows },
      { rows: categoryRows },
      { rows: logisticRows },
      { rows: industryRows }
    ] = await Promise.all([
      db.query(`SELECT status, COUNT(*) as count FROM submissions GROUP BY status`),
      db.query(`SELECT activity_category, COUNT(*) as count FROM submissions GROUP BY activity_category`),
      db.query(`
        SELECT 
          SUM(lunch_box_non_veg) as lunch_non_veg, 
          SUM(lunch_box_veg) as lunch_veg, 
          SUM(parking_spaces) as parking
        FROM submissions
      `),
      db.query(`SELECT industry, COUNT(*) as count FROM submissions GROUP BY industry ORDER BY count DESC LIMIT 5`)
    ]);

    res.json({
      statusDistribution: statusRows,
      categoryDistribution: categoryRows,
      logistics: logisticRows[0],
      topIndustries: industryRows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/logs — recent audit logs
router.get('/logs', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT l.*, a.username as admin_name
      FROM admin_logs l
      LEFT JOIN admins a ON l.admin_id = a.id
      ORDER BY l.created_at DESC
      LIMIT 50
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
