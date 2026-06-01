const { asyncHandler } = require('../utils/asyncHandler');
const { listTasks, createTask, getTaskById, updateTask, softDeleteTask } = require('../services/task.service');

const getAllTasks = asyncHandler(async (req, res) => {
  const result = await listTasks({
    userId: req.user._id,
    role: req.user.role,
    query: req.query
  });
  res.status(200).json(result);
});

const create = asyncHandler(async (req, res) => {
  const result = await createTask(
    { userId: req.user._id, body: req.body },
    {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      endpoint: req.originalUrl,
      method: req.method
    }
  );
  res.status(201).json(result);
});

const getById = asyncHandler(async (req, res) => {
  const result = await getTaskById({
    userId: req.user._id,
    role: req.user.role,
    id: req.params.id
  });
  res.status(200).json(result);
});

const update = asyncHandler(async (req, res) => {
  const result = await updateTask(
    { userId: req.user._id, role: req.user.role, id: req.params.id, body: req.body },
    {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      endpoint: req.originalUrl,
      method: req.method
    }
  );
  res.status(200).json(result);
});

const remove = asyncHandler(async (req, res) => {
  const result = await softDeleteTask(
    { userId: req.user._id, role: req.user.role, id: req.params.id },
    {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      endpoint: req.originalUrl,
      method: req.method
    }
  );
  res.status(200).json(result);
});

module.exports = { getAllTasks, create, getById, update, remove };

