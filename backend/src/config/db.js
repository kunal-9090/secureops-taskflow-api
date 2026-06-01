const mongoose = require('mongoose');
const { env } = require('./env');

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  // Allow running app without MongoDB (for docs/UI evaluation)
  // In normal usage, MongoDB should be available.
  if (env.MONGO_URI === 'skip' || env.MONGO_URI === '') {
    // eslint-disable-next-line no-console
    console.warn('MongoDB connection skipped (MONGO_URI is empty or skip)');
    return;
  }

  await mongoose.connect(env.MONGO_URI, {
    autoIndex: env.NODE_ENV !== 'production'
  });

  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
};


module.exports = { connectDB };

