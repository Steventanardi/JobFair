/**
 * Middleware to require an authenticated employer session.
 */
function requireEmployer(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'employer') {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized — employer login required' });
}

/**
 * Middleware to require an authenticated admin session.
 */
function requireAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized — admin login required' });
}

module.exports = { requireEmployer, requireAdmin };
