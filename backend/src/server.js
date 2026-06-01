const { app } = require('./app');
const { env } = require('./config/env');
const { connectDB } = require('./config/db');

const startServer = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`SecureOps TaskFlow API listening on port ${env.PORT}`);
  });
};

startServer().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});

