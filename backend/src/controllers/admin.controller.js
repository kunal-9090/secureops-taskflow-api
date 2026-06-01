const { asyncHandler } = require('../utils/asyncHandler');
const { listUsers, getUserById, setUserStatus, adminListTasks, adminStats, adminAuditLogs } = require('../services/admin.service');

const users = asyncHandler(async (req, res) => {
  const result = await listUsers();
  res.status(200).json(result);
});

const userById = asyncHandler(async (req, res) => {
  const result = await getUserById({ id: req.params.id });
  res.status(200).json(result);
});

const tasks = asyncHandler(async (req, res) => {
  const result = await adminListTasks();
  res.status(200).json(result);
});

const stats = asyncHandler(async (req, res) => {
  const result = await adminStats();
  res.status(200).json(result);
});

const setStatus = asyncHandler(async (req, res) => {
  const result = await setUserStatus(
    { adminId: req.user._id, id: req.params.id, status: req.body.isActive },
    {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      endpoint: req.originalUrl,
      method: req.method
    }
  );
  res.status(200).json(result);
});

const auditLogs = asyncHandler(async (req, res) => {
  const result = await adminAuditLogs({ query: req.query });
  res.status(200).json(result);
});

module.exports = { users, userById, tasks, stats, setStatus, auditLogs };

