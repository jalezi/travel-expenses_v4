const passport = require('passport');
// const request = require('request');

const { Strategy: LocalStrategy } = require('passport-local');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');
// const { OAuthStrategy } = require('passport-oauth');
// const { OAuth2Strategy } = require('passport-oauth');

// Logger
const LoggerClass = require('./LoggerClass');

const Logger = new LoggerClass('passport');
const { mainLogger, logger } = Logger;
mainLogger.debug('config\\passport INITIALIZING!');

const User = require('../models/User');

/**
 Determines which data of the user object should be stored in the session.
 The result of the serializeUser method is attached to the session
 as req.session.passport.user = {}.
 In this case req.session.passport.user = {id: user.id)
 * @memberof module:config/passport
 * @param {serializeUser~callback} cb
 */
passport.serializeUser((user, done) => {
  const label = 'serializeUser';
  logger.debug('Serialize User', { label });
  done(null, user.id);
});

/**
 * Passport deserializeUser callback
 * @callback serializeUser~callback
 * @param user
 * @param {function} done
 */

/**
 * The first argument of deserializeUser corresponds to the key of the user object
 * that was given to the done function (see 1.).
 * So your whole object is retrieved with help of that key.
 * That key here is the user id (key can be any key of the user object i.e. name,email etc).
 * In deserializeUser that key is matched with the in memory array / database or any data resource.

 * The fetched object is attached to the request object as req.user
 * @memberof module:config/passport
 * @param {deserializeUser~callback} cb
 */
passport.deserializeUser((id, done) => {
  const label = 'deserializeUser';
  logger.debug('Deserialize User', { label });
  User.findById(id, (err, user) => {
    if (err) logger.error(err.message, { label });
    done(err, user);
  });
});

/**
 * Passport deserializeUser callback
 * @callback deserializeUser~callback
 * @param id
 * @param {function} done
 */


/** Passport use LocalStrategy. */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  const label = 'local strategy';
  logger.debug('Using local strategy START', { label });
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) {
      logger.error(err.message, { label });
      logger.debug('return done(err)', { label });
      logger.debug('Using local strategy END', { label });
      return done(err);
    }
    if (!user) {
      logger.debug(`Email ${email} not found.`, { label });
      logger.debug('Using local strategy END', { label });
      return done(null, false, { msg: `Email ${email} not found.` });
    }
    user.comparePassword(password, (err, isMatch) => {
      logger.debug('Comparing password', { label });
      if (err) {
        logger.error(err.message, { label });
        logger.debug('Using local strategy END', { label });
        return done(err);
      }
      if (isMatch) {
        logger.debug(`Password match: ${isMatch}`, { label });
        logger.silly('returning done(null, user', { label });
        logger.debug('Using local strategy END', { label });
        return done(null, user);
      }
      logger.error('Invalid email or password');
      logger.silly('returning done(null, false, msg)', { label });
      logger.debug('Using local strategy END', { label });
      return done(null, false, { msg: 'Invalid email or password.' });
    });
  });
}));

/*
 OAuth Strategy Overview

 - User is already logged in.
   - Check if there is an existing account with a provider id.
     - If there is, return an error message. (Account merging not supported)
     - Else link new OAuth account with currently logged-in user.
 - User is not logged in.
   - Check if it's a returning user.
     - If returning user, sign in and we are done.
     - Else check if there is an existing account with user's email.
       - If there is, return an error message.
       - Else create a new account.
 */

/** Passport use LocalStrategy. */
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  logger.debug('Google Strategy');
  if (req.user) {
    logger.debug('req.user exist');
    User.findOne({ google: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        User.findById(req.user.id, (err, user) => {
          if (err) { return done(err); }
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.fName = user.profile.fName || profile.name.givenName;
          user.profile.lName = user.profile.lName || profile.name.familyName;
          user.profile.gender = user.profile.gender || profile._json.gender;
          user.profile.picture = user.profile.picture || profile._json.picture;
          user.save(err => {
            req.flash('info', { msg: 'Google account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    logger.debug('req.user does not exist');
    User.findOne({ google: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
          done(err);
        } else {
          const user = new User();
          user.email = profile.emails[0].value;
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken });
          user.profile.name = profile.displayName;
          user.profile.fName = profile.name.givenName;
          user.profile.lName = profile.name.familyName;
          user.profile.gender = profile._json.gender;
          user.profile.picture = profile._json.image.url;
          user.save(err => {
            done(err, user);
          });
        }
      });
    });
  }
}));


/**
 * @fileoverview Login and Authorization middleware.
 *
 * @module config/passport
 * @author Jaka Daneu
 * @requires NPM:passport
 * @requires NPM:passport-local
 * @requires NPM:passport-google-oauth
 * @requires module:config/LoggerClass
 * @requires module:models/User
 * @see {@link https://www.npmjs.com/package/passport NPM:passport}
 * @see {@link https://www.npmjs.com/package/passport-local NPM:passport-local}
 * @see {@link https://www.npmjs.com/package/passport-google-oauth NPM:passport-google-oauth}
 */


/**
 * Login Required middleware.
 * @memberof module:config/passport
 * @alias isAuthenticated
 * @type {function}
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
exports.isAuthenticated = (req, res, next) => {
  const label = 'isAuthenticated';
  logger.debug('isAuthenticated START', { label });
  logger.debug(`isAuthenticated: ${req.isAuthenticated}`, { label });
  if (req.isAuthenticated()) {
    logger.debug('isAuthenticated END', { label });
    return next();
  }
  logger.debug('Redirecting to /login');
  logger.debug('isAuthenticated END', { label });
  res.redirect('/login');
};


/**
 * Authorization Required middleware.
 * @memberof module:config/passport
 * @alias isAuthorized
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
exports.isAuthorized = (req, res, next) => {
  const label = 'isAuthorized';
  logger.debug('isAuthorized START', { label });
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  if (token) {
    logger.debug('next()');
    logger.debug('isAuthorized END', { label });
    next();
  } else {
    logger.debug(`Redirecting /auth/${provider}`);
    logger.debug('isAuthorized END', { label });
    res.redirect(`/auth/${provider}`);
  }
};
