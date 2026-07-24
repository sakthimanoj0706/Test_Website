const path = require('path');
const fs = require('fs');
const { getDb, saveDatabase } = require('../database/db');
const { generateCertificateNumber } = require('../utils/generateStudentId');

function rowsToObjects(result) {
  if (!result.length) return [];
  const { columns, values } = result[0];
  return values.map(row => {
    const obj = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });
}

// POST /api/submit
async function submitProject(req, res) {
  try {
    const db = getDb();
    const student_id = req.user.student_id;
    const { github_link, live_link, description } = req.body;

    // Get student domain
    const studentResult = db.exec(
      `SELECT selected_domain FROM Students WHERE student_id = ?`,
      [student_id]
    );
    if (!studentResult.length || !studentResult[0].values.length) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    const domain = studentResult[0].values[0][0];

    // Get zip file path if uploaded
    const zip_file = req.file ? req.file.filename : null;

    // Check existing submission
    const existing = db.exec(`SELECT id FROM Submissions WHERE student_id = ?`, [student_id]);

    if (existing.length && existing[0].values.length) {
      // Update
      db.run(
        `UPDATE Submissions SET github_link=?, live_link=?, zip_file=?, description=?, submitted_at=CURRENT_TIMESTAMP WHERE student_id=?`,
        [github_link || null, live_link || null, zip_file, description || null, student_id]
      );
    } else {
      // Insert new
      db.run(
        `INSERT INTO Submissions (student_id, domain, github_link, live_link, zip_file, description) VALUES (?,?,?,?,?,?)`,
        [student_id, domain, github_link || null, live_link || null, zip_file, description || null]
      );

      // Award base points
      db.run(
        `UPDATE Leaderboard SET points = points + 100, completed = 1 WHERE student_id = ?`,
        [student_id]
      );

      // Issue certificate
      const certNumber = generateCertificateNumber(student_id);
      db.run(
        `INSERT OR IGNORE INTO Certificates (student_id, certificate_number) VALUES (?,?)`,
        [student_id, certNumber]
      );
    }

    // Recalculate ranks
    recalculateRanks(db);
    saveDatabase();

    return res.json({
      success: true,
      message: 'Project submitted successfully!',
      data: { student_id, domain },
    });
  } catch (err) {
    console.error('submitProject error:', err);
    return res.status(500).json({ success: false, message: 'Submission failed' });
  }
}

function recalculateRanks(db) {
  const leaderboard = db.exec(`SELECT student_id FROM Leaderboard ORDER BY points DESC`);
  if (!leaderboard.length) return;

  leaderboard[0].values.forEach((row, index) => {
    db.run(`UPDATE Leaderboard SET rank = ? WHERE student_id = ?`, [index + 1, row[0]]);
  });
}

// GET /api/submission/:studentId
function getSubmission(req, res) {
  try {
    const db = getDb();
    const student_id = req.params.studentId || req.user.student_id;

    const result = db.exec(`SELECT * FROM Submissions WHERE student_id = ?`, [student_id]);
    const submissions = rowsToObjects(result);

    return res.json({ success: true, data: submissions[0] || null });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// GET /api/leaderboard
function getLeaderboard(req, res) {
  try {
    const db = getDb();
    const result = db.exec(
      `SELECT l.*, s.student_name, s.department, s.year, s.college, s.selected_domain
       FROM Leaderboard l
       JOIN Students s ON l.student_id = s.student_id
       ORDER BY l.points DESC, l.rank ASC
       LIMIT 100`
    );

    const leaderboard = rowsToObjects(result).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    return res.json({ success: true, data: leaderboard });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// GET /api/certificate/:studentId
function getCertificate(req, res) {
  try {
    const db = getDb();
    const student_id = req.params.studentId || req.user.student_id;

    const result = db.exec(
      `SELECT c.*, s.student_name, s.selected_domain, s.college, s.department
       FROM Certificates c
       JOIN Students s ON c.student_id = s.student_id
       WHERE c.student_id = ?`,
      [student_id]
    );

    const certs = rowsToObjects(result);
    if (!certs.length) {
      return res.status(404).json({ success: false, message: 'No certificate found' });
    }

    // Mark as downloaded
    db.run(`UPDATE Certificates SET downloaded = 1 WHERE student_id = ?`, [student_id]);
    saveDatabase();

    return res.json({ success: true, data: certs[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { submitProject, getSubmission, getLeaderboard, getCertificate };
