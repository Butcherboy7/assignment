/**
 * Role-based access control middleware factory.
 * Usage: requireRole("admin") or requireRole("admin", "manager")
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    return next();
  };
};

module.exports = { requireRole };
