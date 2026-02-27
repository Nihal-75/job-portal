const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private/User
const applyForJob = async (req, res) => {
  try {
    const { 
      jobId, 
      firstName, 
      middleName, 
      lastName, 
      email, 
      phone, 
      address, 
      qualification, 
      jobRole, 
      position, 
      experience 
    } = req.body;

    let resumeUrl = req.body.resumeUrl;
    if (req.files && req.files.resume) {
      resumeUrl = req.files.resume[0].path.replace(/\\/g, '/');
    }

    let experienceCertificateUrl = '';
    if (req.files && req.files.experienceCertificate) {
      experienceCertificateUrl = req.files.experienceCertificate[0].path.replace(/\\/g, '/');
    }

    if (!jobId || !firstName || !lastName || !email || !phone || !address || !qualification || !jobRole || !position || !experience || !resumeUrl) {
      return res.status(400).json({ message: 'Please provide all required fields including resume' });
    }

    // Check if the job exists and populate company via companyId->userId->email
    const job = await Job.findById(jobId).populate({
      path: 'companyId',
      populate: {
        path: 'userId',
        model: 'User',
      }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify user hasn't already applied
    const existingApplication = await Application.findOne({
      userId: req.user.id,
      jobId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create the application
    const application = await Application.create({
      userId: req.user.id,
      jobId,
      firstName,
      middleName: middleName || '',
      lastName,
      email,
      phone,
      address,
      qualification,
      jobRole,
      position,
      experience,
      resumeUrl,
      experienceCertificateUrl,
    });

    const user = await User.findById(req.user.id);

    // Send email to User (Job Seeker)
    try {
      await sendEmail({
        email: email, // use the email provided in the form
        subject: `Application Submitted: ${job.title}`,
        message: `Hi ${firstName},\n\nYou have successfully applied for the position of ${job.title} at ${job.companyId.companyName}.\n\nYour application status is currently: Pending.\n\nGood luck!\nThe SkillSpring Team`,
      });
    } catch (err) {
      console.error('Email to user failed to send', err);
    }

    // Send email to Company
    try {
      const companyUserEmail = job.companyId.userId.email;
      await sendEmail({
        email: companyUserEmail,
        subject: `New Application for ${job.title}`,
        message: `Hello ${job.companyId.companyName},\n\nYou have received a new application for the ${job.title} position from ${firstName} ${lastName}.\n\nThanks,\nThe SkillSpring Team`,
      });
    } catch (err) {
      console.error('Email to company failed to send', err);
    }

    // Send email to Admin
    try {
      const adminEmail = 'nihalpandey636@gmail.com';
      await sendEmail({
        email: adminEmail,
        subject: `New Application Received: ${job.title} by ${firstName} ${lastName}`,
        message: `Hello Admin,\n\nA new application has been submitted.\n\nJob: ${job.title} (${job.companyId.companyName})\nApplicant: ${firstName} ${middleName ? middleName + ' ' : ''}${lastName}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}\nQualification: ${qualification}\nJob Role: ${jobRole}\nPosition: ${position}\nExperience: ${experience}\n\nResume URL: ${resumeUrl}\nExperience Certificate URL: ${experienceCertificateUrl ? experienceCertificateUrl : 'N/A'}\n\nThanks,\nThe SkillSpring Team`,
      });
    } catch (err) {
      console.error('Email to admin failed to send', err);
    }

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    res.status(500).json({ message: 'Server Error applying for job' });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications
// @access  Private/User
const getApplications = async (req, res) => {
  try {
    // Only fetch applications for the logged in user
    // Populate the job details including companyName
    const applications = await Application.find({ userId: req.user.id })
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
    res.status(500).json({ message: 'Server Error fetching applications' });
  }
};

// @desc    Get applications for a specific job (Company view)
// @route   GET /api/applications/job/:jobId
// @access  Private/Company
const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Verify company owns this job
    const company = await Company.findOne({ userId: req.user.id });
    if (!company || job.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ jobId: job._id })
      .populate('userId', 'name email phone qualification')
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching applications' });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Company
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id)
      .populate('userId', 'name email')
      .populate({
        path: 'jobId',
        populate: { path: 'companyId' }
      });

    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Verify company owns this job
    const company = await Company.findOne({ userId: req.user.id });
    if (!company || application.jobId.companyId._id.toString() !== company._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    // Send notification email to the user
    try {
      const emailSubject = status === 'Accepted'
        ? `Application Update: Good news from ${application.jobId.companyId.companyName}!`
        : `Application Update: Status from ${application.jobId.companyId.companyName}`;

      const emailBody = status === 'Accepted'
        ? `Hi ${application.userId.name},\n\nCongratulations! Your application for ${application.jobId.title} has been Accepted by ${application.jobId.companyId.companyName}.\nThey will be in touch with you shortly regarding next steps.\n\nThe SkillSpring Team`
        : `Hi ${application.userId.name},\n\nThank you for applying for ${application.jobId.title}.\nUnfortunately, ${application.jobId.companyId.companyName} has decided not to move forward with your application at this time.\n\nKeep applying and best of luck!\nThe SkillSpring Team`;

      await sendEmail({
        email: application.userId.email,
        subject: emailSubject,
        message: emailBody,
      });
    } catch (err) {
      console.error('Status update email failed', err);
    }

    res.status(200).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating application status' });
  }
};

// @desc    Delete/Withdraw an application
// @route   DELETE /api/applications/:id
// @access  Private/User
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify the logged in user owns this application
    if (application.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    }

    await application.deleteOne();
    res.status(200).json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error deleting application' });
  }
};

module.exports = {
  applyForJob,
  getApplications,
  getJobApplications,
  updateApplicationStatus,
  deleteApplication,
};
