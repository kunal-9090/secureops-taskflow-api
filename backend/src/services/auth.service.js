const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');
const { auditLog } = require('../middlewares/audit.middleware');

const registerUser = async ({ name, email, password }, { ipAddress, userAgent, endpoint, method }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError({ statusCode: 409, message: 'Email already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'user',
    isActive: true,
    lastLogin: null
  });

  await auditLog({
    userId: user._id,
    action: 'register',
    resource: 'User',
    resourceId: user._id,
    method,
    endpoint,
    ipAddress,
    userAgent
  });

  return ApiResponse(true, 'User registered successfully', {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
};

const loginUser = async ({ email, password }, { ipAddress, userAgent, endpoint, method }) => {
  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) throw new ApiError({ statusCode: 401, message: 'Invalid credentials' });

  if (!user.isActive) {
    throw new ApiError({ statusCode: 403, message: 'Account is deactivated' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new ApiError({ statusCode: 401, message: 'Invalid credentials' });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  await auditLog({
    userId: user._id,
    action: 'login',
    resource: 'User',
    resourceId: user._id,
    method,
    endpoint,
    ipAddress,
    userAgent
  });

  return ApiResponse(true, 'Login successful', {
    accessToken,
    refreshToken
  });
};

const refreshAccessToken = async ({ refreshToken }, { ipAddress, userAgent, endpoint, method }) => {
  if (!refreshToken) throw new ApiError({ statusCode: 400, message: 'refreshToken is required' });

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || require('../config/env').env.JWT_REFRESH_SECRET);

  } catch {
    throw new ApiError({ statusCode: 401, message: 'Invalid refresh token' });
  }

  const user = await User.findById(payload.sub).select('+refreshToken isActive role');
  if (!user) throw new ApiError({ statusCode: 401, message: 'Invalid refresh token' });

  if (!user.isActive) throw new ApiError({ statusCode: 403, message: 'Account is deactivated' });
  if (user.refreshToken !== refreshToken) throw new ApiError({ statusCode: 401, message: 'Refresh token mismatch' });

  const accessToken = generateAccessToken(user);

  return ApiResponse(true, 'Token refreshed', { accessToken });
};

const logoutUser = async ({ refreshToken }, { userId, ipAddress, userAgent, endpoint, method }) => {
  if (!userId) throw new ApiError({ statusCode: 401, message: 'Unauthorized' });

  const user = await User.findById(userId).select('+refreshToken');
  if (!user) throw new ApiError({ statusCode: 401, message: 'Unauthorized' });

  user.refreshToken = null;
  await user.save();

  await auditLog({
    userId: user._id,
    action: 'logout',
    resource: 'User',
    resourceId: user._id,
    method,
    endpoint,
    ipAddress,
    userAgent
  });

  return ApiResponse(true, 'Logged out successfully');
};

const getProfile = async ({ userId }) => {
  const user = await User.findById(userId).select('name email role isActive lastLogin');
  if (!user) throw new ApiError({ statusCode: 404, message: 'User not found' });
  return ApiResponse(true, 'Profile fetched', user);
};

module.exports = { registerUser, loginUser, refreshAccessToken, logoutUser, getProfile };

