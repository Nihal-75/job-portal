const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getAllApplications,
  updateApplicationByAdmin,
  deleteUser,
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/stats')
  .get(protect, authorize('admin'), getDashboardStats);

router.route('/users')
  .get(protect, authorize('admin'), getAllUsers);

router.route('/users/:id')
  .delete(protect, authorize('admin'), deleteUser);

router.route('/applications')
  .get(protect, authorize('admin'), getAllApplications);

router.route('/applications/:id')
  .put(protect, authorize('admin'), updateApplicationByAdmin);

module.exports = router;
