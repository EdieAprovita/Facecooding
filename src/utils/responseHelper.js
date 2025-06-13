/**
 * Create a standardized success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object} data - Response data (optional)
 * @returns {Object} JSON response
 */
const createResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(response);
};

/**
 * Create a standardized error response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Error message
 * @param {Array|Object} errors - Detailed errors (optional)
 * @returns {Object} JSON response
 */
const createErrorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(response);
};

/**
 * Create pagination metadata
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @param {Number} total - Total items
 * @returns {Object} Pagination metadata
 */
const createPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};

module.exports = {
  createResponse,
  createErrorResponse,
  createPaginationMeta
};
