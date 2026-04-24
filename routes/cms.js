const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|webp|pdf|doc|docx/;
    const extOk = allowedTypes.test(path.extname(file.originalname).toLowerCase().slice(1));
    const mimeOk = allowedTypes.test(file.mimetype.split('/')[1]);
    if (extOk || mimeOk) return cb(null, true);
    cb(new Error('Only image and document files are allowed'));
  }
});

// ═══════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════════════

// GET /api/cms/pages - Get all CMS pages
router.get('/pages', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM cms_pages WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/cms/pages/:slug - Get single CMS page by slug
router.get('/pages/:slug', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM cms_pages WHERE slug = $1 AND is_active = 1',
      [req.params.slug]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Page not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/cms/settings - Get all CMS settings
router.get('/settings', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM cms_settings ORDER BY group_name, id');
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/cms/navigation - Get active navigation items
router.get('/navigation', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM cms_navigation WHERE is_active = 1 ORDER BY position ASC, id ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/cms/media - List all media files
router.get('/media', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const { rows } = await db.query(
      'SELECT * FROM cms_media ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    const { rows: countRows } = await db.query('SELECT COUNT(*) as total FROM cms_media');
    res.json({ items: rows, total: parseInt(countRows[0].total) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════
// ADMIN ROUTES (Authenticated)
// ═══════════════════════════════════════════════════════════════════

// GET /api/cms/admin/pages - Admin: Get all CMS pages
router.get('/admin/pages', requireAdmin, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM cms_pages ORDER BY sort_order ASC, id ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/cms/admin/pages - Admin: Create page
router.post('/admin/pages', requireAdmin, async (req, res) => {
  const { slug, title, content, meta_title, meta_desc, sort_order, is_active } = req.body;
  if (!slug || !title) {
    return res.status(400).json({ error: 'Slug and title are required' });
  }
  try {
    const { rows } = await db.query(
      `INSERT INTO cms_pages (slug, title, content, meta_title, meta_desc, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [slug, title, content || '', meta_title || '', meta_desc || '', sort_order || 0, is_active !== false ? 1 : 0]
    );
    res.json({ message: 'Page created', id: rows[0].id });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Slug already exists' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/cms/admin/pages/:id - Admin: Update page
router.put('/admin/pages/:id', requireAdmin, async (req, res) => {
  const { slug, title, content, meta_title, meta_desc, sort_order, is_active } = req.body;
  try {
    const { rows } = await db.query('SELECT id FROM cms_pages WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Page not found' });

    await db.query(
      `UPDATE cms_pages SET slug = $1, title = $2, content = $3, meta_title = $4, meta_desc = $5,
       sort_order = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8`,
      [slug, title, content || '', meta_title || '', meta_desc || '', sort_order || 0, is_active !== false ? 1 : 0, req.params.id]
    );
    res.json({ message: 'Page updated' });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Slug already exists' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/cms/admin/pages/:id - Admin: Delete page
router.delete('/admin/pages/:id', requireAdmin, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id FROM cms_pages WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Page not found' });

    await db.query('DELETE FROM cms_pages WHERE id = $1', [req.params.id]);
    res.json({ message: 'Page deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/cms/admin/media - Admin: Upload media
router.post('/admin/media', requireAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const urlPath = `/uploads/${req.file.filename}`;
    const { rows } = await db.query(
      `INSERT INTO cms_media (filename, original_name, mime_type, file_size, url_path)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [req.file.filename, req.file.originalname, req.file.mimetype, req.file.size, urlPath]
    );
    res.json({ message: 'File uploaded', id: rows[0].id, url: urlPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/cms/admin/media/:id - Admin: Update media metadata
router.put('/admin/media/:id', requireAdmin, async (req, res) => {
  const { alt_text, caption } = req.body;
  try {
    const { rows } = await db.query('SELECT id FROM cms_media WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Media not found' });

    await db.query(
      'UPDATE cms_media SET alt_text = $1, caption = $2 WHERE id = $3',
      [alt_text || '', caption || '', req.params.id]
    );
    res.json({ message: 'Media updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/cms/admin/media/:id - Admin: Delete media
router.delete('/admin/media/:id', requireAdmin, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM cms_media WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Media not found' });

    const filePath = path.join(uploadsDir, rows[0].filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await db.query('DELETE FROM cms_media WHERE id = $1', [req.params.id]);
    res.json({ message: 'Media deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/cms/admin/settings - Admin: Get all settings
router.get('/admin/settings', requireAdmin, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM cms_settings ORDER BY group_name, id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/cms/admin/settings - Admin: Update settings (bulk)
router.put('/admin/settings', requireAdmin, async (req, res) => {
  const updates = req.body;
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ error: 'Invalid settings data' });
  }

  try {
    for (const [key, value] of Object.entries(updates)) {
      await db.query(
        `INSERT INTO cms_settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
        [key, value || '']
      );
    }
    res.json({ message: 'Settings updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/cms/admin/navigation - Admin: Get all navigation items
router.get('/admin/navigation', requireAdmin, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM cms_navigation ORDER BY position ASC, id ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/cms/admin/navigation - Admin: Create navigation item
router.post('/admin/navigation', requireAdmin, async (req, res) => {
  const { label, url, icon, position, is_active, target_blank, parent_id } = req.body;
  if (!label || !url) {
    return res.status(400).json({ error: 'Label and URL are required' });
  }
  try {
    const { rows } = await db.query(
      `INSERT INTO cms_navigation (label, url, icon, position, is_active, target_blank, parent_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [label, url, icon || '', position || 0, is_active !== false ? 1 : 0, target_blank ? 1 : 0, parent_id || null]
    );
    res.json({ message: 'Navigation item created', id: rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/cms/admin/navigation/:id - Admin: Update navigation item
router.put('/admin/navigation/:id', requireAdmin, async (req, res) => {
  const { label, url, icon, position, is_active, target_blank, parent_id } = req.body;
  try {
    const { rows } = await db.query('SELECT id FROM cms_navigation WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Navigation item not found' });

    await db.query(
      `UPDATE cms_navigation SET label = $1, url = $2, icon = $3, position = $4,
       is_active = $5, target_blank = $6, parent_id = $7 WHERE id = $8`,
      [label, url, icon || '', position || 0, is_active !== false ? 1 : 0, target_blank ? 1 : 0, parent_id || null, req.params.id]
    );
    res.json({ message: 'Navigation item updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/cms/admin/navigation/:id - Admin: Delete navigation item
router.delete('/admin/navigation/:id', requireAdmin, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id FROM cms_navigation WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Navigation item not found' });

    await db.query('DELETE FROM cms_navigation WHERE id = $1', [req.params.id]);
    res.json({ message: 'Navigation item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/cms/admin/stats - Admin: Get CMS stats
router.get('/admin/stats', requireAdmin, async (req, res) => {
  try {
    const { rows: pageRows } = await db.query('SELECT COUNT(*) as cnt FROM cms_pages');
    const { rows: mediaRows } = await db.query('SELECT COUNT(*) as cnt FROM cms_media');
    const { rows: navRows } = await db.query('SELECT COUNT(*) as cnt FROM cms_navigation');
    const { rows: settingsRows } = await db.query('SELECT COUNT(*) as cnt FROM cms_settings');
    res.json({
      pages: parseInt(pageRows[0].cnt),
      media: parseInt(mediaRows[0].cnt),
      navigation: parseInt(navRows[0].cnt),
      settings: parseInt(settingsRows[0].cnt)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;