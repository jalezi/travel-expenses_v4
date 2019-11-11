/*
 * User Schema
 * email: login email
 * password: login password
 * passwordResetToken: token send to user to reset the password
 * passwordResetExpires: when passwordResetToken expires
 * google: google id when user signin or link the account
 * tokens: array of tokens
 * profile: object with user's -
 *  name, gender, location, website, picture, first name (fName), last name (lName)
 * team: user's team
 * jobPosition: user's job
 * travels: array of travel' ids -
 *  links to travels collection in DB => TravelSchema in ./models/Expense.js
 * homeCurrency: currency to calculate all amounts to
 * homeDistance: to which linear measure expense will be calculate to: miles(mi) or kilometers(km)
 * perMileAmount: amount to convert distance to expense
 * timestamps: creates two values => createdAr, updatedAt - Mongoose Schema option
 */

const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  google: String,
  tokens: Array,

  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String,
    fName: String,
    lName: String
  },
  team: {
    type: String,
    maxlength: 30
  },
  jobPosition: {
    type: String,
    maxlength: 30
  },
  travels: Array,
  homeCurrency: {
    type: String,
    default: 'USD'
  },
  homeDistance: {
    type: String,
    default: 'mi'
  },
  perMileAmount: {
    type: Number,
    default: 0.54
  },
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

/**
* Helper method for getting user's full name
*/
userSchema.methods.fullName = function fullName() {
  const result = `${this.profile.fName} ${this.profile.lName}`;
  return result;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
