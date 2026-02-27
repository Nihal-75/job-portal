const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/stats')
  .get(protect, authorize('admin'), getDashboardStats);

router.route('/users')
  .get(protect, authorize('admin'), getAllUsers);

module.exports = router;
