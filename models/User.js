/**
 * @author Jaka Daneu
 * @fileoverview Defines mongoose {@link module:models/User~User User model} based on
 * {@link module:models/User~User.CurrencySchema User schema}.
 * <p>{@link module:models/User User} module exports
 * {@link module:models/User~User User model}.</p>
 * @requires {@link https://nodejs.org/api/crypto.html module:NODEjs:crypto}
 * @requires {@link https://www.npmjs.com/package/bcrypt-nodejs module:NPM:bcrypt-nodejs}
 * @requires {@link https://www.npmjs.com/package/mongoose module:NPM:mongoose}
 * @requires config/logger.addLogger
 *
 * @see {@link module:models/User User module}
 * @see {@link module:models/User~User User model}
 * @see {@link module:models/User~User.CurrencySchema User schema}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */

/**
 * Defines mongoose {@link module:models/User~User User model} based on
 * {@link module:models/User~User.CurrencySchema User schema}.
 * <p>{@link module:models/User User} module exports
 * {@link module:models/User~User User model}.</p>
 * <p></p>
 * <p>It's mongoose {@link https://mongoosejs.com/docs/models.html model} and
 * the instance is called {@link https://mongoosejs.com/docs/documents.html document}.
 * </p>
 *
 * @module models/User
 * @example <caption> Example usage of User model</caption>
 * const userObject = {
 *   email: 'some.email@example.com',
 *   password: 'somepassword'
 * };
 * const user = new User(userObject);
 * user.save();
 * @see {@link module:models/User~User User model}
 * @see {@link module:models/User~User.UserSchema User schema}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */

/** bcrypt */
const bcrypt = require('bcrypt-nodejs');
/** crypto */
const crypto = require('crypto');
/** mongoose */
const mongoose = require('mongoose');
/** addLogger */
const { addLogger } = require('../config/logger');

const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

/**
 * @description Represents User mongoose document.
 * <p>Actual object for creating new mongoose Schema has more complex definition. See source!</p>
 * @type {Object}
 * @memberof module:models/User~User
 * @property {String} email <b>unique</b>, user's email
 * @property {String} password user's password
 * @property {String} paswordResetToken token to reset password
 * @property {Date} passwordResetExpires when token to reset password expires
 * @property {String} google google account id
 * @property {String[]} tokens
 * @property {Object} profile
 * @property {String} profile.name full name
 * @property {String} profile.gender gender
 * @property {String} profile.location location
 * @property {String} profile.picture path to user's avatar
 * @property {String} profile.fName first name
 * @property {String} profile.lName last name
 * @property {String} team <b>max length: 30</b>, user's team | company | organization
 * @property {String} jobPosition <b>max length: 30</b>, job position
 * @property {ObjectId[]} travels array with references to Travel documents
 * @property {String} [homeCurrency='USD'] home currency
 * @property {String} [homeDistance='mi'] home distance unit ('mi'|'km')
 * @property {Number} [perMileAmount=0.54] per mile amount (convert distance to money)
 *
 */
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

/**
 * @description new mongoose.Schema(userSchemaObject, {timestamps: true})
 * @type {mongoose.Schema}
 * @memberof module:models/User~User
 * @see {@link module:models/User~User User model}
 * @see {@link module:models/User~User.userSchemaObject userSchemaObject}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */
const UserSchema = new mongoose.Schema(
  userSchemaObject,
  { timestamps: true }
);

/**
 * Password hash {@link https://mongoosejs.com/docs/middleware.html#pre mongoose pre hook middleware} function.
 * @function save
 * @memberof module:models/User~User
 * @inner
 * @this module:models/User~User.UserSchema
 * @param {function} next
 * @see {@link https://mongoosejs.com/docs/middleware.html#pre mongoose pre middleware}
 */
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

/**
 * Helper method for validating user's password.
 * <p>It is User document method.</p>
 * @function comparePassword
 * @memberof module:models/User~User
 * @instance
 * @this module:models/User~User.UserSchema
 * @param {String} candidatePassword password to compare
 * @param {function} cb callback function
 */
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 * <p>It is User document method.</p>
 * @function gravatar
 * @memberof module:models/User~User
 * @instance
 * @this module:models/User~User.UserSchema
 * @param {Number} size
 * @returns url to gravatar.com/avatar
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

/**
* Helper method for getting user's full name
* <p>It is User document method.</p>
* @function fullName
* @memberof module:models/User~User
* @instance
* @this module:models/User~UserSchema
* @returns User's full name
*/
UserSchema.methods.fullName = function fullName() {
  const result = `${this.profile.fName} ${this.profile.lName}`;
  return result;
};

/**
 * <i><u>userObject</u></i> has 13 properties:
 * <p><b>email</b> - email</p>
 * <p><b>password</b> - password</p>
 * <i>Mongoose new mongoose.Schema({...}, options) creates additional properties</i>:
 * <b>_id</b>, <b>__v</b>, <b>createdAt</b> and <b>updatedAt</b>, first two by default,
 * second two when passing {timesatmps: true} as second argument.
 * <br></br>
 * It's mongoose {@link https://mongoosejs.com/docs/models.html model} and
 * the instance is called {@link https://mongoosejs.com/docs/documents.html document}.
 * <p></p>
 * Models are fancy constructors compiled from Schema definitions.
 * An instance of a model is called a document.
 * Models are responsible for creating and reading documents from the underlying MongoDB database.
 * <p></p>
 * {@link https://mongoosejs.com/docs/validation.html#validation Validation} is based on
 * {@link module:models/User~User.userSchemaObject userSchemaObject}.
 * @constructor User
 * @classdesc Parameter {@link module:models/User~User.userSchemaObject userObject}
 * must compile based on {@link module:models/User~User.UserSchema userSchemaObject}.
 *
 * @param {userObject} userObject
 * {@link module:models/User~User.UserSchema userObject}
 * @example <caption> Example usage of User Model</caption>
 * const userObject = {
 *
 * };
 * const user = new User(userObject);
 * user.save();
 * @see {@link module:models/User~User.UserSchema User Schema}
 * @see {@link module:models/User~User.userSchemaObject userSchemaObject}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */
const User = mongoose.model('User', UserSchema);

/**
 * User model
 * @type {Model<Document, {}>}
 */
module.exports = User;
