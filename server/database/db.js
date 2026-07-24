/**
 * SQLite Database — WEB AI Engineering Club
 * Engine: sql.js (pure-JS, no native binaries)
 * File:   database/web_ai_engineering.db
 */

const initSqlJs = require('sql.js');
const fs        = require('fs');
const path      = require('path');

const DB_PATH = path.join(__dirname, 'web_ai_engineering.db');

let db = null;

/* ── Persist to disk ─────────────────────────────── */
function saveDatabase() {
  if (!db) return;
  const data   = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

/* Auto-save every 30 s */
function startAutoSave() {
  setInterval(saveDatabase, 30_000);
}

/* ── Boot ─────────────────────────────────────────── */
async function initDatabase() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const file = fs.readFileSync(DB_PATH);
    db = new SQL.Database(file);
    console.log('✅ Loaded existing database from disk');
  } else {
    db = new SQL.Database();
    console.log('✅ Created new database');
  }

  createTables();
  createAdminAccount();
  createDefaultSettings();
  seedQuestions();
  startAutoSave();
  return db;
}

/* ── Tables ──────────────────────────────────────── */
function createTables() {
  /* Questions (Codes) */
  db.run(`
    CREATE TABLE IF NOT EXISTS Questions (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      code       TEXT UNIQUE NOT NULL,
      title      TEXT NOT NULL,
      content    TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  /* Admin accounts */
  db.run(`
    CREATE TABLE IF NOT EXISTS Admins (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      username     TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  /* Site-wide settings (key / value) */
  db.run(`
    CREATE TABLE IF NOT EXISTS Settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  /* Violations */
  db.run(`
    CREATE TABLE IF NOT EXISTS Violations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_name TEXT NOT NULL,
      hero_code TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  // Seed additional admin account (sakthi)
  const bcrypt = require('bcryptjs');
  const sakthiRows = db.exec(`SELECT id FROM Admins WHERE username='sakthi'`);
  if (!sakthiRows.length || !sakthiRows[0].values.length) {
    const hash = bcrypt.hashSync('2811', 12);
    db.run(`INSERT INTO Admins (username,password_hash) VALUES (?,?)`, ['sakthi', hash]);
    console.log('✅ Admin created  →  sakthi / 2811');
  }

  saveDatabase();
  console.log('✅ All tables ready');
}

/* ── Seed admin ──────────────────────────────────── */
function createAdminAccount() {
  const bcrypt = require('bcryptjs');
  const rows   = db.exec(`SELECT id FROM Admins WHERE username='admin'`);
  if (!rows.length || !rows[0].values.length) {
    const hash = bcrypt.hashSync('Admin@2024', 12);
    db.run(`INSERT INTO Admins (username,password_hash) VALUES (?,?)`, ['admin', hash]);
    saveDatabase();
    console.log('✅ Admin created  →  admin / Admin@2024');
  }
}

/* ── Seed default settings ───────────────────────── */
function createDefaultSettings() {
  const defaults = {
    event_active:   '1',
    event_title:    'WEB AI Engineering Club — Code Challenge',
    timer_seconds:  '120',   // 2 minutes default
  };
  for (const [k, v] of Object.entries(defaults)) {
    db.run(`INSERT OR IGNORE INTO Settings (key,value) VALUES (?,?)`, [k, v]);
  }
  saveDatabase();
}

/* ── Seed questions ──────────────────────────────── */
function seedQuestions() {
  const heroes = [
    { code: 'Spider Man', title: 'Full Stack Developer', content: 'You are the Full Stack Developer. Describe your strategy to build a scalable web application from scratch.' },
    { code: 'Mickey Mouse', title: 'UI/UX Developer', content: 'You are the UI/UX Developer. How do you design an interface that is both magical and user-friendly?' },
    { code: 'Batman', title: 'Data Analyst', content: 'You are the Data Analyst. How do you use data to predict and stop crime in Gotham?' },
    { code: 'Iron Man', title: 'AI/ML Engineer', content: 'You are the AI/ML Engineer. Describe how you would build a JARVIS-like assistant.' },
    { code: 'Thor', title: 'Cloud Engineer', content: 'You are the Cloud Engineer. How do you manage infrastructure that can handle the power of a storm?' },
    { code: 'Doctor Strange', title: 'Prompt Engineer', content: 'You are the Prompt Engineer. How do you craft the perfect incantation (prompt) to get the desired outcome?' },
    { code: 'Doraemon', title: 'IoT Engineer', content: 'You are the IoT Engineer. Describe a gadget you would build to connect everyday objects to the internet.' }
  ];
  
  for (const h of heroes) {
    const exists = db.exec(`SELECT id FROM Questions WHERE code=?`, [h.code]);
    if (!exists.length || !exists[0].values.length) {
      db.run(`INSERT INTO Questions (code, title, content) VALUES (?, ?, ?)`, [h.code, h.title, h.content]);
    }
  }
  saveDatabase();
}

/* ── Helpers ─────────────────────────────────────── */
function getDb() {
  if (!db) throw new Error('Database not initialised');
  return db;
}

function getSetting(key) {
  const res = db.exec(`SELECT value FROM Settings WHERE key=?`, [key]);
  if (!res.length || !res[0].values.length) return null;
  return res[0].values[0][0];
}

function setSetting(key, value) {
  db.run(`INSERT OR REPLACE INTO Settings (key,value) VALUES (?,?)`, [key, String(value)]);
  saveDatabase();
}

function rowsToObjects(result) {
  if (!result || !result.length) return [];
  const { columns, values } = result[0];
  return values.map(row => {
    const obj = {};
    columns.forEach((c, i) => { obj[c] = row[i]; });
    return obj;
  });
}

module.exports = { initDatabase, getDb, saveDatabase, getSetting, setSetting, rowsToObjects };
