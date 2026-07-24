const { getDb, saveDatabase } = require('../database/db');

function rowsToObjects(result) {
  if (!result.length) return [];
  const { columns, values } = result[0];
  return values.map(row => {
    const obj = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });
}

// GET /api/student/:id
function getStudent(req, res) {
  try {
    const db = getDb();
    const { id } = req.params;
    const result = db.exec(
      `SELECT s.*, l.points, l.rank, l.badges, l.completed,
              sub.github_link, sub.live_link, sub.description, sub.submitted_at,
              cert.certificate_number, cert.issued_date
       FROM Students s
       LEFT JOIN Leaderboard l ON s.student_id = l.student_id
       LEFT JOIN Submissions sub ON s.student_id = sub.student_id
       LEFT JOIN Certificates cert ON s.student_id = cert.student_id
       WHERE s.student_id = ?`,
      [id]
    );

    if (!result.length || !result[0].values.length) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const students = rowsToObjects(result);
    const student = students[0];
    delete student.password_hash;

    return res.json({ success: true, data: student });
  } catch (err) {
    console.error('getStudent error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// GET /api/student/:id/profile
function getStudentProfile(req, res) {
  try {
    const db = getDb();
    // Use token user or param
    const student_id = req.params.id || req.user.student_id;

    const result = db.exec(
      `SELECT id, student_id, student_name, register_number, department, year, college, email, phone, selected_domain, created_at
       FROM Students WHERE student_id = ?`,
      [student_id]
    );

    if (!result.length || !result[0].values.length) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const student = rowsToObjects(result)[0];
    return res.json({ success: true, data: student });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// GET /api/student/:id/security
function getSecurityLog(req, res) {
  try {
    const db = getDb();
    const student_id = req.params.id || req.user.student_id;

    const result = db.exec(`SELECT * FROM SecurityLogs WHERE student_id = ?`, [student_id]);
    const logs = rowsToObjects(result);

    return res.json({ success: true, data: logs[0] || null });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// POST /api/student/security - Update security log
function updateSecurityLog(req, res) {
  try {
    const db = getDb();
    const student_id = req.user.student_id;
    const { event } = req.body; // 'copy', 'paste', 'tab_switch', 'refresh', 'devtools'

    const fieldMap = {
      copy: 'copy_attempts',
      paste: 'paste_attempts',
      tab_switch: 'tab_switch',
      refresh: 'refresh_count',
      devtools: 'devtools_attempts',
    };

    const field = fieldMap[event];
    if (!field) {
      return res.status(400).json({ success: false, message: 'Invalid event type' });
    }

    // Check if log exists
    const existing = db.exec(`SELECT id FROM SecurityLogs WHERE student_id = ?`, [student_id]);
    if (existing.length && existing[0].values.length) {
      db.run(`UPDATE SecurityLogs SET ${field} = ${field} + 1 WHERE student_id = ?`, [student_id]);
    } else {
      db.run(`INSERT INTO SecurityLogs (student_id, ${field}) VALUES (?, 1)`, [student_id]);
    }

    saveDatabase();
    return res.json({ success: true, message: 'Security event logged' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { getStudent, getStudentProfile, getSecurityLog, updateSecurityLog };
