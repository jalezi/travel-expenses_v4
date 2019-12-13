const passport = require('passport');
// const request = require('request');

const { Strategy: LocalStrategy } = require('passport-local');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');
// const { OAuthStrategy } = require('passport-oauth');
// const { OAuth2Strategy } = require('passport-oauth');

// Logger
const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('passport');
const { mainLogger, logger } = Logger;
mainLogger.debug('config\\passport REQUIRED!');

const User = require('../models/User');

/*
 Determines which data of the user object should be stored in the session.
 The result of the serializeUser method is attached to the session
 as req.session.passport.user = {}.
 In this case req.session.passport.user = {id: user.id)
 */
passport.serializeUser((user, done) => {
  logger.debug('Serialize User');
  done(null, user.id);
});

/*
 The first argument of deserializeUser corresponds to the key of the user object
 that was given to the done function (see 1.).
 So your whole object is retrieved with help of that key.
 That key here is the user id (key can be any key of the user object i.e. name,email etc).
 In deserializeUser that key is matched with the in memory array / database or any data resource.

 The fetched object is attached to the request object as req.user
 */
passport.deserializeUser((id, done) => {
  logger.debug('Deserialize User');
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


// Sign in using Email and Password.
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  logger.debug('Local strategy');
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { msg: `Email ${email} not found.` });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      }
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

// Sign in with Google.
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  logger.debug('Google Strategy');
  if (req.user) {
    Logger.debug('req.user exist');
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


// Login Required middleware.
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  logger.debug('Redirecting to /login');
  res.redirect('/login');
};


// Authorization Required middleware.
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  if (token) {
    logger.debug(next());
    next();
  } else {
    logger.debug(`Redirecting /auth/${provider}`);
    res.redirect(`/auth/${provider}`);
  }
};
