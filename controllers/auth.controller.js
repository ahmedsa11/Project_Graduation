const ErrorHandler = require('../utils/ErrorHandler');
module.exports.authApiKey = (req, res, next) => {
  const API_KEY = req.headers['api_key'];
  if (API_KEY == undefined || API_KEY !== process.env.API_KEY) {
    return next(
      new ErrorHandler(
        'Unauthorized, You are not allowed to access this resource',
        401
      )
    );
  }

  next();
};
