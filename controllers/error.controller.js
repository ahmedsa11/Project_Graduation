const ErrorSender = require('../utils/ErrorSender');
const ErrorDetection = require('../utils/ErrorDetection');

class ErrorController {
  globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    const error = ErrorDetection(err);

    switch (process.env.NODE_ENV) {
      case 'development':
        ErrorSender.sendDevelopmentError(error, res);
        break;
      case 'production':
        ErrorSender.sendProductionError(error, res);
        break;
    }
  };
}

module.exports = new ErrorController();
