const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const url =
  'https://res.cloudinary.com/dwmkkev1m/image/upload/v1649086173/gvazockkewjb3u98s1as.jpg';

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
    minLength: [3, 'Name must contain at least 3 characters'],
    required: [true, 'Name is required'],
  },
  mobile: {
    type: String,
    unique: true,
    required: [true, 'Mobile is required'],
  },
  password: {
    type: String,
    minLength: [8, 'Password must contain at least 8 characters'],
    required: [true, 'Password is required'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    lowercase: true,
  },
  image: {
    type: String,
    default: url,
  },
  fcm: {
    type: String,
    default: 'no',
  },
  disabilities: String,
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  if (this._update.password) {
    const salt = await bcrypt.genSalt(12);
    this._update.password = await bcrypt.hash(this._update.password, salt);
  }
  next();
});

module.exports = mongoose.model('Users', UserSchema);
