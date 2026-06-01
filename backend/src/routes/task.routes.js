const express = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const {
  createTaskValidator,
  updateTaskValidator,
  getTaskValidator,
  deleteTaskValidator,
  queryTasksValidator
} = require('../validators/task.validator');

const { getAllTasks, create, getById, update, remove } = require('../controllers/task.controller');

const taskRouter = express.Router();

taskRouter.use(authMiddleware);

taskRouter.get('/', validate(queryTasksValidator), getAllTasks);
taskRouter.post('/', validate(createTaskValidator), create);
taskRouter.get('/:id', validate(getTaskValidator), getById);
taskRouter.put('/:id', validate(updateTaskValidator), update);
taskRouter.delete('/:id', validate(deleteTaskValidator), remove);

module.exports = { taskRouter };

