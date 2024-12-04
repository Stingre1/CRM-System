const authorizeRoles = (...allowedRoles) => (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access Denied: Insufficient permissions.' });
    }
    next();
};

export default authorizeRoles;