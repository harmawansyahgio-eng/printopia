const { errorResponse } = require('../utils/response');

const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 401, 'Unauthorized: User not authenticated');
  }

  if (req.user.role !== 'admin') {
    return errorResponse(res, 403, 'Forbidden: Admin access required');
  }

  next();
};

module.exports = adminMiddleware;
