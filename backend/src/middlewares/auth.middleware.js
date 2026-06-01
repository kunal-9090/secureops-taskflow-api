const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { User } = require('../models/user.model');
const { ApiError } = require('../utils/ApiError');

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      throw new ApiError({ statusCode: 401, message: 'Access token missing' });
    }

    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);

    const user = await User.findById(payload.sub).select('role isActive name email');
    if (!user || !user.isActive) {
      throw new ApiError({ statusCode: 401, message: 'User not active' });
    }

    req.user = {
      _id: user._id.toString(),
      role: user.role
    };

    return next();
  } catch (err) {
    throw new ApiError({ statusCode: 401, message: 'Unauthorized' });
  }
};

module.exports = { authMiddleware };

