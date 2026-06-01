const express = require('express');
const { validate } = require('../middlewares/validate.middleware');
const { authRateLimiter } = require('../middlewares/rateLimit.middleware');
const { authMiddleware } = require('../middlewares/auth.middleware');

const { register, login, refreshToken, logout, profile } = require('../controllers/auth.controller');
const {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  logoutValidator,
  authProfileValidator
} = require('../validators/auth.validator');

const authRouter = express.Router();

// Register
authRouter.post('/register', authRateLimiter, validate(registerValidator), register);

// Login
authRouter.post('/login', authRateLimiter, validate(loginValidator), login);

// Refresh access token
authRouter.post('/refresh-token', authRateLimiter, validate(refreshTokenValidator), refreshToken);

// Logout
authRouter.post('/logout', authRateLimiter, validate(logoutValidator), authMiddleware, logout);

// Profile
authRouter.get('/profile', authMiddleware, validate(authProfileValidator), profile);

module.exports = { authRouter };

