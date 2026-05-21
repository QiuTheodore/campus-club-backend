const { errorResponse } = require("../utils/response");

function requireRoles(...allowedRoles) {
  return function (req, res, next) {
    if (!req.user) {
      return errorResponse(res, "Authentication required", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, "Permission denied", 403);
    }

    next();
  };
}

function requireSelfOrSuperAdmin(req, res, next) {
  if (!req.user) {
    return errorResponse(res, "Authentication required", 401);
  }

  const targetUserId = Number(req.params.id);

  if (req.user.role === "super_admin" || req.user.id === targetUserId) {
    return next();
  }

  return errorResponse(res, "You can only manage your own profile", 403);
}

module.exports = {
  requireRoles,
  requireSelfOrSuperAdmin,
};