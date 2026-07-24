const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { getDb, rowsToObjects } = require('../database/db');

/* ── Admin login ───────────────────────────────── */
async function adminLogin(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ success: false, message: 'Username and password required' });

    const db   = getDb();
    const res2 = db.exec(`SELECT * FROM Admins WHERE username=?`, [username.trim()]);
    if (!res2.length || !res2[0].values.length)
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });

    const admin = rowsToObjects(res2)[0];
    if (!(await bcrypt.compare(password, admin.password_hash)))
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: 'admin' },
      process.env.ADMIN_JWT_SECRET || 'secret',
      { expiresIn: '8h' }
    );
    return res.json({
      success: true, message: 'Admin login successful', token,
      user: { username: admin.username, role: 'admin' },
    });
  } catch (err) {
    console.error('adminLogin:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = { adminLogin };
