const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('redirectAfterLogin');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\middleware\\redirectAfterLogin INITIALIZING!');

module.exports = (req, res, next) => {
  // After successful login, redirect back to the intended page
  logger.silly('redirectAfterLogin');
  if (
    !req.user &&
    req.path !== '/login' &&
    req.path !== '/signup' &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)
  ) {
    logger.debug(`Returning to: ${res.originalUrl}`);
    req.session.returnTo = req.originalUrl;
  } else if (
    req.user &&
    (req.path === '/account' || req.path.match(/^\/api/))
  ) {
    logger.debug(`Returning to: ${res.originalUrl}`);
    req.session.returnTo = req.originalUrl;
  }
  logger.silly('next()');
  next();
};
