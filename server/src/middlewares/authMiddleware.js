const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { errorResponse } = require('../utils/response');

const authMiddleware = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return errorResponse(res, 401, 'Unauthorized: No token provided');
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded; // { id, role, ... }
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Unauthorized: Invalid or expired token');
  }
};

module.exports = authMiddleware;
