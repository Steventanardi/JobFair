const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { requireEmployer } = require('../middleware/auth');

const router = express.Router();

// Multer config for logo uploads
// Use memory storage for Vercel Serverless (read-only file system)
const storage = multer.memoryStorage();

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
    contact_phone, company_intro, job_positions, requirements, benefits,
    activity_category, is_previous_participant, booth_signboard_name,
    ceo_name, tax_id, main_products, internship_cooperation,
    target_departments, mailing_address, attendee_main, attendee_count,
    lunch_box_non_veg, lunch_box_veg, has_presentation_need,
    has_shuttle_need, shuttle_details, raffle_prizes,
    parking_spaces, other_requirements, group_type, establishment_date
  } = req.body;

  // Derive contact_person and contact_email from form data or session fallback
  const resolvedContactPerson = contact_person || attendee_main || ceo_name || employer.company_name;
  const resolvedContactEmail = contact_email || employer.email;

  if (!company_name) {
    return res.status(400).json({ error: 'Company name is required' });
  }

  let logo_path = null;
  if (req.file) {
    logo_path = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  }

  try {
    const result = await db.query(`
      INSERT INTO submissions 
      (employer_id, company_name, logo_path, industry, contact_person, contact_email, 
       contact_phone, company_intro, job_positions, requirements, benefits,
       activity_category, is_previous_participant, booth_signboard_name,
       ceo_name, tax_id, main_products, internship_cooperation,
       target_departments, mailing_address, attendee_main, attendee_count,
       lunch_box_non_veg, lunch_box_veg, has_presentation_need,
       has_shuttle_need, shuttle_details, raffle_prizes,
       parking_spaces, other_requirements, group_type, establishment_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32)
      RETURNING id
    `, [
      employer.id, company_name, logo_path, industry || null,
      resolvedContactPerson, resolvedContactEmail, contact_phone || null,
      company_intro || null, job_positions || null, requirements || null, benefits || null,
      activity_category || null, is_previous_participant || null, booth_signboard_name || null,
      ceo_name || null, tax_id || null, main_products || null, internship_cooperation || null,
      target_departments || null, mailing_address || null, attendee_main || null, parseInt(attendee_count) || null,
      parseInt(lunch_box_non_veg) || 0, parseInt(lunch_box_veg) || 0, has_presentation_need || null,
      has_shuttle_need || null, shuttle_details || null, raffle_prizes || null,
      parseInt(parking_spaces) || 0, other_requirements || null, group_type || null, establishment_date || null
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

    if (submission.status === 'rejected') {
      return res.status(400).json({ error: 'Rejected submissions cannot be edited' });
    }

    const {
      company_name, industry, contact_person, contact_email,
      contact_phone, company_intro, job_positions, requirements, benefits,
      activity_category, is_previous_participant, booth_signboard_name,
      ceo_name, tax_id, main_products, internship_cooperation,
      target_departments, mailing_address, attendee_main, attendee_count,
      lunch_box_non_veg, lunch_box_veg, has_presentation_need,
      has_shuttle_need, shuttle_details, raffle_prizes,
      parking_spaces, other_requirements, group_type, establishment_date
    } = req.body;

    let logo_path = submission.logo_path;
    if (req.file) {
      logo_path = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    await db.query(`
      UPDATE submissions SET
        company_name = $1, logo_path = $2, industry = $3, contact_person = $4,
        contact_email = $5, contact_phone = $6, company_intro = $7,
        job_positions = $8, requirements = $9, benefits = $10,
        activity_category = $11, is_previous_participant = $12, booth_signboard_name = $13,
        ceo_name = $14, tax_id = $15, main_products = $16, internship_cooperation = $17,
        target_departments = $18, mailing_address = $19, attendee_main = $20,
        attendee_count = $21, lunch_box_non_veg = $22, lunch_box_veg = $23, 
        has_presentation_need = $24, has_shuttle_need = $25, shuttle_details = $26, 
        raffle_prizes = $27, parking_spaces = $28, other_requirements = $29,
        group_type = $30, establishment_date = $31
      WHERE id = $32
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
      activity_category || submission.activity_category,
      is_previous_participant || submission.is_previous_participant,
      booth_signboard_name || submission.booth_signboard_name,
      ceo_name || submission.ceo_name,
      tax_id || submission.tax_id,
      main_products || submission.main_products,
      internship_cooperation || submission.internship_cooperation,
      target_departments || submission.target_departments,
      mailing_address || submission.mailing_address,
      attendee_main || submission.attendee_main,
      parseInt(attendee_count) || submission.attendee_count,
      parseInt(lunch_box_non_veg) ?? submission.lunch_box_non_veg,
      parseInt(lunch_box_veg) ?? submission.lunch_box_veg,
      has_presentation_need || submission.has_presentation_need,
      has_shuttle_need || submission.has_shuttle_need,
      shuttle_details || submission.shuttle_details,
      raffle_prizes || submission.raffle_prizes,
      parseInt(parking_spaces) ?? submission.parking_spaces,
      other_requirements || submission.other_requirements,
      group_type || submission.group_type,
      establishment_date || submission.establishment_date,
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
