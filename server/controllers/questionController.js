const { getDb, rowsToObjects, getSetting } = require('../database/db');

/* POST /api/questions/verify  { code } */
exports.verifyCode = (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Code is required' });

    const db       = getDb();
    const result   = db.exec('SELECT * FROM Questions WHERE LOWER(code) = LOWER(?)', [code.trim()]);
    const questions = rowsToObjects(result);

    if (questions.length === 0)
      return res.status(404).json({ success: false, message: 'Invalid code. Please check and try again.' });

    // Also return the timer setting so the front-end knows how long to run
    const timerSeconds = parseInt(getSetting('timer_seconds') || '120');

    res.json({ success: true, data: { ...questions[0], timer_seconds: timerSeconds } });
  } catch (error) {
    console.error('verifyCode error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
