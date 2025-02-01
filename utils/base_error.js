


class BaseError extends Error {
  constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;

      Error.captureStackTrace(this, this.constructor);
  }

  static BadRequest(message) {
      return new BaseError(400, message);
  }

  static UnauthorizedError(message) {
      return new BaseError(401, message);
  }

  static ForbiddenError(message) {
      return new BaseError(403, message);
  }

  static NotFound(message) {
      return new BaseError(404, message);
  }
}

module.exports = BaseError;