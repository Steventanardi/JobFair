const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Submission columns excluding logo_path (too large for list views)
const SUB_LIST_COLS = `
  s.id, s.employer_id, s.company_name, s.industry, s.contact_person, s.contact_email,
  s.contact_phone, s.company_intro, s.job_positions, s.requirements, s.benefits,
  s.activity_category, s.is_previous_participant, s.booth_signboard_name,
  s.ceo_name, s.tax_id, s.main_products, s.internship_cooperation,
  s.target_departments, s.mailing_address, s.attendee_main, s.attendee_count,
  s.lunch_box_non_veg, s.lunch_box_veg, s.has_presentation_need,
  s.has_shuttle_need, s.shuttle_details, s.raffle_prizes,
  s.parking_spaces, s.other_requirements, s.group_type, s.establishment_date,
  s.status, s.admin_notes, s.booth_number, s.submitted_at, s.reviewed_at,
  e.email as employer_email
`;

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

// GET /api/admin/submissions — list all submissions with optional filters + pagination
router.get('/submissions', async (req, res) => {
  const { status, search, category } = req.query;
  const limit = Math.min(parseInt(req.query.limit) || 100, 500);
  const offset = Math.max(parseInt(req.query.offset) || 0, 0);

  const conditions = [];
  const params = [];
  let p = 1;

  if (status && ['pending', 'approved', 'rejected'].includes(status)) {
    conditions.push(`s.status = $${p++}`);
    params.push(status);
  }

  if (category && ['Recruitment', 'Resume', 'PublicWelfare'].includes(category)) {
    conditions.push(`s.activity_category = $${p++}`);
    params.push(category);
  }

  if (search) {
    conditions.push(`(s.company_name ILIKE $${p} OR s.contact_person ILIKE $${p + 1} OR s.contact_email ILIKE $${p + 2})`);
    const term = `%${search}%`;
    params.push(term, term, term);
    p += 3;
  }

  const where = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
  const listSql = `SELECT ${SUB_LIST_COLS} FROM submissions s LEFT JOIN employers e ON s.employer_id = e.id${where} ORDER BY s.submitted_at DESC LIMIT $${p++} OFFSET $${p++}`;
  const countSql = `SELECT COUNT(*) as total FROM submissions s${where}`;

  params.push(limit, offset);

  try {
    const [{ rows }, { rows: countRows }] = await Promise.all([
      db.query(listSql, params),
      db.query(countSql, params.slice(0, params.length - 2))
    ]);
    res.json({ submissions: rows, total: parseInt(countRows[0].total) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/submissions/export — download CSV (respects status/search filters)
router.get('/submissions/export', async (req, res) => {
  const { status, search, category } = req.query;

  const conditions = [];
  const params = [];
  let p = 1;

  if (status && ['pending', 'approved', 'rejected'].includes(status)) {
    conditions.push(`s.status = $${p++}`);
    params.push(status);
  }

  if (category && ['Recruitment', 'Resume', 'PublicWelfare'].includes(category)) {
    conditions.push(`s.activity_category = $${p++}`);
    params.push(category);
  }

  if (search) {
    conditions.push(`(s.company_name ILIKE $${p} OR s.contact_person ILIKE $${p + 1} OR s.contact_email ILIKE $${p + 2})`);
    const term = `%${search}%`;
    params.push(term, term, term);
    p += 3;
  }

  const where = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';

  try {
    const { rows } = await db.query(`
      SELECT ${SUB_LIST_COLS}
      FROM submissions s
      LEFT JOIN employers e ON s.employer_id = e.id
      ${where}
      ORDER BY s.company_name ASC
    `, params);

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
    
    // Sanitize a CSV field: escape quotes, strip newlines, block formula injection
    const esc = (val) => {
      if (val === null || val === undefined) return '""';
      let str = String(val).replace(/\r?\n|\r/g, ' ');
      if (/^[=+\-@|\t\r]/.test(str)) str = "'" + str;
      return `"${str.replace(/"/g, '""')}"`;
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

  if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be "pending", "approved", or "rejected"' });
  }

  if (admin_notes && admin_notes.length > 1000) {
    return res.status(400).json({ error: 'Admin notes must be 1000 characters or fewer' });
  }

  try {
    const { rows } = await db.query('SELECT id FROM submissions WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Submission not found' });

    await db.query(`
      UPDATE submissions SET status = $1, admin_notes = $2, reviewed_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [status, admin_notes || null, req.params.id]);

    await logAction(req.session.user.id, `Changed status to ${status}`, 'submission', req.params.id, admin_notes);

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
    await logAction(req.session.user.id, `Assigned booth ${booth_number || 'NULL'}`, 'submission', req.params.id);
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
    await logAction(req.session.user.id, 'Deleted submission', 'submission', req.params.id);
    res.json({ message: 'Submission deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/employers — list all employer accounts (with optional search)
router.get('/employers', async (req, res) => {
  const search = (req.query.search || '').trim();
  const limit = Math.min(parseInt(req.query.limit) || 100, 500);
  const offset = Math.max(parseInt(req.query.offset) || 0, 0);

  try {
    const params = [];
    let where = '';
    if (search) {
      where = `WHERE (e.email ILIKE $1 OR e.company_name ILIKE $1)`;
      params.push(`%${search}%`);
    }
    params.push(limit, offset);
    const limitIdx = params.length - 1;
    const offsetIdx = params.length;

    const { rows } = await db.query(`
      SELECT e.id, e.email, e.company_name, e.created_at,
        (SELECT COUNT(*) FROM submissions s WHERE s.employer_id = e.id) as submission_count
      FROM employers e
      ${where}
      ORDER BY e.created_at DESC
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/employers/:id — delete employer account and their submissions
router.delete('/employers/:id', async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT id FROM employers WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Employer not found' });
    }
    await client.query('DELETE FROM submissions WHERE employer_id = $1', [req.params.id]);
    await client.query('DELETE FROM employers WHERE id = $1', [req.params.id]);
    await client.query('COMMIT');
    await logAction(req.session.user.id, 'Deleted employer and their submissions', 'employer', req.params.id);
    res.json({ message: 'Employer and their submissions deleted' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
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

    const hash = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE employers SET password_hash = $1 WHERE id = $2', [hash, req.params.id]);
    await logAction(req.session.user.id, 'Reset employer password', 'employer', req.params.id);

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

// GET /api/admin/settings — get all settings as key-value object
router.get('/settings', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT key, value FROM settings');
    const result = {};
    rows.forEach(r => { result[r.key] = r.value; });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/settings — upsert settings
router.post('/settings', async (req, res) => {
  const allowed = ['registration_status', 'registration_deadline'];
  try {
    for (const [key, value] of Object.entries(req.body)) {
      if (!allowed.includes(key)) continue;
      await db.query(
        'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
        [key, value ?? '']
      );
    }
    await logAction(req.session.user.id, 'Updated settings', 'settings', null, JSON.stringify(req.body));
    res.json({ message: 'Settings saved' });
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

// GET /api/admin/logs — audit logs with pagination + search/filter
router.get('/logs', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 50, 200);
  const offset = Math.max(parseInt(req.query.offset) || 0, 0);
  const { search, target_type, date_from, date_to } = req.query;

  const conditions = [];
  const params = [];
  let p = 1;

  if (search) {
    conditions.push(`(l.action ILIKE $${p} OR l.details ILIKE $${p + 1} OR a.username ILIKE $${p + 2})`);
    const term = `%${search}%`;
    params.push(term, term, term);
    p += 3;
  }
  if (target_type) {
    conditions.push(`l.target_type = $${p++}`);
    params.push(target_type);
  }
  if (date_from) {
    conditions.push(`l.created_at >= $${p++}`);
    params.push(date_from);
  }
  if (date_to) {
    conditions.push(`l.created_at < ($${p++}::date + interval '1 day')`);
    params.push(date_to);
  }

  const where = conditions.length ? ' WHERE ' + conditions.join(' AND ') : '';
  params.push(limit, offset);

  try {
    const { rows } = await db.query(`
      SELECT l.*, a.username as admin_name
      FROM admin_logs l
      LEFT JOIN admins a ON l.admin_id = a.id
      ${where}
      ORDER BY l.created_at DESC
      LIMIT $${p++} OFFSET $${p++}
    `, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/admins — list all admin accounts
router.get('/admins', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, username FROM admins ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/admins — create new admin account
router.post('/admins', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  if (username.length < 3 || username.length > 50) {
    return res.status(400).json({ error: 'Username must be 3–50 characters' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  try {
    const { rows: existing } = await db.query('SELECT id FROM admins WHERE username = $1', [username]);
    if (existing.length > 0) return res.status(409).json({ error: 'Username already exists' });

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      'INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, hash]
    );
    await logAction(req.session.user.id, `Created admin account: ${username}`, 'admin', rows[0].id);
    res.json({ message: 'Admin created', id: rows[0].id, username: rows[0].username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/admins/:id — delete an admin account (cannot delete self)
router.delete('/admins/:id', async (req, res) => {
  if (parseInt(req.params.id) === req.session.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }
  try {
    const { rows } = await db.query('SELECT id, username FROM admins WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Admin not found' });

    await db.query('DELETE FROM admins WHERE id = $1', [req.params.id]);
    await logAction(req.session.user.id, `Deleted admin account: ${rows[0].username}`, 'admin', req.params.id);
    res.json({ message: 'Admin deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/me/password — admin changes their own password
router.patch('/me/password', async (req, res) => {
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    return res.status(400).json({ error: 'current_password and new_password are required' });
  }
  if (new_password.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  try {
    const { rows } = await db.query(
      'SELECT id, password_hash FROM admins WHERE id = $1',
      [req.session.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Admin not found' });

    if (!(await bcrypt.compare(current_password, rows[0].password_hash))) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hash = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE admins SET password_hash = $1 WHERE id = $2', [hash, req.session.user.id]);
    await logAction(req.session.user.id, 'Changed own password', 'admin', req.session.user.id);

    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
