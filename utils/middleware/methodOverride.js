const methodOverride = require('method-override');
const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('methodOveride');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\middleware\\methoOverride INITIALIZING!');

module.exports = methodOverride(req => {
  logger.silly('Method overide');
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
});
