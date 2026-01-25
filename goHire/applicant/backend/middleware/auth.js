const requireAuth = (req, res, next) => {
  if (!req.session.user?.authenticated) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  // Attach user to req for use in controllers
  req.user = req.session.user;
  next();
};

const requireAuthRedirect = (req, res, next) => {
  if (!req.session.user?.authenticated) {
    return res.redirect('/login');
  }
  // Attach user to req for use in controllers
  req.user = req.session.user;
  next();
};

module.exports = {
  requireAuth,
  requireAuthRedirect
};

