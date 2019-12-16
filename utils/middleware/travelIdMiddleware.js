const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('travelMiddleware');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\middleware\\redirectAfterLogin INITIALIZING!');

const Travel = require('../../models/Travel');
const Rate = require('../../models/Rate');


module.exports = async (req, res, next) => {
  logger.silly('travelIdMiddleware');
  if (
    (!res.locals.travel || res.locals.travel._id !== req.params.id) &&
    req.params.id !== 'new' &&
    req.params.id !== 'total_pdf'
  ) {
    try {
      const travel = await Travel.findById(req.params.id).populate({
        path: 'expenses',
        populate: { path: 'curRate' }
      });
      let rates = await Rate.findRatesOnDate(travel, err => {
        if (err) {
          throw err;
        }
      });

      if (rates.length === 0) {
        rates = await Rate.findRateBeforeOrAfterDate(travel, err => {
          if (err) {
            throw new Error(err);
          }
        });
      }
      res.locals.travel = travel;
      res.locals.rates = rates;
      logger.silly({ travel });
      logger.silly(`rates.length: ${rates.length}`);
      next();
    } catch (err) {
      logger.error(err);
      next(err);
    }
  } else {
    logger.silly('next()');
    next();
  }
};
