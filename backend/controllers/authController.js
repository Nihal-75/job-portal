const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user or company
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, companyName, description, phone, address, qualification } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let photoUrl = '';
    let resumeUrl = '';
    if (req.files) {
      if (req.files.photo && req.files.photo.length > 0) {
        photoUrl = req.files.photo[0].path.replace(/\\/g, '/');
      }
      if (req.files.resume && req.files.resume.length > 0) {
        resumeUrl = req.files.resume[0].path.replace(/\\/g, '/');
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      phone,
      address,
      qualification,
      photoUrl,
      resumeUrl,
    });

    if (user) {
      // If role is company, create company profile
      if (user.role === 'company') {
        if (!companyName) {
           // Rollback user creation if company details missing
           await User.findByIdAndDelete(user._id);
           return res.status(400).json({ message: 'Please provide company name' });
        }
        await Company.create({
          userId: user._id,
          companyName,
          description: description || '',
        });
      }

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email and explicitly select password to compare
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = {
  register,
  login,
};
