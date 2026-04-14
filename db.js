const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'jobfair.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS employers (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    company_name  TEXT NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    employer_id     INTEGER NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
    company_name    TEXT NOT NULL,
    logo_path       TEXT,
    industry        TEXT,
    contact_person  TEXT NOT NULL,
    contact_email   TEXT NOT NULL,
    contact_phone   TEXT,
    company_intro   TEXT,
    job_positions   TEXT,
    requirements    TEXT,
    benefits        TEXT,
    status          TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
    admin_notes     TEXT,
    booth_number    TEXT,
    submitted_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at     DATETIME
  );

  CREATE TABLE IF NOT EXISTS admins (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    content     TEXT NOT NULL,
    priority    INTEGER DEFAULT 0,
    is_pinned   INTEGER DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

`);

// Seed default admin if not exists
const existingAdmin = db.prepare('SELECT id FROM admins WHERE username = ?').get('admin');
if (!existingAdmin) {
  const hash = bcrypt.hashSync('nqu2025', 10);
  db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run('admin', hash);
  console.log('Default admin seeded: admin / nqu2025');
}

// Seed sample announcements if empty
const announcementCount = db.prepare('SELECT COUNT(*) as cnt FROM announcements').get();
if (announcementCount.cnt === 0) {
  const seedAnnouncements = db.prepare(`
    INSERT INTO announcements (title, content, priority, is_pinned) VALUES (?, ?, ?, ?)
  `);
  seedAnnouncements.run(
    'NQU Job Fair — Registration Now Open',
    'We are pleased to announce that employer registration for the National Quemoy University Job Fair is now open. Register your company to connect with top talent from NQU.',
    10, 1
  );
  seedAnnouncements.run(
    'Booth Information',
    'Each approved employer will be assigned a booth space. Booth assignments will be announced after the registration deadline.',
    3, 0
  );
  console.log('Sample announcements seeded.');
}

module.exports = db;
