const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');

router.post(
  '/register',
  upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'resume', maxCount: 1 }]),
  register
);
router.post('/login', login);

module.exports = router;
