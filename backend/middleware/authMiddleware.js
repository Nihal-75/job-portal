const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Role authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    // If an older user account lacks the 'role' explicitly saved in DB, default them to 'user'
    let userRole = req.user && req.user.role ? req.user.role : 'user';

    // MANUAL OVERRIDE for main admin email to fix persistent 403 issues
    const adminEmails = ['nihalpandey636@gmail.com', 'pandeynihal96083@yahoo.com'];
    if (req.user && adminEmails.includes(req.user.email)) {
      userRole = 'admin';
    }

    if (!req.user || !roles.includes(userRole)) {
      console.log(`[AUTH_DEBUG] 403 Forbidden: User ${req.user?._id} (${req.user?.email}) has role '${userRole}'. Required: [${roles.join(',')}]`);
      return res.status(403).json({
        message: `User role ${userRole} is not authorized to access this route. Admin access required.`,
      });
    }
    
    // Inject the resolved role back so controllers can rely on it if needed
    if (req.user && !req.user.role) req.user.role = userRole;
    
    next();
  };
};

module.exports = { protect, authorize };
