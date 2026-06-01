const { ApiError } = require('../utils/ApiError');

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      const errors = result.error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message
      }));
      throw new ApiError({ statusCode: 400, message: 'Validation Error', errors });
    }

    // overwrite with parsed values if needed
    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;

    return next();
  };
};

module.exports = { validate };

