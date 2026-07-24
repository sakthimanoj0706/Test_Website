const path = require('path');
const fs   = require('fs');
const { getDb, saveDatabase, rowsToObjects, getSetting, setSetting } = require('../database/db');

const DB_PATH    = path.join(__dirname, '../database/web_ai_engineering.db');
const BACKUP_DIR = path.join(__dirname, '../backup');

/* GET /api/admin/questions */
function getAllQuestions(req, res) {
  try {
    const db = getDb();
    const questions = rowsToObjects(db.exec(`SELECT * FROM Questions ORDER BY created_at DESC`));
    return res.json({ success: true, data: questions });
  } catch (err) {
    console.error('getAllQuestions:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/* POST /api/admin/questions */
function createQuestion(req, res) {
  try {
    const db = getDb();
    const { code, title, content } = req.body;
    if (!code || !title || !content) return res.status(400).json({ success: false, message: 'Code, title, and content required' });
    
    // Check if code exists
    const exists = rowsToObjects(db.exec(`SELECT id FROM Questions WHERE code=?`, [code]));
    if (exists.length > 0) return res.status(400).json({ success: false, message: 'Code already exists' });
    
    db.run(`INSERT INTO Questions (code, title, content) VALUES (?, ?, ?)`, [code, title, content]);
    saveDatabase();
    return res.json({ success: true, message: 'Question created' });
  } catch (err) {
    console.error('createQuestion:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/* DELETE /api/admin/questions/:id */
function deleteQuestion(req, res) {
  try {
    const db = getDb();
    const { id } = req.params;
    db.run(`DELETE FROM Questions WHERE id=?`, [id]);
    saveDatabase();
    return res.json({ success: true, message: 'Question deleted' });
  } catch (err) {
    console.error('deleteQuestion:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/* GET /api/admin/settings */
function getSettings(req, res) {
  try {
    const db = getDb();
    const rows = rowsToObjects(db.exec(`SELECT key,value FROM Settings`));
    const out  = {};
    rows.forEach(r => { out[r.key] = r.value; });
    return res.json({ success: true, data: out });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/* PUT /api/admin/settings */
function updateSettings(req, res) {
  try {
    const { event_active, timer_seconds } = req.body;
    if (event_active   !== undefined) setSetting('event_active',  event_active ? '1' : '0');
    if (timer_seconds  !== undefined) setSetting('timer_seconds', String(parseInt(timer_seconds) || 120));
    return res.json({ success: true, message: 'Settings updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/* GET /api/admin/download/database */
function downloadDatabase(req, res) {
  try {
    saveDatabase();
    if (!fs.existsSync(DB_PATH)) return res.status(404).json({ success: false, message: 'DB file not found' });
    res.download(DB_PATH, 'web_ai_engineering.db');
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Download failed' });
  }
}

/* POST /api/admin/backup */
function backupDatabase(req, res) {
  try {
    saveDatabase();
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const ts   = new Date().toISOString().replace(/[:.]/g, '-');
    const dest = path.join(BACKUP_DIR, `backup_${ts}.db`);
    fs.copyFileSync(DB_PATH, dest);
    return res.json({ success: true, message: 'Backup created', filename: `backup_${ts}.db` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Backup failed' });
  }
}

function getViolations(req, res) {
  try {
    const db = getDb();
    const rows = rowsToObjects(db.exec(`SELECT id, participant_name, hero_code, reason, created_at FROM Violations ORDER BY created_at DESC`));
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getViolations:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { getAllQuestions, createQuestion, deleteQuestion, updateSettings, getSettings, downloadDatabase, backupDatabase, getViolations };
