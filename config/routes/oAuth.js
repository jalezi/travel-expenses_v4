const passport = require('passport');

const LoggerClass = require('../LoggerClass');

const Logger = new LoggerClass('oAuth');
const { mainLogger, logger } = Logger;
mainLogger.debug('config\\routes\\oAuth INITIALIZING!');

/**
 * Defines oAuth routes.
 * @module config/routes/oAuth
 * @requires module:config/LoggerClass
 * @requires module:config/passport
 * @requires module:controllers/expense
 */

/**
 * oAuth Routes.
 * @param {Express} app
 */
module.exports = app => {
  // OAuth authentication routes. (Sign in)
  logger.debug('OAuth routes initializing');
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: 'profile email'
    })
  );
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login'
    }),
    (req, res) => {
      res.redirect(req.session.returnTo || '/');
    }
  );
};
