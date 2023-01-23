sendDevelopmentError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

sendProductionError = (errors, res) => {
  if (errors.isOperational) {
    res.status(errors.statusCode).json({
      status: errors.status,
      message: errors.message,
    });
  } else {
    console.error('ERROR:', errors);
    res.status(500).json({
      status: 'error',
      message: 'Something wrong, see logs for more info',
    });
  }
};

module.exports = { sendDevelopmentError, sendProductionError };
