const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('expensesMiddleware');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\middleware\\expenseMiddleware INITIALIZING!');

const Travel = require('../../models/Travel');
const Expense = require('../../models/Expense');
const Rate = require('../../models/Rate');

// TODO add documentation
module.exports = async (req, res, next) => {
  logger.silly('expenseIdMiddleware');
  if (
    (!res.locals.expense || res.locals.expense._id !== req.params.id) &&
    req.params.id !== 'new'
  ) {
    try {
      const baseUrl = req.baseUrl.split('/');
      const travelId = baseUrl[2];
      logger.silly(`travelId: ${travelId}`);
      const travel = await Travel.findById(travelId).populate({
        path: 'expenses',
        populate: { path: 'curRate' }
      });
      const expense = await Expense.findById(req.params.id).populate({
        path: 'curRate'
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
      res.locals.expense = expense;
      res.locals.rates = rates;
      logger.silly({ expense });
      logger.silly(`rates.length: ${rates.length}`);
      next();
    } catch (err) {
      logger.err(err);
      next(err);
    }
  } else {
    logger.silly('next()');
    next();
  }
};
