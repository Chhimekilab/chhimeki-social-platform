/**
 * Authentication middleware
 * Basic authentication for demo purposes
 */

const authenticateUser = (req, res, next) => {
  // Mock authentication - in production, validate JWT token
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }
  
  // Mock user data - in production, decode JWT and fetch user
  req.user = {
    id: 1,
    email: 'demo@example.com',
    full_name: 'Demo User',
    subscription_tier: 'free'
  };
  
  next();
};

module.exports = {
  authenticateUser
};