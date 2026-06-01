const { z } = require('zod');

const registerValidator = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters')
  })
});

const loginValidator = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(1, 'Password is required')
  })
});

const refreshTokenValidator = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'refreshToken is required')
  }).optional()
});

const logoutValidator = z.object({
  body: z.object({
    refreshToken: z.string().optional()
  }).optional()
});

const authProfileValidator = z.object({
  body: z.object({}).optional()
});

module.exports = {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  logoutValidator,
  authProfileValidator
};

