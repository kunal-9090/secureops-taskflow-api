const { ApiError } = require('../utils/ApiError');

const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) throw new ApiError({ statusCode: 401, message: 'Unauthorized' });
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError({ statusCode: 403, message: 'Forbidden' });
    }
    return next();
  };
};

module.exports = { roleMiddleware };

