const { AuditLog } = require('../models/auditLog.model');

const auditLog = async ({ userId, action, resource, resourceId, method, endpoint, ipAddress, userAgent }) => {
  try {
    await AuditLog.create({
      user: userId || null,
      action,
      resource,
      resourceId: resourceId ? String(resourceId) : null,
      method,
      endpoint,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null
    });
  } catch {
    // audit should never break main flow
  }
};

module.exports = { auditLog };

