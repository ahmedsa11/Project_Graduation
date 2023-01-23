const User = require('../models/User');
const bcrypt = require('bcrypt');
const cloud = require('../utils/cloudinaryConfig');
const fs = require('fs');
const APIFeatures = require('../utils/APIFeatures');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsync = require('../utils/catchAsync');

class UserController {
  checkMobileExists = catchAsync(async (req, res, next, mobile) => {
    const user = await User.findOne({ mobile }).select('-password -__v');
    if (!user)
      return next(
        new ErrorHandler(
          { mobile: 'This mobile number does not exist' },
          404
        )
      );
    req.user = user;
    next();
  });

  getOne = catchAsync(async (req, res, next) => {
    const user = req.user;

    res.status(200).json({
      status: 'success',
      data: user,
    });
  });
  getAll = catchAsync(async (req, res, next) => {
    const APIFeature = new APIFeatures(User.find(), req.query);
    const query = APIFeature.filter()
      .sort()
      .select()
      .paginate()
      .getQuery();

    const users = await query;

    // if (!users || users.length === 0)
    //   return next(new ErrorHandler('No users found', 404));

    res.status(200).json({
      status: 'success',
      length: users.length,
      users: users,
    });
  });
  update = catchAsync(async (req, res, next) => {
    const mobile = req.params.mobile;
    const user = await User.findOneAndUpdate({ mobile }, req.body, {
      new: true,
      runValidators: true,
    }).select('-password -__v');

    res.status(200).json({
      status: 'success',
      data: user,
    });
  });
  //image
  updateImage = catchAsync(async (req, res, next) => {
    const mobile = req.params.mobile;
    const result = await cloud.uploads(req.files[0].path);

    const user = await User.findOneAndUpdate(
      { mobile },
      { image: result.url },
      {
        new: true,
        runValidators: true,
      }
    ).select('-password -__v');

    fs.unlinkSync(req.files[0].path);

    res.status(200).json({
      status: 'success',
      data: user,
    });
  });
  delete = catchAsync(async (req, res, next) => {
    const mobile = req.params.mobile;
    const user = await User.findOneAndDelete({ mobile }).select(
      '-password -__v'
    );

    res.status(200).json({
      status: 'success',
      data: user,
    });
  });
  create = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body);

    user.password = undefined;
    user.__v = undefined;

    res.status(201).json({
      status: 'success',
      data: user,
    });
  });
  login = catchAsync(async (req, res, next) => {
    const mobile = req.body.mobile;
    const password = req.body.password;

    if (!mobile)
      return next(new ErrorHandler({ mobile: 'Mobile is required' }, 400));
    if (!password)
      return next(
        new ErrorHandler({ password: 'Password is required' }, 400)
      );

    const user = await User.findOne({ mobile });
    if (!user)
      return next(
        new ErrorHandler(
          { mobile: "This mobile number doesn't exist" },
          404
        )
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return next(new ErrorHandler({ password: 'Wrong password' }, 400));

    user.password = undefined;
    user.__v = undefined;

    res.status(200).json({
      status: 'success',
      data: user,
    });
  });
}
module.exports = new UserController();
