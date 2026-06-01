const ApiResponse = (success, message, data = {}) => ({
  success,
  message,
  data
});

module.exports = { ApiResponse };

