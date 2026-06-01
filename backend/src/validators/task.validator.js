const { z } = require('zod');

const taskStatus = z.enum(['pending', 'in-progress', 'completed']);
const taskPriority = z.enum(['low', 'medium', 'high']);

const isoDateOrNull = z
  .string()
  .datetime('dueDate must be a valid ISO date')
  .optional()
  .nullable();

const createTaskValidator = z.object({
  body: z.object({
    title: z.string().min(1, 'title is required'),
    description: z.string().optional().default(''),
    status: taskStatus.optional(),
    priority: taskPriority.optional(),
    dueDate: isoDateOrNull,
    tags: z.array(z.string()).optional().default([])
  })
});

const updateTaskValidator = z.object({
  params: z.object({
    id: z.string().min(1, 'Task id is required')
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: taskStatus.optional(),
    priority: taskPriority.optional(),
    dueDate: isoDateOrNull,
    tags: z.array(z.string()).optional()
  })
});

const getTaskValidator = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});

const deleteTaskValidator = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});

const queryTasksValidator = z.object({
  query: z
    .object({
      status: taskStatus.optional(),
      priority: taskPriority.optional(),
      page: z.coerce.number().int().min(1).optional().default(1),
      limit: z.coerce.number().int().min(1).max(100).optional().default(10),
      search: z.string().optional(),
      sort: z.enum(['createdAt', '-createdAt']).optional()
    })
    .passthrough()
});

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  getTaskValidator,
  deleteTaskValidator,
  queryTasksValidator
};

