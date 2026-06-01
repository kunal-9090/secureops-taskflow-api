const { registerUser, loginUser, refreshAccessToken, logoutUser, getProfile } = require('../services/auth.service');

const { asyncHandler } = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body, {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    endpoint: req.originalUrl,
    method: req.method
  });
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body, {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    endpoint: req.originalUrl,
    method: req.method
  });
  res.status(200).json(result);
});

const refreshToken = asyncHandler(async (req, res) => {
  const result = await refreshAccessToken(req.body, {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    endpoint: req.originalUrl,
    method: req.method
  });
  res.status(200).json(result);
});

const logout = asyncHandler(async (req, res) => {
  const result = await logoutUser(req.body, {
    userId: req.user?._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    endpoint: req.originalUrl,
    method: req.method
  });
  res.status(200).json(result);
});

const profile = asyncHandler(async (req, res) => {
  const result = await getProfile({ userId: req.user._id });
  res.status(200).json(result);
});

module.exports = { register, login, refreshToken, logout, profile };

