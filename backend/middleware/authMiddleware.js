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
    // 1. Get the current role from the user object (default to 'user')
    let userRole = req.user && req.user.role ? req.user.role : 'user';

    // 2. STRICT MASTER KEY: Only admin@gmail.com can bypass or assume admin role
    const masterAdminEmail = 'admin@gmail.com';
    const currentUserEmail = req.user?.email?.toLowerCase().trim();
    
    if (currentUserEmail === masterAdminEmail) {
      console.log(`[AUTH_SECURITY] 🛡️ SUPER ADMIN DETECTED: Granting Master Access to ${currentUserEmail}`);
      userRole = 'admin';
      if (req.user) req.user.role = 'admin';
    }

    // 3. Perform the actual authorization check
    if (!req.user || !roles.includes(userRole)) {
      console.log(`[AUTH_SECURITY] ❌ ACCESS DENIED: User ${req.user?._id} (${currentUserEmail}) role '${userRole}' is not in [${roles.join(',')}]`);
      return res.status(403).json({
        message: `Administrative access restricted. Only the Super Admin can access this route.`,
      });
    }
    
    console.log(`[AUTH_SECURITY] ✅ GRANTED: ${currentUserEmail} [${userRole}] accessing [${roles.join(',')}]`);
    next();
  };
};

module.exports = { protect, authorize };
