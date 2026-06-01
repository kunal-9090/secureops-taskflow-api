const mongoose = require('mongoose');
const { Task } = require('../models/task.model');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { auditLog } = require('../middlewares/audit.middleware');

const listTasks = async ({ userId, role, query }, ctx) => {
  const { status, priority, page, limit, search, sort } = query;

  const filter = role === 'admin'
    ? { isDeleted: false }
    : { createdBy: userId, isDeleted: false };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const sortField = sort || 'createdAt';
  const sortObj = sortField === '-createdAt' ? { createdAt: -1 } : { createdAt: 1 };

  const skip = (page - 1) * limit;

  const [total, tasks] = await Promise.all([
    Task.countDocuments(filter),
    Task.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email role')
  ]);

  return ApiResponse(true, 'Tasks fetched', {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    tasks
  });
};

const createTask = async ({ userId, body }, { ipAddress, userAgent, endpoint, method }) => {
  const task = await Task.create({
    ...body,
    createdBy: userId,
    description: body.description || ''
  });

  await auditLog({
    userId,
    action: 'create task',
    resource: 'Task',
    resourceId: task._id,
    method,
    endpoint,
    ipAddress,
    userAgent
  });

  return ApiResponse(true, 'Task created', task);
};

const getTaskById = async ({ userId, role, id }) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError({ statusCode: 400, message: 'Invalid task id' });

  const filter = role === 'admin' ? { _id: id, isDeleted: false } : { _id: id, createdBy: userId, isDeleted: false };

  const task = await Task.findOne(filter).populate('createdBy', 'name email role');
  if (!task) throw new ApiError({ statusCode: 404, message: 'Task not found' });

  return ApiResponse(true, 'Task fetched', task);
};

const updateTask = async ({ userId, role, id, body }, { ipAddress, userAgent, endpoint, method }) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError({ statusCode: 400, message: 'Invalid task id' });

  const filter = role === 'admin' ? { _id: id, isDeleted: false } : { _id: id, createdBy: userId, isDeleted: false };
  const task = await Task.findOne(filter);
  if (!task) throw new ApiError({ statusCode: 404, message: 'Task not found' });

  Object.assign(task, body);
  if (body.description === undefined) {
    // keep existing
  }
  await task.save();

  await auditLog({
    userId,
    action: 'update task',
    resource: 'Task',
    resourceId: task._id,
    method,
    endpoint,
    ipAddress,
    userAgent
  });

  return ApiResponse(true, 'Task updated', task);
};

const softDeleteTask = async ({ userId, role, id }, { ipAddress, userAgent, endpoint, method }) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError({ statusCode: 400, message: 'Invalid task id' });

  const filter = role === 'admin' ? { _id: id, isDeleted: false } : { _id: id, createdBy: userId, isDeleted: false };
  const task = await Task.findOne(filter);
  if (!task) throw new ApiError({ statusCode: 404, message: 'Task not found' });

  if (role === 'admin') {
    await Task.deleteOne({ _id: id });
  } else {
    task.isDeleted = true;
    await task.save();
  }

  await auditLog({
    userId,
    action: role === 'admin' ? 'admin delete task' : 'delete task',
    resource: 'Task',
    resourceId: id,
    method,
    endpoint,
    ipAddress,
    userAgent
  });

  return ApiResponse(true, role === 'admin' ? 'Task deleted' : 'Task deleted (soft)');
};

module.exports = { listTasks, createTask, getTaskById, updateTask, softDeleteTask };

