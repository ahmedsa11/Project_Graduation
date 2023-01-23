const ErrorHandler = require('./ErrorHandler');
module.exports = errorDetection = (err) => {
  let errors = {};

  // Duplicate error (When someone sign up with existing mobile)
  if (err.code === 11000) {
    errors.mobile = 'This mobile number already exists';
    err.statusCode = 400;
  }
  // If the validation of some input fields is failed
  else if (err.name === 'ValidationError') {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
    err.statusCode = 400;
  }
  // If the error massege pass as string
  else if (typeof err.message === 'string') errors = err.message;
  // Unknown error
  else errors = Object.assign(errors, err.message);
  return new ErrorHandler(errors, err.statusCode);
};
