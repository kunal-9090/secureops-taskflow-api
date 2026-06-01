const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('../models/user.model');
const { Task } = require('../models/task.model');
const { AuditLog } = require('../models/auditLog.model');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { auditLog } = require('../middlewares/audit.middleware');

const listUsers = async () => {
  const users = await User.find({}).select('name email role isActive lastLogin');
  return ApiResponse(true, 'Users fetched', users);
};

const getUserById = async ({ id }) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError({ statusCode: 400, message: 'Invalid user id' });
  const user = await User.findById(id).select('name email role isActive lastLogin createdAt');
  if (!user) throw new ApiError({ statusCode: 404, message: 'User not found' });
  return ApiResponse(true, 'User fetched', user);
};

const setUserStatus = async ({ adminId, id, status }, { ipAddress, userAgent, endpoint, method }) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError({ statusCode: 400, message: 'Invalid user id' });

  const user = await User.findById(id);
  if (!user) throw new ApiError({ statusCode: 404, message: 'User not found' });

  user.isActive = status;
  await user.save();

  await auditLog({
    userId: adminId,
    action: 'admin deactivate user',
    resource: 'User',
    resourceId: id,
    method,
    endpoint,
    ipAddress,
    userAgent
  });

  return ApiResponse(true, 'User status updated', { id, isActive: status });
};

const adminListTasks = async () => {
  const tasks = await Task.find({ isDeleted: false }).populate('createdBy', 'name email role');
  return ApiResponse(true, 'All tasks fetched', tasks);
};

const adminStats = async () => {
  const totalUsers = await User.countDocuments({});
  const activeUsers = await User.countDocuments({ isActive: true });
  const totalTasks = await Task.countDocuments({ isDeleted: false });
  const pendingTasks = await Task.countDocuments({ isDeleted: false, status: 'pending' });
  const completedTasks = await Task.countDocuments({ isDeleted: false, status: 'completed' });
  const highPriorityTasks = await Task.countDocuments({ isDeleted: false, priority: 'high' });

  return ApiResponse(true, 'Admin stats', {
    totalUsers,
    activeUsers,
    totalTasks,
    pendingTasks,
    completedTasks,
    highPriorityTasks
  });
};

const adminAuditLogs = async ({ query }) => {
  const logs = await AuditLog.find({})
    .sort({ createdAt: -1 })
    .limit(Number(query.limit || 50));

  return ApiResponse(true, 'Audit logs fetched', logs);
};

module.exports = { listUsers, getUserById, setUserStatus, adminListTasks, adminStats, adminAuditLogs };

