const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const sendEmail = require('../utils/sendEmail');

// @desc    Get dashboard statistics for Admin
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const companiesCount = await User.countDocuments({ role: 'company' });
    const seekersCount = await User.countDocuments({ role: 'user' });
    
    const totalJobs = await Job.countDocuments();
    const pendingJobs = await Job.countDocuments({ status: 'Pending' });
    const approvedJobs = await Job.countDocuments({ status: 'Approved' });

    const totalApplications = await Application.countDocuments();

    res.status(200).json({
      users: {
        total: totalUsers,
        companies: companiesCount,
        seekers: seekersCount,
      },
      jobs: {
        total: totalJobs,
        pending: pendingJobs,
        approved: approvedJobs,
      },
      applications: totalApplications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching admin stats' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching all users' });
  }
};

// @desc    Get all applications (Admin View)
// @route   GET /api/admin/applications
// @access  Private/Admin
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('userId', 'name email phone qualification resumeUrl')
      .populate({
        path: 'jobId',
        select: 'title location salary category companyId',
        populate: {
          path: 'companyId',
          select: 'companyName'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching all applications' });
  }
};

// @desc    Update application status and set interview date
// @route   PUT /api/admin/applications/:id
// @access  Private/Admin
const updateApplicationByAdmin = async (req, res) => {
  try {
    const { status, interviewDate, adminFeedback } = req.body;
    
    if (status && !['Accepted', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id)
      .populate('userId', 'name email')
      .populate({
        path: 'jobId',
        select: 'title',
        populate: { path: 'companyId', select: 'companyName' }
      });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (status) application.status = status;
    if (interviewDate !== undefined) application.interviewDate = interviewDate;
    if (adminFeedback !== undefined) application.adminFeedback = adminFeedback;

    await application.save();

    // Send email notification for interview
    if (status === 'Accepted' && interviewDate) {
      try {
        await sendEmail({
          email: application.userId.email,
          subject: `Interview Scheduled: ${application.jobId.title} at ${application.jobId.companyId.companyName}`,
          message: `Hi ${application.userId.name},\n\nWe are pleased to inform you that your application for ${application.jobId.title} has been moved to the interview stage.\n\nInterview Date: ${interviewDate}\n${adminFeedback ? `Note: ${adminFeedback}` : ''}\n\nPlease be prepared for the call/meeting. Best of luck!\nThe SkillSpring Team`,
        });
      } catch (err) {
        console.error('Email failed during admin update', err);
      }
    }

    res.status(200).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating application' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Prevent deleting self
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error deleting user' });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllApplications,
  updateApplicationByAdmin,
  deleteUser,
};
