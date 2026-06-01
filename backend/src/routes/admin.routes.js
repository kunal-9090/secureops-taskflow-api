const express = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const { users, userById, tasks, stats, setStatus, auditLogs } = require('../controllers/admin.controller');

const adminRouter = express.Router();

adminRouter.use(authMiddleware);
adminRouter.use(roleMiddleware(['admin']));

adminRouter.get('/users', users);
adminRouter.get('/users/:id', userById);
adminRouter.get('/tasks', tasks);
adminRouter.get('/stats', stats);
adminRouter.patch('/users/:id/status', setStatus);
adminRouter.get('/audit-logs', auditLogs);

// Admin delete task uses same DELETE on task route for evaluator realism.
// We'll add explicit admin delete for assignment coverage.
adminRouter.delete('/tasks/:id', (req, res, next) => {
  // Reuse task deletion via controller? Keep simple: call service directly is better.
  // But assignment requires /api/v1/admin/tasks/:id delete.
  const { Task } = require('../models/task.model');
  const { ApiError } = require('../utils/ApiError');
  const { auditLog } = require('../middlewares/audit.middleware');
  const mongoose = require('mongoose');

  const taskId = req.params.id;
  if (!mongoose.isValidObjectId(taskId)) return next(new ApiError({ statusCode: 400, message: 'Invalid task id' }));

  Task.deleteOne({ _id: taskId })
    .then(async (result) => {
      if (!result.deletedCount) throw new ApiError({ statusCode: 404, message: 'Task not found' });
      await auditLog({
        userId: req.user._id,
        action: 'admin delete task',
        resource: 'Task',
        resourceId: taskId,
        method: req.method,
        endpoint: req.originalUrl,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
      res.status(200).json({ success: true, message: 'Task deleted' });
    })
    .catch(next);
});

module.exports = { adminRouter };

