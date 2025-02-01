const BaseError = require("../utils/base_error")

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log('Error:', err);
  
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof BaseError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(error => error.message).join(', ');
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandlerMiddleware;
