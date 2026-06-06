/**
 * Success Response Formatter
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Error Response Formatter
 */
const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', error = null) => {
  const response = {
    success: false,
    message,
  };
  
  // Only include error details in development
  if (error && process.env.NODE_ENV !== 'production') {
    response.error = error.message || error;
  }
  
  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
};
