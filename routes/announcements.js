const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/announcements — public, list all
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM announcements ORDER BY is_pinned DESC, priority DESC, created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/announcements — admin only
router.post('/', requireAdmin, async (req, res) => {
  const { title, content, priority, is_pinned } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO announcements (title, content, priority, is_pinned) VALUES ($1, $2, $3, $4) RETURNING id',
      [title, content, priority || 0, is_pinned ? 1 : 0]
    );

    res.json({ message: 'Announcement created', id: rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/announcements/:id — admin only
router.put('/:id', requireAdmin, async (req, res) => {
  const { title, content, priority, is_pinned } = req.body;

  try {
    const { rows } = await db.query('SELECT id FROM announcements WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Announcement not found' });

    await db.query(
      'UPDATE announcements SET title = $1, content = $2, priority = $3, is_pinned = $4 WHERE id = $5',
      [title, content, priority || 0, is_pinned ? 1 : 0, req.params.id]
    );

    res.json({ message: 'Announcement updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/announcements/:id — admin only
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id FROM announcements WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Announcement not found' });

    await db.query('DELETE FROM announcements WHERE id = $1', [req.params.id]);
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
