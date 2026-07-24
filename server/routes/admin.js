const router = require('express').Router();
const { authenticateAdmin } = require('../middleware/auth');
const {
  getAllQuestions, createQuestion, deleteQuestion, updateSettings, getSettings,
  downloadDatabase, backupDatabase, getViolations,
} = require('../controllers/adminController');

router.use(authenticateAdmin);

router.get('/questions',         getAllQuestions);
router.post('/questions',        createQuestion);
router.delete('/questions/:id',  deleteQuestion);
router.get('/settings',          getSettings);
router.get('/violations',        getViolations);
router.put('/settings',          updateSettings);
router.get('/download/database', downloadDatabase);
router.post('/backup',           backupDatabase);

module.exports = router;
