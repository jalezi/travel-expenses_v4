const { addLogger } = require('../../loaders/logger');

const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

module.exports = (req, res, next) => {
  // After successful login, redirect back to the intended page
  if (
    !req.user &&
    req.path !== '/login' &&
    req.path !== '/signup' &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)
  ) {
    req.session.returnTo = req.originalUrl;
    Logger.silly('No user - redirecting to originalUrl');
  } else if (
    req.user &&
    (req.path === '/account' || req.path.match(/^\/api/))
  ) {
    req.session.returnTo = req.originalUrl;
    Logger.silly('User OK - route "/account"');
  }
  Logger.silly('App use redirect next()');
  next();
};
