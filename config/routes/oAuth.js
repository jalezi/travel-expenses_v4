const passport = require('passport');

const { addLogger } = require('..//logger');

// Logger
const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);


module.exports = app => {
  // OAuth authentication routes. (Sign in)
  Logger.debug('OAuth routes initializing');
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
