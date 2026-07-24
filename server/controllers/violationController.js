const { getDb } = require('../database/db');

// POST /api/violations/log
async function logViolation(req, res) {
  try {
    const { participant_name, hero_code, reason } = req.body;
    if (!participant_name || !hero_code || !reason) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    const db = getDb();
    db.run(`INSERT INTO Violations (participant_name, hero_code, reason) VALUES (?, ?, ?)`, [participant_name, hero_code, reason]);
    return res.json({ success: true, message: 'Violation logged' });
  } catch (err) {
    console.error('logViolation:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { logViolation };
