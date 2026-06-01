// Simple logger to keep assignment beginner-friendly.
// Replace with Winston in production.

const logger = {
  info: (...args) => {
    // eslint-disable-next-line no-console
    console.log('[INFO]', ...args);
  },
  warn: (...args) => {
    // eslint-disable-next-line no-console
    console.warn('[WARN]', ...args);
  },
  error: (...args) => {
    // eslint-disable-next-line no-console
    console.error('[ERROR]', ...args);
  }
};

module.exports = { logger };

