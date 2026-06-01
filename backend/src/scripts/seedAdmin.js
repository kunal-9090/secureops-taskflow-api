const bcrypt = require('bcryptjs');
const { env } = require('../config/env');
const { connectDB } = require('../config/db');
const { User } = require('../models/user.model');

const seedAdmin = async () => {
  await connectDB();

  const existing = await User.findOne({ email: env.ADMIN_EMAIL });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log('Admin already exists');
    process.exit(0);
  }

  const hashed = await bcrypt.hash(env.ADMIN_PASSWORD, env.BCRYPT_SALT_ROUNDS);

  await User.create({
    name: env.ADMIN_NAME,
    email: env.ADMIN_EMAIL,
    password: hashed,
    role: 'admin',
    isActive: true
  });

  // eslint-disable-next-line no-console
  console.log('Admin seeded successfully');
  process.exit(0);
};

seedAdmin().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

