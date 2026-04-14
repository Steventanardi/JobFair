const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/announcements — public, list all
router.get('/', (req, res) => {
  const announcements = db.prepare(
    'SELECT * FROM announcements ORDER BY is_pinned DESC, priority DESC, created_at DESC'
  ).all();
  res.json(announcements);
});

// POST /api/announcements — admin only
router.post('/', requireAdmin, (req, res) => {
  const { title, content, priority, is_pinned } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const result = db.prepare(
    'INSERT INTO announcements (title, content, priority, is_pinned) VALUES (?, ?, ?, ?)'
  ).run(title, content, priority || 0, is_pinned ? 1 : 0);

  res.json({ message: 'Announcement created', id: result.lastInsertRowid });
});

// PUT /api/announcements/:id — admin only
router.put('/:id', requireAdmin, (req, res) => {
  const { title, content, priority, is_pinned } = req.body;

  const existing = db.prepare('SELECT id FROM announcements WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Announcement not found' });

  db.prepare(
    'UPDATE announcements SET title = ?, content = ?, priority = ?, is_pinned = ? WHERE id = ?'
  ).run(title, content, priority || 0, is_pinned ? 1 : 0, req.params.id);

  res.json({ message: 'Announcement updated' });
});

// DELETE /api/announcements/:id — admin only
router.delete('/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT id FROM announcements WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Announcement not found' });

  db.prepare('DELETE FROM announcements WHERE id = ?').run(req.params.id);
  res.json({ message: 'Announcement deleted' });
});

module.exports = router;
