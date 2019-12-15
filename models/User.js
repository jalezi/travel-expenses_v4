<<<<<<< HEAD
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

=======
>>>>>>> develop
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const { addLogger } = require('../config/logger');

// Logger
const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

// Represents User mongoose document
const userSchemaObject = {

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
  }
};

// User Schema
const UserSchema = new mongoose.Schema(
  userSchemaObject,
  { timestamps: true }
);

// Password hash mongoose pre hook middleware function
UserSchema.pre('save', function save(next) {
  Logger.debug('UserSchema.pre save()');
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

/*
 Helper method for validating user's password
 It is User document method.
 */
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/*
 Helper method for getting user's gravatar.
 It is User document method.
 Returns gravatar url
 */
UserSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

/*
Helper method for getting user's full name
It is User document method.</p>
Returns User's full name
*/
<<<<<<< HEAD
userSchema.methods.fullName = function fullName() {
  const result = `${this.profile.fName} ${this.profile.lName}`;
  return result;
};
=======
UserSchema.methods.fullName = function fullName() {
  const result = `${this.profile.fName} ${this.profile.lName}`;
  return result;
};

// User mongoose model
const User = mongoose.model('User', UserSchema);
>>>>>>> develop


module.exports = User;
