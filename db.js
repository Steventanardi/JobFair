// Load .env first, then .env.local with override so it takes precedence (Next.js style)
require('dotenv').config();
require('dotenv').config({ path: '.env.local', override: true });


const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Support all common Vercel/Supabase/Neon env var names
// Postgres connection strings (postgresql://) are checked before HTTP-only URLs (SUPABASE_URL, DATABASE_SUPABASE_URL)
let connectionString =
  process.env.DATABASE_URL ||
  process.env.DATABASE_POSTGRES_URL ||
  process.env.DATABASE_POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.SUPABASE_DB_URL ||
  process.env.DATABASE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  process.env.STORAGE_URL ||
  process.env.NEON_DATABASE_URL;

// If we don't have a valid postgres URL, try to build one from components (common in some Vercel setups)
if (!connectionString || connectionString.startsWith('http')) {
  const host = process.env.DATABASE_POSTGRES_HOST || process.env.POSTGRES_HOST;
  const user = process.env.DATABASE_POSTGRES_USER || process.env.POSTGRES_USER;
  const password = process.env.DATABASE_POSTGRES_PASSWORD || process.env.POSTGRES_PASSWORD;
  const database = process.env.DATABASE_POSTGRES_DATABASE || process.env.POSTGRES_DATABASE || 'jobfair';
  const port = process.env.DATABASE_POSTGRES_PORT || process.env.POSTGRES_PORT || '5432';

  if (host && user && password) {
    connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
  } else {
    // Final fallback for local development
    connectionString = 'postgresql://postgres:postgres@localhost:5432/jobfair';
  }
}

const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
console.log('DB init at:', new Date().toISOString());
console.log('DB env var found:', Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('POSTGRES') || k.includes('SUPABASE') || k.includes('NEON')).join(', ') || 'NONE');
console.log('DB connection candidate:', connectionString.split('@')[1] ? `...@${connectionString.split('@')[1]}` : connectionString.substring(0, 30) + '...');

// Remove sslmode=require if present because it overrides pg's ssl connection properties 
// and triggers "self-signed certificate in certificate chain" errors on Vercel Postgres endpoints
if (connectionString) {
  try {
    const parsed = new URL(connectionString);
    parsed.searchParams.delete('sslmode');
    connectionString = parsed.toString();
  } catch (e) {
    // Ignore invalid URL
  }
}

const db = new Pool({
  connectionString,
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000 // Increased to 10s for slow cold starts
});

// Original query for internal use
db.rawQuery = db.query.bind(db);


const initDB = async () => {
  try {
    // Session table for connect-pg-simple
    await db.rawQuery(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      )
    `);
    await db.rawQuery(`CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire")`);

    await db.rawQuery(`
      CREATE TABLE IF NOT EXISTS settings (
        key   TEXT PRIMARY KEY,
        value TEXT
      )
    `);

    await db.rawQuery(`
      CREATE TABLE IF NOT EXISTS employers (
        id            SERIAL PRIMARY KEY,
        email         TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        company_name  TEXT NOT NULL,
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.rawQuery(`
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
        activity_category       TEXT,
        is_previous_participant TEXT,
        booth_signboard_name    TEXT,
        ceo_name                TEXT,
        tax_id                  TEXT,
        main_products           TEXT,
        internship_cooperation  TEXT,
        target_departments      TEXT,
        mailing_address         TEXT,
        attendee_main_name      TEXT,
        attendee_main_title     TEXT,
        attendee_main_phone     TEXT,
        attendee_count          INTEGER,
        lunch_box_non_veg       INTEGER,
        lunch_box_veg           INTEGER,
        has_presentation_need   TEXT,
        has_shuttle_need        TEXT,
        shuttle_details         TEXT,
        raffle_prizes           TEXT,
        parking_spaces          INTEGER,
        other_requirements      TEXT,
        group_type              TEXT,
        establishment_date      TEXT,
        attendee_main          TEXT,
        status          TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
        admin_notes     TEXT,
        booth_number    TEXT,
        submitted_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at     TIMESTAMP
      )
    `);

    await db.rawQuery(`
      CREATE TABLE IF NOT EXISTS admins (
        id            SERIAL PRIMARY KEY,
        username      TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
      )
    `);

    await db.rawQuery(`
      CREATE TABLE IF NOT EXISTS admin_logs (
        id          SERIAL PRIMARY KEY,
        admin_id    INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
        action      TEXT NOT NULL,
        target_type TEXT,
        target_id   INTEGER,
        details     TEXT,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.rawQuery(`
      CREATE TABLE IF NOT EXISTS announcements (
        id          SERIAL PRIMARY KEY,
        title       TEXT NOT NULL,
        content     TEXT NOT NULL,
        priority    INTEGER DEFAULT 0,
        is_pinned   INTEGER DEFAULT 0,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.rawQuery(`
      CREATE TABLE IF NOT EXISTS cms_pages (
        id          SERIAL PRIMARY KEY,
        slug        TEXT NOT NULL UNIQUE,
        title       TEXT NOT NULL,
        content     TEXT,
        meta_title  TEXT,
        meta_desc   TEXT,
        sort_order  INTEGER DEFAULT 0,
        is_active   INTEGER DEFAULT 1,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.rawQuery(`
      CREATE TABLE IF NOT EXISTS cms_media (
        id          SERIAL PRIMARY KEY,
        filename    TEXT NOT NULL,
        original_name TEXT,
        mime_type   TEXT,
        file_size   INTEGER,
        url_path    TEXT NOT NULL,
        alt_text    TEXT,
        caption     TEXT,
        width       INTEGER,
        height      INTEGER,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.rawQuery(`
      CREATE TABLE IF NOT EXISTS cms_navigation (
        id          SERIAL PRIMARY KEY,
        label       TEXT NOT NULL,
        url         TEXT NOT NULL,
        icon        TEXT,
        position    INTEGER DEFAULT 0,
        is_active   INTEGER DEFAULT 1,
        target_blank INTEGER DEFAULT 0,
        parent_id   INTEGER REFERENCES cms_navigation(id) ON DELETE SET NULL,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.rawQuery(`
      CREATE TABLE IF NOT EXISTS cms_settings (
        id          SERIAL PRIMARY KEY,
        key         TEXT NOT NULL UNIQUE,
        value       TEXT,
        group_name  TEXT DEFAULT 'general',
        updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Indexes for frequently queried columns
    await db.rawQuery(`CREATE INDEX IF NOT EXISTS idx_submissions_employer_id ON submissions(employer_id)`);
    await db.rawQuery(`CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status)`);
    await db.rawQuery(`CREATE INDEX IF NOT EXISTS idx_submissions_company_name ON submissions(company_name)`);

    console.log('Tables created successfully.');

    // Migration: Add columns if they don't exist
    const newCols = [
      ['activity_category', 'TEXT'],
      ['is_previous_participant', 'TEXT'],
      ['booth_signboard_name', 'TEXT'],
      ['ceo_name', 'TEXT'],
      ['tax_id', 'TEXT'],
      ['main_products', 'TEXT'],
      ['internship_cooperation', 'TEXT'],
      ['target_departments', 'TEXT'],
      ['mailing_address', 'TEXT'],
      ['attendee_main_name', 'TEXT'],
      ['attendee_main_title', 'TEXT'],
      ['attendee_main_phone', 'TEXT'],
      ['attendee_count', 'INTEGER'],
      ['lunch_box_non_veg', 'INTEGER'],
      ['lunch_box_veg', 'INTEGER'],
      ['has_presentation_need', 'TEXT'],
      ['has_shuttle_need', 'TEXT'],
      ['shuttle_details', 'TEXT'],
      ['raffle_prizes', 'TEXT'],
      ['parking_spaces', 'INTEGER'],
      ['other_requirements', 'TEXT'],
      ['group_type', 'TEXT'],
      ['establishment_date', 'TEXT'],
      ['attendee_main', 'TEXT']
    ];

    for (const [colName, colType] of newCols) {
      try {
        await db.rawQuery(`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS ${colName} ${colType}`);
      } catch (e) {
        // ignore — column likely already exists
      }
    }

    // Migrate announcements table — add columns that may be missing from older deployments
    const annCols = [
      ['priority',  'INTEGER DEFAULT 0'],
      ['is_pinned', 'INTEGER DEFAULT 0'],
    ];
    for (const [colName, colDef] of annCols) {
      try {
        await db.rawQuery(`ALTER TABLE announcements ADD COLUMN IF NOT EXISTS ${colName} ${colDef}`);
      } catch (e) {
        // ignore
      }
    }

    // Migrate employers / admins tables for any missing columns
    try {
      await db.rawQuery(`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP`);
      await db.rawQuery(`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS admin_notes TEXT`);
      await db.rawQuery(`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS booth_number TEXT`);
    } catch (e) {
      // ignore
    }

    // Seed default admin if not exists
    const { rows: admins } = await db.rawQuery('SELECT id FROM admins WHERE username = $1', ['admin']);
    if (admins.length === 0) {
      const adminPassword = process.env.ADMIN_PASSWORD || 'nqu2025';
      const hash = bcrypt.hashSync(adminPassword, 10);
      await db.rawQuery('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', ['admin', hash]);
      console.log(`Default admin account created ${process.env.ADMIN_PASSWORD ? 'with ADMIN_PASSWORD env var' : 'with default password nqu2025'}.`);
    }

    // Seed sample announcements if empty
    const annCount = await db.rawQuery('SELECT COUNT(*) as cnt FROM announcements');
    if (parseInt(annCount.rows[0].cnt) === 0) {
      const sql = 'INSERT INTO announcements (title, content, priority, is_pinned) VALUES ($1, $2, $3, $4)';
      await db.rawQuery(sql, [
        'NQU Job Fair — Registration Now Open',
        'We are pleased to announce that employer registration for the National Quemoy University Job Fair is now open. Register your company to connect with top talent from NQU.',
        10, 1
      ]);
      await db.rawQuery(sql, [
        'Booth Information',
        'Each approved employer will be assigned a booth space. Booth assignments will be announced after the registration deadline.',
        3, 0
      ]);
      console.log('Sample announcements seeded.');
    }

    // Seed default settings
    const settingsCount = await db.rawQuery('SELECT COUNT(*) as cnt FROM settings');
    if (parseInt(settingsCount.rows[0].cnt) === 0) {
      await db.rawQuery("INSERT INTO settings (key, value) VALUES ('registration_status', 'open')");
      await db.rawQuery("INSERT INTO settings (key, value) VALUES ('registration_deadline', '')");
      console.log('Default settings seeded.');
    }

    // Seed CMS default pages
    const pagesCount = await db.rawQuery('SELECT COUNT(*) as cnt FROM cms_pages');
    if (parseInt(pagesCount.rows[0].cnt) === 0) {
      await db.rawQuery(`
        INSERT INTO cms_pages (slug, title, content, sort_order) VALUES
        ('hero', 'Hero Section', '<h1>National Quemoy University</h1><h2>Job Fair</h2><p>Connecting top employers with exceptional NQU talent.</p>', 1),
        ('how-it-works', 'How It Works', 'Registration → Submit → Approval', 2),
        ('event-info', 'Event Information', 'Date: To Be Announced\nVenue: NQU Student Activity Center', 3)
      `);
      console.log('Default CMS pages seeded.');
    }

    // Seed CMS default settings
    const cmsSettingsCount = await db.rawQuery('SELECT COUNT(*) as cnt FROM cms_settings');
    if (parseInt(cmsSettingsCount.rows[0].cnt) === 0) {
      await db.rawQuery(`INSERT INTO cms_settings (key, value, group_name) VALUES
        ('site_name', 'NQU Job Fair', 'general'),
        ('site_tagline', 'Connecting talent with opportunity', 'general'),
        ('contact_email', 'career@mail.nqu.edu.tw', 'contact'),
        ('contact_phone', '+886-82-312- ext. ', 'contact'),
        ('event_date', '', 'event'),
        ('event_venue', 'NQU Student Activity Center', 'event'),
        ('registration_deadline', '', 'event'),
        ('social_facebook', '', 'social'),
        ('social_linkedin', '', 'social'),
        ('logo_url', '', 'branding'),
        ('favicon_url', '', 'branding')
      `);
      console.log('Default CMS settings seeded.');
    }

    // Seed CMS default navigation
    const navCount = await db.rawQuery('SELECT COUNT(*) as cnt FROM cms_navigation');
    if (parseInt(navCount.rows[0].cnt) === 0) {
      await db.rawQuery(`INSERT INTO cms_navigation (label, url, icon, position, is_active) VALUES
        ('Home', '/', '🏠', 1, 1),
        ('Employer', '/employer/login.html', '🏢', 2, 1),
        ('Admin', '/admin/login.html', '⚙️', 3, 1)
      `);
      console.log('Default CMS navigation seeded.');
    }
    // Final check
    console.log('Database schema initialized.');
  } catch (err) {
    console.error('Database initialization failed!');
    console.error('Error details:', err);
    if (err.code === 'ECONNREFUSED') {
      console.error('Is PostgreSQL running locally? Check if you have started the service.');
    } else if (err.code === '28P01') {
      console.error('Invalid password for database connection.');
    } else if (err.code === '3D000') {
      console.error('Database "jobfair" does not exist. Please create it manually if not auto-created.');
    }
  }
};

// Schema promise to track initialization
let schemaError = null;
const schemaPromise = initDB().catch(err => {
  schemaError = err;
  throw err;
});

/**
 * Wait for database to be ready
 */
db.wait = async () => {
  if (schemaError) throw schemaError;
  return schemaPromise;
};

// Wrap public query to wait for schema
const originalQuery = db.query.bind(db);
db.query = async (...args) => {
  await db.wait();
  return originalQuery(...args);
};

module.exports = db;
