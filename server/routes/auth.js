const router  = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { adminLogin } = require('../controllers/authController');

router.post('/admin/login', [body('username').trim().notEmpty(), body('password').notEmpty()], validate, adminLogin);

module.exports = router;
