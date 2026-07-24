const router = require('express').Router();
const { verifyCode } = require('../controllers/questionController');

// Public route to verify a code
router.post('/verify', verifyCode);

module.exports = router;
