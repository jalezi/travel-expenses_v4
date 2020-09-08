const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('User');
const { mainLogger, logger } = Logger;
mainLogger.debug('models\\User INITIALIZING!');

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
  const label = 'UserSchema.pre save';
  logger.debug('UserSchema.pre save() START', { label });
  const user = this;
  if (!user.isModified('password')) {
    logger.debug('User password not modified.', { label });
    logger.silly('returning next()', { label });
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    logger.debug('bcrypt.genSalt', { label });
    if (err) {
      logger.error(err.message, { label });
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      logger.debug('bcrypt.hash', { label });
      if (err) {
        logger.error(err.message, { label });
        return next(err);
      }
      user.password = hash;
      logger.silly('returning next()', { label });
      next();
    });
  });
  logger.debug('UserSchema.pre save() END', { label });
});

/*
 Helper method for validating user's password
 It is User document method.
 */
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  const label = 'UserSchema.methods';
  logger.debug('UseSchema.methods.comparePassword START', { label });
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    logger.debug('bcrypt.compare', { label });
    if (err) logger.error(err.message, { label });
    logger.silly(`Password match: ${isMatch}`, { label });
    logger.silly('calling cb(err, isMatch', { label });
    cb(err, isMatch);
  });
  logger.debug('UseSchema.methods.comparePassword END', { label });
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
UserSchema.methods.fullName = function fullName() {
  const result = `${this.profile.fName} ${this.profile.lName}`;
  return result;
};

// User mongoose model
const User = mongoose.model('User', UserSchema);


module.exports = User;
