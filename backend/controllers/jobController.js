const Job = require('../models/Job');
const Company = require('../models/Company');

// @desc    Get all jobs (with optional filters)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    let { category, location, minSalary } = req.query;
    
    // Trim empty spaces
    if (category) category = category.trim();
    if (location) location = location.trim();
    
    // Build query object
    let query = {};
    
    if (category) {
      // Find companies that might match the search text
      const matchingCompanies = await Company.find({
        companyName: { $regex: category, $options: 'i' }
      }).select('_id');
      const companyIds = matchingCompanies.map(c => c._id);

      query.$or = [
        { title: { $regex: category, $options: 'i' } },
        { category: { $regex: category, $options: 'i' } },
        { description: { $regex: category, $options: 'i' } },
        { skills: { $regex: category, $options: 'i' } },
        { companyId: { $in: companyIds } }
      ];
    }
    
    if (location) {
      // Handle missing spaces (like "uttarpradesh") and common typos (like "utter")
      let searchLoc = location.toLowerCase().replace(/\s+/g, '');
      searchLoc = searchLoc.replace(/utter/g, 'uttar');
      
      // Allow optional spaces between characters in the database field
      const regexPattern = searchLoc.split('').join('\\s*');
      query.location = { $regex: regexPattern, $options: 'i' };
    }
    
    if (minSalary) {
      query.salary = { $gte: Number(minSalary) };
    }

    // Only fetch approved jobs for public listing
    query.status = 'Approved';

    // Populate company details
    const jobs = await Job.find(query)
      .populate('companyId', 'companyName description')
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching jobs' });
  }
};

// @desc    Get job search suggestions
// @route   GET /api/jobs/suggestions
// @access  Public
const getJobSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json([]);
    }

    // Fetch approved jobs matching the title or category
    const jobs = await Job.find({
      status: 'Approved',
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    })
      .select('title category companyId')
      .populate('companyId', 'companyName')
      .limit(8);

    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching job suggestions' });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Company
const createJob = async (req, res) => {
  try {
    const { title, description, salary, location, category, skills } = req.body;

    // Validate request
    if (!title || !description || !salary || !location || !category) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Find the company associated with the logged in user
    const company = await Company.findOne({ userId: req.user.id });

    if (!company) {
      return res.status(404).json({ message: 'Company profile not found for this user' });
    }

    const job = await Job.create({
      companyId: company._id,
      title,
      description,
      salary,
      location,
      category,
      skills: skills || [],
    });

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error creating job' });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Company
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Find requested user's company profile
    const company = await Company.findOne({ userId: req.user.id });
    
    if (!company) {
       return res.status(404).json({ message: 'Company profile not found' });
    }

    // Make sure the logged in company user matches the job's company ID
    if (job.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating job' });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Company
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Find requested user's company profile
    const company = await Company.findOne({ userId: req.user.id });
    
    if (!company) {
       return res.status(404).json({ message: 'Company profile not found' });
    }

    // Make sure the logged in company user matches the job's company ID
    if (job.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to delete this job' });
    }

    await job.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error deleting job' });
  }
};

// @desc    Get jobs created by the logged in company
// @route   GET /api/jobs/company
// @access  Private/Company
const getCompanyJobs = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user.id });
    
    if (!company) {
       return res.status(404).json({ message: 'Company profile not found' });
    }

    const jobs = await Job.find({ companyId: company._id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching company jobs' });
  }
};

// @desc    Get all jobs (Admin view)
// @route   GET /api/jobs/admin/all
// @access  Private/Admin
const getAdminJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('companyId', 'companyName').sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching all jobs' });
  }
};

// @desc    Update job status (Approve/Reject)
// @route   PUT /api/jobs/:id/status
// @access  Private/Admin
const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.status = status;
    await job.save();

    res.status(200).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating job status' });
  }
};

module.exports = {
  getJobs,
  getCompanyJobs,
  getAdminJobs,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
  getJobSuggestions,
};
