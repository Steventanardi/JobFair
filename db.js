require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/jobfair',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const initDB = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS employers (
        id            SERIAL PRIMARY KEY,
        email         TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        company_name  TEXT NOT NULL,
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS submissions (
        id              SERIAL PRIMARY KEY,
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
        submitted_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at     TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admins (
        id            SERIAL PRIMARY KEY,
        username      TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS announcements (
        id          SERIAL PRIMARY KEY,
        title       TEXT NOT NULL,
        content     TEXT NOT NULL,
        priority    INTEGER DEFAULT 0,
        is_pinned   INTEGER DEFAULT 0,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default admin if not exists
    const { rows: admins } = await db.query('SELECT id FROM admins WHERE username = $1', ['admin']);
    if (admins.length === 0) {
      const hash = bcrypt.hashSync('nqu2025', 10);
      await db.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', ['admin', hash]);
      console.log('Default admin seeded: admin / nqu2025');
    }

    // Seed sample announcements if empty
    const { rows: annCount } = await db.query('SELECT COUNT(*) as cnt FROM announcements');
    if (parseInt(annCount[0].cnt) === 0) {
      const sql = 'INSERT INTO announcements (title, content, priority, is_pinned) VALUES ($1, $2, $3, $4)';
      await db.query(sql, [
        'NQU Job Fair — Registration Now Open',
        'We are pleased to announce that employer registration for the National Quemoy University Job Fair is now open. Register your company to connect with top talent from NQU.',
        10, 1
      ]);
      await db.query(sql, [
        'Booth Information',
        'Each approved employer will be assigned a booth space. Booth assignments will be announced after the registration deadline.',
        3, 0
      ]);
      console.log('Sample announcements seeded.');
    }
  } catch (err) {
    console.error('Database initialization failed:', err);
  }
};

initDB();

module.exports = db;
