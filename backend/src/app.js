const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const swaggerUI = require('swagger-ui-express');
const { setupSwagger } = require('./docs/swagger');

const { env } = require('./config/env');
const { errorMiddleware } = require('./middlewares/error.middleware');

const { authRouter } = require('./routes/auth.routes');
const { taskRouter } = require('./routes/task.routes');
const { adminRouter } = require('./routes/admin.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SecureOps TaskFlow API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Existing swagger-jsdoc spec may be empty if no JSDoc annotations exist.
// To guarantee complete /api-docs documentation, we also provide a fallback spec.
setupSwagger(app);

const { buildSwaggerSpec } = require('./main-swagger-inline');

if (!app.locals.swaggerSpec || !app.locals.swaggerSpec.paths || Object.keys(app.locals.swaggerSpec.paths).length === 0) {
  app.locals.swaggerSpec = buildSwaggerSpec({ baseUrl: '/api/v1' });
}

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/admin', adminRouter);

// Swagger endpoint
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(app.locals.swaggerSpec));

app.use(errorMiddleware);


module.exports = { app };

