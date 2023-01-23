class ErrorHandler extends Error {
  constructor(errors, statusCode) {
    super(errors);
    this.statusCode = statusCode;
    this.status = 'error';
    this.isOperational = true;
    this.message = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler;
