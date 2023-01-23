module.exports = catchAsync = (fn) => {
  return async (req, res, next, val = null) => {
    try {
      await fn(req, res, next, val);
    } catch (err) {
      next(err);
    }
  };
};
