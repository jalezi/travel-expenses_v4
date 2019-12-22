const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('travelIdMiddleware');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\middleware\\travelIdMiddleware INITIALIZING!');

const { populateTravel, findRates } = require('./populateModels');


module.exports = async (req, res, next) => {
  logger.debug('travelIdMiddleware');
  if (
    (!res.locals.travel || res.locals.travel._id !== req.params.id) &&
    req.params.id !== 'new' &&
    req.params.id !== 'total_pdf'
  ) {
    try {
      const travel = await populateTravel(req.params.id);
      let rates = await findRates(travel);
      res.locals.travel = travel;
      res.locals.rates = rates;
      logger.silly({ travel });
      logger.silly('next()');
      logger.debug('travelIdMiddleware END');
      next();
    } catch (err) {
      logger.error(err);
      logger.silly('next(err)');
      logger.debug('travelIdMiddleware END');
      next(err);
    }
  } else {
    logger.silly('next()');
    logger.debug('travelIdMiddleware END');
    next();
  }
};
