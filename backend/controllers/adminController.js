const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

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

module.exports = {
  getDashboardStats,
  getAllUsers,
};
