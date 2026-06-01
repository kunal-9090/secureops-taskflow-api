const mongoose = require('mongoose');
const { ApiError } = require('../utils/ApiError');

// Centralized error handler
const errorMiddleware = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';

  let apiError = err;
  if (!(apiError instanceof ApiError)) {
    if (err instanceof mongoose.Error.ValidationError) {
      apiError = new ApiError({ statusCode: 400, message: 'Validation Error', errors: [err.message] });
    } else {
      apiError = new ApiError({ statusCode: 500, message: 'Internal Server Error' });
    }
  }

  const payload = {
    success: false,
    message: apiError.message,
    errors: apiError.errors || []
  };

  if (!isProd && apiError.stack) {
    payload.stack = apiError.stack;
  }

  res.status(apiError.statusCode).json(payload);
};

module.exports = { errorMiddleware };

