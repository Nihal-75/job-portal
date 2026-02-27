const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getApplications,
  getJobApplications,
  updateApplicationStatus,
  deleteApplication
} = require('../controllers/applicationController');

const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(protect, authorize('user'), getApplications)
  .post(protect, authorize('user'), upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'experienceCertificate', maxCount: 1 }]), applyForJob);

// Company routes
router.route('/job/:jobId')
  .get(protect, authorize('company'), getJobApplications);

router.route('/:id/status')
  .put(protect, authorize('company'), updateApplicationStatus);

router.route('/:id')
  .delete(protect, authorize('user'), deleteApplication);

module.exports = router;
