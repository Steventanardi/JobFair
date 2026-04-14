const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { requireEmployer } = require('../middleware/auth');

const router = express.Router();

// Multer config for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|webp/;
    const extOk = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowedTypes.test(file.mimetype.split('/')[1]);
    if (extOk || mimeOk) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
});

// POST /api/submissions — create new submission
router.post('/', requireEmployer, upload.single('logo'), async (req, res) => {
  const employer = req.session.user;
  const {
    company_name, industry, contact_person, contact_email,
    contact_phone, company_intro, job_positions, requirements, benefits
  } = req.body;

  if (!company_name || !contact_person || !contact_email) {
    return res.status(400).json({ error: 'Company name, contact person, and contact email are required' });
  }

  const logo_path = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await db.query(`
      INSERT INTO submissions 
      (employer_id, company_name, logo_path, industry, contact_person, contact_email, 
       contact_phone, company_intro, job_positions, requirements, benefits)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `, [
      employer.id, company_name, logo_path, industry || null,
      contact_person, contact_email, contact_phone || null,
      company_intro || null, job_positions || null, requirements || null, benefits || null
    ]);

    res.json({
      message: 'Submission created successfully',
      id: result.rows[0].id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/submissions/mine — get employer's own submissions
router.get('/mine', requireEmployer, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM submissions WHERE employer_id = $1 ORDER BY submitted_at DESC',
      [req.session.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/submissions/:id — get single submission
router.get('/:id', requireEmployer, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM submissions WHERE id = $1 AND employer_id = $2',
      [req.params.id, req.session.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Submission not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/submissions/:id — update submission (only if pending)
router.put('/:id', requireEmployer, upload.single('logo'), async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM submissions WHERE id = $1 AND employer_id = $2',
      [req.params.id, req.session.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Submission not found' });
    const submission = rows[0];

    if (submission.status !== 'pending') {
      return res.status(400).json({ error: 'Can only edit pending submissions' });
    }

    const {
      company_name, industry, contact_person, contact_email,
      contact_phone, company_intro, job_positions, requirements, benefits
    } = req.body;

    const logo_path = req.file ? `/uploads/${req.file.filename}` : submission.logo_path;

    await db.query(`
      UPDATE submissions SET
        company_name = $1, logo_path = $2, industry = $3, contact_person = $4,
        contact_email = $5, contact_phone = $6, company_intro = $7,
        job_positions = $8, requirements = $9, benefits = $10
      WHERE id = $11
    `, [
      company_name || submission.company_name,
      logo_path,
      industry || submission.industry,
      contact_person || submission.contact_person,
      contact_email || submission.contact_email,
      contact_phone || submission.contact_phone,
      company_intro || submission.company_intro,
      job_positions || submission.job_positions,
      requirements || submission.requirements,
      benefits || submission.benefits,
      req.params.id
    ]);

    res.json({ message: 'Submission updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/submissions/:id — delete submission (only if pending)
router.delete('/:id', requireEmployer, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM submissions WHERE id = $1 AND employer_id = $2',
      [req.params.id, req.session.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Submission not found' });
    if (rows[0].status !== 'pending') {
      return res.status(400).json({ error: 'Can only delete pending submissions' });
    }

    await db.query('DELETE FROM submissions WHERE id = $1', [req.params.id]);
    res.json({ message: 'Submission deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
