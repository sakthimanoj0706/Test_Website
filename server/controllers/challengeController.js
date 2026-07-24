const { getDb, saveDatabase, rowsToObjects, getSetting } = require('../database/db');
const { assignScenarioIndex } = require('../utils/generateStudentId');

const VALID_HEROES = {
  spiderman:  'Full Stack',
  mickey:     'UI/UX',
  batman:     'Data Analyst',
  ironman:    'AI/ML',
  thor:       'Cloud',
  drstrange:  'Prompt Engineering',
  doraemon:   'IoT',
};

/* POST /api/challenge/select-hero  { hero_id } */
function selectHero(req, res) {
  try {
    const { hero_id } = req.body;
    const student_id  = req.user.student_id;

    if (!VALID_HEROES[hero_id])
      return res.status(400).json({ success: false, message: 'Invalid hero' });

    const db = getDb();

    // Check if already selected
    const row = rowsToObjects(db.exec(`SELECT hero_id, selected_domain FROM Students WHERE student_id=?`, [student_id]));
    if (!row.length) return res.status(404).json({ success: false, message: 'Student not found' });

    if (row[0].hero_id)
      return res.status(409).json({ success: false, message: 'Hero already selected and locked', data: { hero_id: row[0].hero_id } });

    // Hero domain must match registered domain
    const heroDomain = VALID_HEROES[hero_id];
    if (heroDomain !== row[0].selected_domain)
      return res.status(400).json({
        success: false,
        message: `Hero "${hero_id}" is for domain "${heroDomain}" but you registered for "${row[0].selected_domain}"`,
      });

    const scenario = assignScenarioIndex(student_id);

    db.run(
      `UPDATE Students SET hero_id=?, assigned_scenario=? WHERE student_id=?`,
      [hero_id, scenario, student_id]
    );
    saveDatabase();

    return res.json({
      success: true,
      message: 'Hero selected and locked!',
      data: { hero_id, assigned_scenario: scenario, domain: heroDomain },
    });
  } catch (err) {
    console.error('selectHero:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/* POST /api/challenge/start */
function startChallenge(req, res) {
  try {
    const student_id = req.user.student_id;
    const db = getDb();

    const rows = rowsToObjects(db.exec(
      `SELECT hero_id, assigned_scenario, challenge_started_at, challenge_completed FROM Students WHERE student_id=?`,
      [student_id]
    ));
    if (!rows.length) return res.status(404).json({ success: false, message: 'Student not found' });
    const s = rows[0];

    if (!s.hero_id)
      return res.status(400).json({ success: false, message: 'Select a hero first' });
    if (s.challenge_completed)
      return res.status(409).json({ success: false, message: 'Challenge already completed' });

    const timerSeconds = parseInt(getSetting('timer_seconds') || '120');

    if (!s.challenge_started_at) {
      // First time — record start
      db.run(`UPDATE Students SET challenge_started_at=CURRENT_TIMESTAMP WHERE student_id=?`, [student_id]);
      saveDatabase();
    }

    // Re-read to get fresh timestamp
    const fresh = rowsToObjects(db.exec(
      `SELECT challenge_started_at FROM Students WHERE student_id=?`, [student_id]
    ))[0];

    return res.json({
      success: true,
      data: {
        challenge_started_at: fresh.challenge_started_at,
        timer_seconds:        timerSeconds,
        assigned_scenario:    s.assigned_scenario,
        hero_id:              s.hero_id,
      },
    });
  } catch (err) {
    console.error('startChallenge:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/* POST /api/challenge/complete */
function completeChallenge(req, res) {
  try {
    const student_id = req.user.student_id;
    const db = getDb();

    db.run(
      `UPDATE Students SET challenge_completed=1, challenge_completed_at=CURRENT_TIMESTAMP WHERE student_id=?`,
      [student_id]
    );
    // Award points
    db.run(`UPDATE Leaderboard SET points=100, completed=1 WHERE student_id=?`, [student_id]);
    // Recalculate ranks
    const all = db.exec(`SELECT student_id FROM Leaderboard ORDER BY points DESC, completed DESC`);
    if (all.length) {
      all[0].values.forEach(([sid], idx) => {
        db.run(`UPDATE Leaderboard SET rank=? WHERE student_id=?`, [idx + 1, sid]);
      });
    }
    saveDatabase();

    return res.json({ success: true, message: 'Challenge marked as completed' });
  } catch (err) {
    console.error('completeChallenge:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/* POST /api/challenge/security-event  { event } */
function logSecurityEvent(req, res) {
  try {
    const student_id = req.user.student_id;
    const { event }  = req.body;
    const db = getDb();

    const map = {
      copy:      'copy_attempts',
      paste:     'paste_attempts',
      tab:       'tab_switches',
      refresh:   'refresh_count',
      devtools:  'devtools_open',
      blur:      'blur_count',
    };
    const col = map[event];
    if (!col) return res.status(400).json({ success: false, message: 'Unknown event' });

    db.run(`UPDATE SecurityLogs SET ${col}=${col}+1 WHERE student_id=?`, [student_id]);
    saveDatabase();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/* GET /api/challenge/status */
function getChallengeStatus(req, res) {
  try {
    const student_id = req.user.student_id;
    const db = getDb();

    const rows = rowsToObjects(db.exec(
      `SELECT hero_id, assigned_scenario, challenge_started_at, challenge_completed, challenge_completed_at, selected_domain
       FROM Students WHERE student_id=?`,
      [student_id]
    ));
    if (!rows.length) return res.status(404).json({ success: false, message: 'Not found' });

    const timerSeconds = parseInt(getSetting('timer_seconds') || '120');
    return res.json({ success: true, data: { ...rows[0], timer_seconds: timerSeconds } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { selectHero, startChallenge, completeChallenge, logSecurityEvent, getChallengeStatus };
