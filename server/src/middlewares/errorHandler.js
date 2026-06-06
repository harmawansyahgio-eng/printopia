const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('[Error]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return errorResponse(res, statusCode, message, err);
};

module.exports = errorHandler;
