// jshint esversion: 6

const { promisify } = require('util');
const crypto = require('crypto');
// const nodemailer = require('nodemailer');
const passport = require('passport');
const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('user');
const { mainLogger, logger } = Logger;
mainLogger.debug('controllers\\user INITIALIZING');

const User = require('../models/User');
const Travel = require('../models/Travel');
const Expense = require('../models/Expense');
const { toTitleCase } = require('../utils/utils');

const { reqAssertion } = require('./userMiddleware');

const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * User routes
 * @module controllers/user
 * @requires NPM:util
 * @requires NPM:crypto
 * @requires NPM:passport
 * @requires NPM:node-mailjet
 * @requires module:config/LoggerClass
 * @requires module:models/User
 * @requires module:models/Travel
 * @requires module:models/Expense
 * @requires module:utils/utils
 * @see {@link https://www.npmjs.com/package/util NPM:util}
 * @see {@link https://www.npmjs.com/package/crypto NPM:crypto}
 * @see {@link https://www.npmjs.com/package/passport NPM:passport}
 * @see {@link https://www.npmjs.com/package/node-mailjet NPM:node-mailjet}
 */

/**
 * GET /login
 *
 * Login page.
 */
exports.getLogin = (req, res) => {
  const label = 'getLogin';
  logger.debug('Getting login page', { label });
  if (req.user) {
    logger.silly('User already logged in!', { label });
    logger.silly('Redirecting to home page.', { label });
    return res.redirect('/');
  }
  logger.silly('User not logged in!', { label });
  logger.silly('Redirecting to login page.', { label });
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 *
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  const label = 'postLogin';
  logger.debug('Posting login form', { label });
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.assert('password', 'Password cannot be blank.').notEmpty();
  req.sanitize('email').normalizeEmail({
    gmail_remove_dots: false
  });

  const errors = req.validationErrors();

  if (errors) {
    logger.warn('There are some req assertion errors', { label });
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', (err, user, info) => {
    const label = 'passport auth';
    if (err) {
      logger.error(err.message, { label });
      return next(err);
    }
    logger.debug('No error', { label });
    if (!user) {
      logger.error(info.msg, { label });
      req.flash('errors', info);
      return res.redirect('/login');
    }
    logger.debug('User exists', { label });
    req.logIn(user, err => {
      const label = 'req.logIn';
      if (err) {
        logger.error(err.message, { label });
        return next(err);
      }
      logger.debug('Success! User is logged in.', { label });
      req.flash('success', {
        msg: 'Success! You are logged in.'
      });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};

/**
 * GET /logout
 *
 * Log out.
 */
exports.logout = (req, res) => {
  const label = 'logout';
  logger.debug('Getting logout', { label });
  req.logout();
  req.session.destroy(err => {
    if (err) {
      logger.error('Failed to destroy the session during logout.', { label });
      logger.error(err.message);
    }
    req.user = null;
    res.redirect('/');
  });
};

/**
 * GET /signup
 *
 * Signup page.
 */
exports.getSignup = (req, res) => {
  const label = 'getSignup';
  logger.debug('Getting signup page', { label });
  if (req.user) {
    logger.debug('Redirecting to home. User allready logged in', { label });
    return res.redirect('/');
  }
  logger.debug('No user.', { label });
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 *
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  const label = 'postSignup';
  logger.debug('Posting signup form', { label });
  let assertObject = { email: true, password: true, cPassword: true, profile: true };
  let errors = reqAssertion(req, assertObject);
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    profile: {
      fName: req.body.fName,
      lName: req.body.lName
    },
    team: req.body.team,
    jobPosition: req.body.jobPosition
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    const label = 'findOne';
    if (err) {
      logger.error(err.message, { label });
      return next(err);
    }
    logger.debug('No error', { label });
    if (existingUser) {
      logger.error('Account with that email address already exists.', { label });
      req.flash('errors', {
        msg: 'Account with that email address already exists.'
      });
      return res.redirect('/signup');
    }
    logger.info('New user', { label });
    user.save(err => {
      const label = 'save';
      if (err) {
        logger.error(err.message, { label });
        return next(err);
      }
      logger.debug('No error', { label });
      req.logIn(user, err => {
        const label = 'req.logIn';
        if (err) {
          logger.error(err.message, { label });
          return next(err);
        }
        logger.debug('No error', { label });
        res.redirect('/');
      });
    });
  });
};

/**
 * GET /account
 *
 * Profile page.
 */
exports.getAccount = (req, res) => {
  const label = 'getAccount';
  logger.debug('Getting account page', { label });
  if (req.user) {
    logger.debug('Account find', { label });
    const { team, jobPosition } = req.user;
    if (team === '') {
      req.flash('info', { msg: 'To create PDF you need to define TEAM' });
    }
    if (jobPosition === '') {
      req.flash('info', { msg: 'To create PDF you need to define POSITION' });
    }
  }
  logger.silly('req.user exists.', { label });
  res.render('account/profile', {
    title: 'Account Management'
  });
};

/**
 * POST /account/profile
 *
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
  const label = 'postUpdateProfile';
  logger.debug('Updating account profile', { label });
  let assertObject = { email: true, hCurrency: true, profile: true };
  let errors = reqAssertion(req, assertObject);
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  if (!errors) {
    logger.warn('Errors exists.', { label });
    errors = req.validationErrors();
  }

  if (errors) {
    logger.debug('req.flash', { label });
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    const label = 'findById';
    if (err) {
      logger.error(err.message, { label });
      return next(err);
    }
    logger.debug('Update user from form', { label });
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.fName = req.body.fName || '';
    user.profile.lName = req.body.lName || '';
    user.team = req.body.team || '';
    user.jobPosition = req.body.jobPosition || '';
    user.profile.gender = req.body.gender || '';
    user.homeCurrency = req.body.homeCurrency.toUpperCase() || '';
    user.homeDistance = req.body.homeDistance || '';
    user.perMileAmount = req.body.perMileAmount || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';
    user.save(err => {
      const label = 'save';
      if (err) {
        logger.error(err.message, { label });
        if (err.code === 11000) {
          logger.error('The email address you have entered is already associated with an account.', { label });
          req.flash('errors', {
            msg:
              'The email address you have entered is already associated with an account.'
          });
          logger.debug('redirecting to /account', { label });
          return res.redirect('/account');
        }
        logger.silly('next(err)', { label });
        return next(err);
      }
      logger.debug('Profile information has been updated.', { label });
      logger.debug('redirecting to /account', { label });
      req.flash('success', { msg: 'Profile information has been updated.' });
      res.redirect('/account');
    });
  });
};

// TODO set min password length and apply to req.assert
/**
 * POST /account/password
 *
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
  logger.debug('Updating account password');
  let assertObject = { password: true, cPassword: true };

  const errors = reqAssertion(req, assertObject);

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    user.password = req.body.password;
    user.save(err => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 *
 * Delete user account.
 */
exports.postDeleteAccount = async(req, res, next) => {
  logger.debug('Deleting account');
  const travelsIds = req.user.travels;
  await Expense.deleteMany({ travel: { $in: travelsIds } }, err => {
    if (err) {
      logger.error('Deleting account END - Expense - next err');
      next(err);
    }
  });
  await Travel.deleteMany({ _user: req.user._id }, err => {
    if (err) {
      logger.error('Deleting account END - Travel - next err');
      next(err);
    }
  });
  await User.deleteOne({ _id: req.user.id }, err => {
    if (err) {
      logger.error('Deleting account END - User - return next err');
      return next(err);
    }
    req.logout();
    req.flash('info', { msg: 'Your account has been deleted.' });
    logger.debug('Deleteing account END');
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 *
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
  const { provider } = req.params;
  logger.debug(`Unlinking ${provider}`);
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    const lowerCaseProvider = provider.toLowerCase();
    const titleCaseProvider = toTitleCase(provider);
    user[lowerCaseProvider] = undefined;
    const tokensWithoutProviderToUnlink = user.tokens.filter(
      token => token.kind !== lowerCaseProvider
    );
    // Some auth providers do not provide an email address in the user profile.
    // As a result, we need to verify that unlinking the provider is safe by ensuring
    // that another login method exists.
    if (
      !(user.email && user.password) &&
      tokensWithoutProviderToUnlink.length === 0
    ) {
      req.flash('errors', {
        msg:
          `The ${titleCaseProvider} account cannot be unlinked without another form of login enabled.` +
          ' Please link another account or add an email address and password.'
      });
      return res.redirect('/account');
    }
    user.tokens = tokensWithoutProviderToUnlink;
    user.save(err => {
      if (err) {
        return next(err);
      }
      req.flash('info', {
        msg: `${titleCaseProvider} account has been unlinked.`
      });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 *
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
  logger.debug('Getting reset password page');
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User.findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires')
    .gt(Date.now())
    .exec((err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('errors', {
          msg: 'Password reset token is invalid or has expired.'
        });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 *
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => {
  logger.debug('Reseting password');
  let assertObject = { password: true, rPassword: true };
  const errors = reqAssertion(req, assertObject);

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }
  const resetPassword = () =>
    User.findOne({ passwordResetToken: req.params.token })
      .where('passwordResetExpires')
      .gt(Date.now())
      .then(user => {
        if (!user) {
          req.flash('errors', {
            msg: 'Password reset token is invalid or has expired.'
          });
          return res.redirect('back');
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        return user
          .save()
          .then(
            () =>
              new Promise((resolve, reject) => {
                req.logIn(user, err => {
                  if (err) {
                    return reject(err);
                  }
                  resolve(user);
                });
              })
          )
          .catch(err => err);
      })
      .catch(err => err);

  const sendResetPasswordEmail = user => {
    if (!user) {
      return;
    }
    const sendEmail = mailjet.post('send', { version: 'v3.1' });
    const emailData = {
      Messages: [
        {
          From: {
            Email: 'jaka.daneu@siol.net',
            Name: 'Mailjet Pilot'
          },
          To: [
            {
              Email: user.email,
              Name: user.fullName()
            }
          ],
          Subject: 'Your password for TExpenses has been changed',
          TextPart: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
        }
      ]
    };
    return sendEmail
      .request(emailData)
      .then(() => {
        req.flash('success', {
          msg: 'Success! Your password has been changed.'
        });
      })
      .catch(err => {
        if (err.message === 'self signed certificate in certificate chain') {
          console.log(
            'WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.'
          );
          req.flash('success', {
            msg: 'Success! Your password has been changed.'
          });
        }
        console.log(
          'ERROR: Could not send password reset confirmation email after security downgrade.\n',
          err
        );
        req.flash('warning', {
          msg:
            'Your password has been changed, however we were unable to send you a confirmation email. We will be looking into it shortly.'
        });
        return err;
      });
  };

  resetPassword()
    .then(sendResetPasswordEmail)
    .then(() => {
      if (!res.finished) res.redirect('/');
    })
    .catch(err => next(err));
};

/**
 * GET /forgot
 *
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {
  logger.debug('Getting forgot page');
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 *
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
  logger.debug('Posting forgot form');
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  const createRandomToken = randomBytesAsync(16).then(buf =>
    buf.toString('hex'));

  const setRandomToken = token =>
    User.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        req.flash('errors', {
          msg: 'Account with that email address does not exist.'
        });
      } else {
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        user = user.save();
      }
      return user;
    });

  const sendForgotPasswordEmail = user => {
    if (!user) {
      return;
    }
    const token = user.passwordResetToken;
    const sendEmail = mailjet.post('send', { version: 'v3.1' });
    const emailData = {
      Messages: [
        {
          From: {
            Email: 'jaka.daneu@siol.net',
            Name: 'TExpenses App'
          },
          To: [
            {
              Email: user.email,
              Name: user.fullName()
            }
          ],
          Subject: 'Reset your password for TExpenses',
          TextPart: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
            //       Please click on the following link, or paste this into your browser to complete the process:\n\n
            //       http://${req.headers.host}/reset/${token}\n\n
            //       If you did not request this, please ignore this email and your password will remain unchanged.\n`
        }
      ]
    };

    return sendEmail
      .request(emailData)
      .then(() => {
        req.flash('info', {
          msg: `An e-mail has been sent to ${user.email} with further instructions.`
        });
      })
      .catch(err => {
        if (err.message === 'self signed certificate in certificate chain') {
          console.log(
            'WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.'
          );
        }
        req.flash('errors', {
          msg:
            'Error sending the password reset message. Please try again shortly.'
        });
        return err;
      });
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .then(() => res.redirect('/login'))
    .catch(next);
};
