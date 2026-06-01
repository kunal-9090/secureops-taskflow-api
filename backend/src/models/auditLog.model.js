const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, required: true, trim: true },
    resource: { type: String, required: true, trim: true },
    resourceId: { type: String, default: null, trim: true },
    method: { type: String, default: null, trim: true },
    endpoint: { type: String, default: null, trim: true },
    ipAddress: { type: String, default: null, trim: true },
    userAgent: { type: String, default: null, trim: true }
  },
  { timestamps: true }
);

auditLogSchema.index({ action: 1, resource: 1, createdAt: -1 });
auditLogSchema.index({ user: 1, createdAt: -1 });

auditLogSchema.index({ endpoint: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = { AuditLog };

