const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const setupSwagger = (app) => {
  const swaggerSpec = swaggerJsdoc({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'SecureOps TaskFlow API',
        version: '1.0.0',
        description: 'SecureOps TaskFlow API - Internship assignment project'
      },
      servers: [{ url: '/api/v1' }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js']
  });

  app.locals.swaggerSpec = swaggerSpec;
};

module.exports = { setupSwagger };

