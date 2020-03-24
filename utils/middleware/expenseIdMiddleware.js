const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('expenseIdMiddleware');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\middleware\\expenseIdMiddleware INITIALIZING!');

const { populateTravel, populateExpense, findRates } = require('./populateModels');

// TODO add documentation
module.exports = async (req, res, next) => {
  logger.debug('expenseIdMiddleware');
  if (
    (!res.locals.expense || res.locals.expense._id !== req.params.id) &&
    req.params.id !== 'new'
  ) {
    try {
      const baseUrl = req.baseUrl.split('/');
      const travelId = baseUrl[2];
      logger.silly(`travelId: ${travelId}`);
      const travel = await populateTravel(travelId);
      const expense = await populateExpense(req.params.id);
      let rates = await findRates(travel);
      res.locals.expense = expense;
      res.locals.rates = rates;
      logger.silly({ expense });
      logger.silly('next()');
      logger.debug('expenseIdMiddleware END');
      next();
    } catch (err) {
      logger.error(err.message);
      logger.silly('next(err)');
      logger.debug('expenseIdMiddleware END');
      next(err);
    }
  } else {
    logger.silly('next()');
    logger.debug('expenseIdMiddleware END');
    next();
  }
};
