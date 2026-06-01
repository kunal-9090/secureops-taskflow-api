// Minimal OpenAPI generator without JSDoc annotations.
// This ensures /api-docs contains complete route documentation.

const buildSwaggerSpec = ({ baseUrl = '/api/v1' } = {}) => ({
  openapi: '3.0.0',
  info: {
    title: 'SecureOps TaskFlow API',
    version: '1.0.1',
    description: 'SecureOps TaskFlow API'
  },
  servers: [{ url: baseUrl }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'health' },
    { name: 'auth' },
    { name: 'tasks' },
    { name: 'admin' }
  ],
  paths: {
    '/health': {
      get: {
        tags: ['health'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'API is running'
          }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['auth'],
        summary: 'Register user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'User created' } }
      }
    },
    '/auth/login': {
      post: {
        tags: ['auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Tokens issued'
          }
        }
      }
    },
    '/auth/refresh-token': {
      post: {
        tags: ['auth'],
        summary: 'Refresh access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'New access token' } }
      }
    },
    '/auth/logout': {
      post: {
        tags: ['auth'],
        summary: 'Logout user',
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Logged out' } }
      }
    },
    '/auth/profile': {
      get: {
        tags: ['auth'],
        summary: 'Get current user profile',
        responses: { 200: { description: 'Profile' } }
      }
    },
    '/tasks': {
      get: {
        tags: ['tasks'],
        summary: 'List tasks (user/admin)',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'priority', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['createdAt', '-createdAt'] } }
        ],
        responses: { 200: { description: 'Tasks' } }
      },
      post: {
        tags: ['tasks'],
        summary: 'Create task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  status: { type: 'string', enum: ['pending', 'in-progress', 'completed'] },
                  priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                  dueDate: { type: ['string', 'null'], format: 'date-time' },
                  tags: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Task created' } }
      }
    },
    '/tasks/{id}': {
      get: {
        tags: ['tasks'],
        summary: 'Get task by id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Task' }, 404: { description: 'Not found' } }
      },
      put: {
        tags: ['tasks'],
        summary: 'Update task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  status: { type: 'string', enum: ['pending', 'in-progress', 'completed'] },
                  priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                  dueDate: { type: ['string', 'null'], format: 'date-time' },
                  tags: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Task updated' } }
      },
      delete: {
        tags: ['tasks'],
        summary: 'Delete task (soft delete for users)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Task deleted' } }
      }
    },
    '/admin/users': {
      get: {
        tags: ['admin'],
        summary: 'List users',
        responses: { 200: { description: 'Users' } }
      }
    },
    '/admin/users/{id}': {
      get: {
        tags: ['admin'],
        summary: 'Get user by id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'User' } }
      }
    },
    '/admin/tasks': {
      get: {
        tags: ['admin'],
        summary: 'List all non-deleted tasks',
        responses: { 200: { description: 'Tasks' } }
      }
    },
    '/admin/stats': {
      get: {
        tags: ['admin'],
        summary: 'Get admin stats',
        responses: { 200: { description: 'Stats' } }
      }
    },
    '/admin/users/{id}/status': {
      patch: {
        tags: ['admin'],
        summary: 'Activate/deactivate user',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['isActive'],
                properties: {
                  isActive: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Updated' } }
      }
    },
    '/admin/audit-logs': {
      get: {
        tags: ['admin'],
        summary: 'Get audit logs',
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } }
        ],
        responses: { 200: { description: 'Audit logs' } }
      }
    },
    '/admin/tasks/{id}': {
      delete: {
        tags: ['admin'],
        summary: 'Admin delete task (hard delete)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Task deleted' } }
      }
    }
  }
});

module.exports = { buildSwaggerSpec };

