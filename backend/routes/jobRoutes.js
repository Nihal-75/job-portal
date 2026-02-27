const express = require('express');
const router = express.Router();
const {
  getJobs,
  getCompanyJobs,
  getAdminJobs,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
  getJobSuggestions,
} = require('../controllers/jobController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Very important that this route comes before /:id to prevent "company" being treated as an ID
router.route('/company')
  .get(protect, authorize('company'), getCompanyJobs);

router.route('/admin/all')
  .get(protect, authorize('admin'), getAdminJobs);

router.route('/:id/status')
  .put(protect, authorize('admin'), updateJobStatus);

router.route('/suggestions')
  .get(getJobSuggestions);

router.route('/')
  .get(getJobs)
  .post(protect, authorize('company'), createJob);

router.route('/:id')
  .put(protect, authorize('company'), updateJob)
  .delete(protect, authorize('company'), deleteJob);

module.exports = router;
