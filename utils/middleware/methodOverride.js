const methodOverride = require('method-override');
const { addLogger } = require('../../loaders/logger');

const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

module.exports = methodOverride(req => {
  Logger.silly('Method overide');
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
});
